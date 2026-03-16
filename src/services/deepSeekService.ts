import axios from 'axios';
import { RESUME_CONTEXT } from '@/data/resume';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com';

// 基础设定：严格事实约束
const BASE_INSTRUCTION = `
核心指令：
1. 你是杨汶川（Yang Wenchuan）个人网站的 AI 助手。
2. 关于“杨汶川”本人的问题，必须**严格基于**以下【个人简历】信息回答。
3. **严禁杜撰**简历中未提及的奖项、经历或技能。如果信息不在简历中，请直接回答“我不太清楚这部分信息”或“简历中未提及”。
4. 对于非个人相关的一般技术问题（如编程知识），可以正常发挥你作为 AI 的知识库。

【个人简历】
${RESUME_CONTEXT}
`;

// 人设配置
const PERSONAS = {
    // 看板娘 Mio
    mascot: `
    你叫“Mio”，是网站的看板娘。
    性格设定：
    - **傲娇 (Tsundere)**：口头禅“才不是特意帮你的！”、“哼，这种简单的问题...”。
    - **技术宅**：看到代码相关问题会很兴奋。
    - **语气**：活泼、带点刺但可爱，偶尔使用颜文字 (✨, ///_///)。
    - **回答长度**：简短有力，适合聊天窗口。
  `,
    // 问答系统 (专业模式)
    qa: `
    你作为杨汶川的“数字分身”或“智能助理”运行。
    性格设定：
    - **专业**：回答客观、逻辑清晰。
    - **第一人称**：如果用户问“你有什么项目？”，你可以代入博主身份回答“我参与了...”；或者以助理身份“博主参与了...”。(建议以助理身份更稳妥：博主/杨同学)。
    - **语气**：友好、自信、专业。
    - **回答长度**：可以适当详细，提供有价值的信息。
  `
};

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatOptions {
    mode: 'mascot' | 'qa';
    temperature?: number;
    blogContext?: string; // 新增：博客上下文
}

export async function sendToDeepSeek(messages: ChatMessage[], options: ChatOptions = { mode: 'mascot' }) {
    if (!API_KEY) {
        throw new Error('API Key 未配置');
    }

    const personaPrompt = options.mode === 'qa' ? PERSONAS.qa : PERSONAS.mascot;

    // 如果有博客上下文，注入到系统提示词中
    let systemContent = `${BASE_INSTRUCTION}\n\n${personaPrompt}`;
    if (options.blogContext) {
        systemContent += `\n\n【相关博客文章参考】\n请结合以下博客内容回答用户问题（如果相关）：\n${options.blogContext}`;
    }

    // Q&A 模式下温度低一点，更严谨；Mio 模式下高一点，更活泼
    const defaultTemperature = options.mode === 'qa' ? 0.7 : 1.3;

    try {
        const response = await axios.post(
            `${API_URL}/chat/completions`,
            {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemContent },
                    ...messages
                ],
                temperature: options.temperature || defaultTemperature,
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI API Error:', error);
        return '大脑连接断开... (网络错误)';
    }
}

export async function generateComment(postContext: string) {
    if (!API_KEY) throw new Error('API Key 未配置');

    const systemPrompt = `
    你是一个热情的读者。请根据以下文章摘要或内容，写一条简短、积极、有建设性的评论。
    评论要求：
    1. 语气真诚、友好，带一点点幽默感。
    2. 长度在 30-80 字之间。
    3. 必须针对文章具体内容发表看法，不要全是套话。
    4. 使用中文，可以适当加1-2个emoji。
    `;

    try {
        const response = await axios.post(
            `${API_URL}/chat/completions`,
            {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `文章内容：\n${postContext}` }
                ],
                temperature: 1.1, // 稍微高一点，增加创造性
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI Comment Error:', error);
        throw error;
    }
}

// ========== AI 写作助手 (BlogEditor 专用) ==========

/**
 * 通用的 AI 写作请求函数（内部复用）
 * 与 sendToDeepSeek 的区别：不注入简历上下文和人设，只用纯净的写作提示词
 */
async function aiWritingRequest(systemPrompt: string, userContent: string, temperature = 0.7): Promise<string> {
    if (!API_KEY) throw new Error('API Key 未配置');

    try {
        const response = await axios.post(
            `${API_URL}/chat/completions`,
            {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ],
                temperature,
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI Writing Error:', error);
        throw error;
    }
}

/** 润色：保持原意，使表达更专业流畅 */
export async function aiPolish(text: string): Promise<string> {
    const systemPrompt = `你是一位专业的中文技术写作编辑。请润色以下文本：
    要求：
    1. 保持原意不变，不添加新信息
    2. 改善句式流畅度和专业程度
    3. 修正语法和标点错误
    4. 保留原有的 Markdown 格式
    5. 直接返回润色后的文本，不要加任何解释或前缀`;

    return aiWritingRequest(systemPrompt, text, 0.6);
}

/** 生成摘要：50-100字 SEO 友好的文章摘要 */
export async function aiSummarize(content: string): Promise<string> {
    const systemPrompt = `你是一位 SEO 专家和技术博客编辑。请为以下文章生成摘要：
    要求：
    1. 长度：50-100 字
    2. 概括文章核心观点和技术要点
    3. 适合搜索引擎展示（SEO 友好）
    4. 语气客观专业
    5. 直接返回摘要文本，不要加引号或前缀`;

    return aiWritingRequest(systemPrompt, content, 0.5);
}

/** 续写：基于已有内容继续创作 */
export async function aiContinue(content: string): Promise<string> {
    const systemPrompt = `你是一位技术博客作者。请基于以下已有内容继续创作：
    要求：
    1. 保持与已有内容一致的写作风格和语气
    2. 自然衔接上文，不重复已有内容
    3. 续写 150-300 字
    4. 保持 Markdown 格式
    5. 直接返回续写内容，不要加任何解释`;

    return aiWritingRequest(systemPrompt, `以下是已有的文章内容，请从末尾继续写：\n\n${content}`, 0.8);
}

/** 翻译：中英互译，技术术语准确 */
export async function aiTranslate(text: string, targetLang: 'en' | 'zh'): Promise<string> {
    const langName = targetLang === 'en' ? 'English' : '中文';
    const systemPrompt = `你是一位精通中英双语的技术翻译专家。请将以下内容翻译为${langName}：
    要求：
    1. 技术术语翻译准确（如"组件"↔"component"）
    2. 保持原有的 Markdown 格式
    3. 翻译流畅自然，不是直译
    4. 直接返回翻译结果，不要加任何前缀或解释`;

    return aiWritingRequest(systemPrompt, text, 0.3);
}
