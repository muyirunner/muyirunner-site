export interface PersonalInfo {
  name: string
  birthDate: string
  email: string
  phone: string
  wechat: string
  location: string
  politicalStatus: string
  targetPosition: string
}

export interface Education {
  school: string
  major: string
  degree: string
  period: string
  gpa: string
}

export interface Experience {
  id: string
  company: string
  position: string
  period: string
  location?: string
  responsibilities: string[]
}

export interface Project {
  id: string
  title: string
  period: string
  description: string
  image?: string  // 项目图片路径
  highlights: string[]
  technologies: string[]
  role?: string
  // 新增：项目链接
  github?: string  // GitHub 仓库地址
  demo?: string    // 在线演示地址
  video?: string   // 演示视频地址（B站/YouTube）
  // 新增：GitHub 统计数据（可选，由 API 动态获取）
  stats?: {
    stars?: number
    forks?: number
    language?: string
    lastUpdated?: string
  }
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface Award {
  id: string
  title: string
  level: string
  year?: string
}

export interface AboutItem {
  text: string
}

export interface QuickFact {
  label: string
  value: string
}

export interface SocialLink {
  name: string
  url: string
  icon?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education
  quickFacts: QuickFact[]
  keywords: string[]
  about: AboutItem[]
  experiences: Experience[]
  projects: Project[]
  skills: SkillCategory[]
  awards: Award[]
  socialLinks: SocialLink[]
}
