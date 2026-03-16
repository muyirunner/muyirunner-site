import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 延迟加载页面组件
const Home = () => import('@/pages/Home.vue')
const BlogHome = () => import('@/pages/BlogHome.vue')
const BlogPost = () => import('@/pages/BlogPost.vue')
const AdminDashboard = () => import('@/pages/AdminDashboard.vue')
const ResumePrint = () => import('@/pages/ResumePrint.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: '杨汶川 - 个人主页',
            description: '杨汶川个人简历，武汉理工大学软件工程与数字传播专业，求职C++后台开发/算法工程师，拥有前端开发和算法工程实习经验。'
        }
    },
    {
        path: '/blog',
        name: 'Blog',
        component: BlogHome,
        meta: {
            title: '博客 - 杨汶川',
            description: '杨汶川的技术博客，分享C++、算法、前端开发、游戏引擎等领域的技术心得与成长记录。'
        }
    },
    {
        path: '/blog/:id',
        name: 'BlogPost',
        component: BlogPost,
        meta: {
            title: '文章详情 - 杨汶川',
            description: '杨汶川的技术博客文章，分享技术心得，记录成长之路。'
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminDashboard,
        meta: {
            title: '管理后台 - 杨汶川',
            description: '博客管理后台'
        }
    },
    {
        path: '/resume-print',
        name: 'ResumePrint',
        component: ResumePrint,
        meta: {
            title: '简历预览 - 杨汶川',
            description: '杨汶川的个人简历（打印版）'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }
        } else {
            return { top: 0 }
        }
    }
})

// 路由守卫 - 动态更新页面标题和 meta 描述 (SEO)
router.beforeEach((to, from, next) => {
    // 更新 title
    document.title = (to.meta.title as string) || '杨汶川'

    // 动态更新 meta description
    const description = (to.meta.description as string) || '杨汶川的个人主页'
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
        metaDesc.setAttribute('content', description)
    } else {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        metaDesc.setAttribute('content', description)
        document.head.appendChild(metaDesc)
    }

    // 同步更新 OG description
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) {
        ogDesc.setAttribute('content', description)
    }

    next()
})

export default router

