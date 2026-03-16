
export interface QAItem {
    keywords: string[]
    answer: string
    category: string
}

export interface QuickQuestion {
    question: string
    keywords: string[]
}

// Quick Questions
export const quickQuestionsEn: QuickQuestion[] = [
    { question: 'Who are you?', keywords: ['who', 'introduce', 'self'] },
    { question: 'What skills do you have?', keywords: ['skills', 'language', 'stack'] },
    { question: 'Project experience?', keywords: ['project', 'experience', 'work'] },
    { question: 'What are your strengths?', keywords: ['strength', 'advantage'] },
    { question: 'Internship experience?', keywords: ['intern', 'internship'] },
    { question: 'Any awards?', keywords: ['award', 'honor', 'prize'] },
    { question: 'Game development?', keywords: ['game', 'ue5', 'unreal'] },
    { question: 'Frontend skills?', keywords: ['frontend', 'vue', 'web'] },
    { question: 'Algorithm skills?', keywords: ['algorithm', 'pytorch', 'ai'] },
    { question: 'Contact info?', keywords: ['contact', 'email', 'phone'] }
]

// Knowledge Base
export const qaKnowledgeBaseEn: QAItem[] = [
    // ========== Identity ==========
    {
        keywords: ['who', 'name', 'introduce', 'self'],
        answer: 'Hello! I am **Yang Wenchuan**, a Software Engineering student passionate about technology! 🎓\n\nI come from **Wuhan University of Technology**, focusing on **C++ Development**, **Algorithm Engineering**, and **Frontend Development**. I love turning theoretical knowledge into practical projects, from image processing algorithms to game engines, and from frontend interfaces to deep learning models.\n\nMy favorite thing is solving challenging technical problems and seeing my code run! 💻✨',
        category: 'Introduction'
    },
    {
        keywords: ['where', 'from', 'hometown'],
        answer: 'I am from Hubei! 🌾 Currently studying at Wuhan University of Technology. Wuhan is a city with a great tech atmosphere, providing me with many opportunities for learning and practice!',
        category: 'Introduction'
    },
    {
        keywords: ['age', 'old', 'year'],
        answer: 'I am an undergraduate student enrolled in 2022, currently in my junior year, expecting to graduate in June 2026! 📅 I am at the prime stage for accumulating technical and project experience.',
        category: 'Introduction'
    },
    {
        keywords: ['resume', 'info', 'cv'],
        answer: 'This is my online resume! 😊 You can:\n\n• Scroll up to view my **Education**, **Skills**, and **Projects**\n• Click the navigation bar to switch sections\n• Chat with me here for more details\n• Or contact me directly: **641339238@qq.com**\n\nFeel free to ask about any specific project or skill!',
        category: 'Introduction'
    },

    // ========== Chat ==========
    {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        answer: 'Hello! 👋 I am Yang Wenchuan, nice to meet you! Feel free to ask anything about my tech skills or projects! 😊',
        category: 'Chat'
    },
    {
        keywords: ['thanks', 'thank', 'appreciate'],
        answer: 'You are welcome! 😊 If you have any other questions, feel free to ask!',
        category: 'Chat'
    },
    {
        keywords: ['bye', 'goodbye', 'see you'],
        answer: 'Goodbye! 👋 Nice chatting with you! Wish you all the best!',
        category: 'Chat'
    },

    // ========== Skills ==========
    {
        keywords: ['skill', 'language', 'stack', 'tech'],
        answer: 'I am proficient in **C++** and **Java**, with good knowledge of Python! These three languages allow me to handle different scenarios: C++ for high-performance algorithms and game engines, Java for backend services, and Python for machine learning. For Frontend, I am familiar with **Vue3 + TypeScript**.',
        category: 'Skills'
    },
    {
        keywords: ['c++', 'cpp'],
        answer: '**C++** is my strength! 💪 In the Thangka image denoising project, I implemented core algorithm modules using C++, improving PSNR/SSIM by 12%+. In game development, I refactored UE5 character movement components using C++.',
        category: 'Skills'
    },
    {
        keywords: ['frontend', 'vue', 'web', 'js', 'javascript'],
        answer: 'I am passionate about Frontend! 😊 During my internship, I built the Thangka Image Intelligent Restoration Platform from scratch using **Vue3 + Vite + Element Plus + Pinia**.',
        category: 'Skills'
    },
    {
        keywords: ['python', 'ml', 'pytorch', 'ai'],
        answer: '**Python** is my tool for algorithms! 🔬 I used PyTorch for the Cat & Dog Image Classification project, handling the full flow from data cleaning to model fine-tuning (ResNet/MobileNet) and deployment.',
        category: 'Skills'
    },

    // ========== Projects ==========
    {
        keywords: ['project', 'experience', 'work'],
        answer: 'I have rich project experience! 🎯 Mainly in three directions:\n\n**1. Image Processing**: Thangka Denoising System\n**2. Frontend & Privacy**: Thangka Platform, Federated Learning System\n**3. Game Dev**: "Digital Dream Journey" & "Bear\'s Invitation" (UE5 Games)\n\nI was a core developer or team leader in these projects!',
        category: 'Projects'
    },
    {
        keywords: ['game', 'ue5', 'unreal'],
        answer: 'Game development is my passion! 🎮 I made two UE5 games:\n\n**Digital Dream Journey**: Won provincial award.\n**Bear\'s Invitation**: Won national award, C++ refactoring of movement components.\n\nI have experience from Blueprints to C++!',
        category: 'Projects'
    },

    // ========== Contact ==========
    {
        keywords: ['contact', 'email', 'phone', 'wechat'],
        answer: 'Feel free to contact me! 📬\n\n📧 **Email**: 641339238@qq.com\n📱 **Phone**: 133-2576-6744\n📍 **Location**: Wuhan, Hubei\n\nOpen to opportunities! 😊',
        category: 'Contact'
    }
]

// Simple English matching
export function matchAnswerEn(input: string): string | null {
    const normalizedInput = input.toLowerCase()

    // 1. Exact/Partial keyword match
    for (const item of qaKnowledgeBaseEn) {
        // Check if any keyword is present in the input
        const match = item.keywords.some(keyword => normalizedInput.includes(keyword.toLowerCase()))
        if (match) {
            return item.answer
        }
    }

    return null
}
