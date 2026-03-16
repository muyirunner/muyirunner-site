export const RESUME_CONTEXT = `
基本信息：
- 姓名：杨汶川 (Yang Wenchuan)
- 求职意向：C++ 后台开发 / 算法工程师 (校招)
- 教育背景：武汉理工大学 (211) | 软件工程与数字传播试点班 | 本科 (2022.09-2026.06)
- GPA：3.738/5.0
- 政治面貌：中共党员
- 现居地：湖北武汉

实习经历：
1. 武汉理工数字传播工程有限公司 (2025.07-2025.09) | 前端开发实习生
   - 参与“唐卡图像智能修复平台”搭建 (Vue3+Vite+Element Plus+Pinia)。
   - 实现登录注册、路由配置、历史记录管理 (查询/删除/清空)、上传参数设置等功能。
   - 优化体验：统一错误提示、Loading 状态、分页加载、防抖。

2. 武汉理工数字传播工程有限公司 (2024.07-2024.09) | 算法工程实习生
   - 参与“猫狗图像分类识别”项目 (PyTorch)。
   - 负责数据清洗去重、数据增强、模型微调 (ResNet/MobileNet)、评估迭代 (混淆矩阵/F1-score)。
   - 实现模型导出 (ONNX/TorchScript) 并封装简易接口。

项目经历：
1. 面向联邦学习数据流交互任务的隐私计算系统 (2024.10-2024.12)
   - 设计联邦学习环境下的隐私计算原型，融合同态加密、差分隐私等技术。
   
2. 3S 微信小程序设计开发比赛 (2024.04-2024.05)
   - 全栈开发 (WXML/WXSS)，实现商品发布、浏览核心功能。

3. 传统数字主题游戏《数梦寻旅》 (2024.03-2024.07) | 第17届中国大学生计算机设计大赛
   - UE5 蓝图开发核心玩法 (解谜/交互)。
   - 使用 Nanite 处理高面数模型，Lumen 设计光影。
   - 开发动态叙事系统，整合 MetaHuman 表情动画。

4. 《小熊的邀约》 (2025.04-2025.08) | 中国好创意·全国数字艺术设计大赛
   - 基于 UE5 C++ API 重构角色运动组件 (攀爬/滑翔)。
   - 使用 Gameplay Ability System (GAS) 设计交互反馈。
   - 调用 Win32 API 实现存档/任务栏显示等系统功能。

荣誉奖项：
- 第十九届中国好创意暨全国数字艺术设计大赛 国赛三等奖
- 第十七届中国大学生计算机设计大赛 省赛三等奖
- 3S 微信小程序设计开发比赛 参与奖
- 未来设计师 NCDA 大赛 校级三等奖
- 武汉理工大学 2022 年度优秀团员
- 武汉理工大学数传专项奖学金

技能证书：
- 英语：CET-6
- 编程语言：C/C++ (熟练), Java (熟练), Python (良好)
- 数据库：MySQL (熟练), SQL (熟练)
- 前端：JavaScript (良好), Web 前端 (良好)

自我评价：
- 拥有前端、算法、游戏开发多领域技术储备。
- 擅长性能优化、模块实现与系统集成。
- 具备从算法设计到工程落地的全流程工作能力。
`;

// 恢复完整的数据结构，供各个组件渲染使用
export const resumeData = {
   personalInfo: {
      name: '杨汶川',
      targetPosition: 'C++ 后台开发 / 算法工程师',
      email: '641339238@qq.com',
      phone: '133-2576-6744',
      wechat: 'ywczwfdcai',
      location: '湖北武汉'
   },
   keywords: ['C++', 'Algorithm', 'Full Stack', 'Game Dev', 'Vue3'],
   socialLinks: [
      { name: 'GitHub', url: 'https://github.com/StartTrace', icon: '🐙' },
      { name: 'Email', url: 'mailto:641339238@qq.com', icon: '📧' }
   ],
   about: [
      { text: '拥有前端、算法、游戏开发多领域技术储备。' },
      { text: '擅长性能优化、模块实现与系统集成。' },
      { text: '具备从算法设计到工程落地的全流程工作能力。' }
   ],
   education: {
      school: '武汉理工大学',
      degree: '本科',
      major: '软件工程与数字传播试点班',
      period: '2022.09 - 2026.06',
      gpa: '3.738/5.0',
      highlights: ['211 工程大学', '中共党员']
   },
   experiences: [
      {
         id: 1,
         company: '武汉理工数字传播工程有限公司',
         position: '前端开发实习生',
         location: '湖北武汉',
         period: '2025.07 - 2025.09',
         responsibilities: [
            '参与“唐卡图像智能修复平台”搭建 (Vue3+Vite+Element Plus+Pinia)。',
            '实现登录注册、路由配置、历史记录管理 (查询/删除/清空)、上传参数设置等功能。',
            '优化体验：统一错误提示、Loading 状态、分页加载、防抖。'
         ]
      },
      {
         id: 2,
         company: '武汉理工数字传播工程有限公司',
         position: '算法工程实习生',
         location: '湖北武汉',
         period: '2024.07 - 2024.09',
         responsibilities: [
            '参与“猫狗图像分类识别”项目 (PyTorch)。',
            '负责数据清洗去重、数据增强、模型微调 (ResNet/MobileNet)、评估迭代 (混淆矩阵/F1-score)。',
            '实现模型导出 (ONNX/TorchScript) 并封装简易接口。'
         ]
      }
   ],
   projects: [
      {
         id: 1,
         title: '面向联邦学习数据流交互任务的隐私计算系统',
         period: '2024.10 - 2024.12',
         role: '核心设计',
         description: '设计联邦学习环境下的隐私计算原型，融合同态加密、差分隐私等技术。',
         highlights: ['设计联邦学习环境下的隐私计算原型', '融合同态加密、差分隐私等技术'],
         technologies: ['Privacy Computing', 'Federated Learning', 'Cryptography']
      },
      {
         id: 2,
         title: '3S 微信小程序设计开发比赛',
         period: '2024.04 - 2024.05',
         role: '全栈开发',
         description: '全栈开发 (WXML/WXSS)，实现商品发布、浏览核心功能。',
         highlights: ['独立负责全栈开发', '实现商品发布与浏览核心业务流程'],
         technologies: ['WeChat Mini Program', 'WXML', 'WXSS']
      },
      {
         id: 3,
         title: '数梦寻旅 (UE5 游戏)',
         period: '2024.03 - 2024.07',
         role: 'Gameplay 开发',
         description: '传统数字主题游戏，获得第17届中国大学生计算机设计大赛奖项。UE5 蓝图开发核心玩法。',
         highlights: ['UE5 蓝图开发核心玩法 (解谜/交互)', '使用 Nanite 处理高面数模型，Lumen 设计光影', '开发动态叙事系统，整合 MetaHuman 表情动画'],
         technologies: ['Unreal Engine 5', 'Blueprints', 'Nanite', 'Lumen', 'MetaHuman']
      },
      {
         id: 4,
         title: '小熊的邀约 (UE5)',
         period: '2025.04 - 2025.08',
         role: 'C++ 程序',
         description: '获得中国好创意·全国数字艺术设计大赛奖项。基于 UE5 C++ API 重构角色运动组件。',
         highlights: ['基于 UE5 C++ API 重构角色运动组件 (攀爬/滑翔)', '使用 Gameplay Ability System (GAS) 设计交互反馈', '调用 Win32 API 实现存档/任务栏显示等系统功能'],
         technologies: ['Unreal Engine 5', 'C++', 'GAS', 'Win32 API']
      }
   ],
   skills: [
      {
         category: '编程语言',
         skills: ['C/C++ (熟练)', 'Java (熟练)', 'Python (良好)', 'CTE-6']
      },
      {
         category: '前端开发',
         skills: ['Vue 3', 'Vite', 'TypeScript', 'JavaScript', 'Element Plus', 'Tailwind CSS']
      },
      {
         category: '后端 & 数据库',
         skills: ['Spring Boot', 'MySQL', 'SQL', 'Supabase']
      },
      {
         category: '游戏开发 & 算法',
         skills: ['Unreal Engine 5', 'C++ API', 'PyTorch', 'Deep Learning', 'GAS']
      }
   ],
   awards: [
      { id: 1, title: '第十九届中国好创意暨全国数字艺术设计大赛 国赛三等奖', level: '国家级', year: '2025' },
      { id: 2, title: '第十七届中国大学生计算机设计大赛 省赛三等奖', level: '省级', year: '2024' },
      { id: 3, title: '3S 微信小程序设计开发比赛 参与奖', level: '校级', year: '2024' },
      { id: 4, title: '未来设计师 NCDA 大赛 校级三等奖', level: '校级', year: '2024' },
      { id: 5, title: '武汉理工大学 2022 年度优秀团员', level: '校级', year: '2022' },
      { id: 6, title: '武汉理工大学数传专项奖学金', level: '校级', year: '2023' }
   ]
};
