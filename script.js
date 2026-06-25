/**
 * 个人博客 - 交互脚本
 */

// ========== 博客文章数据 ==========
const blogPosts = [
    {
        emoji: '🚀',
        tag: '技术',
        title: '我的 Web 开发学习之路',
        desc: '从 HTML 到现代前端框架，分享我一路走来的经验和心得...',
        date: '2026-06-20'
    },
    {
        emoji: '🐍',
        tag: 'Python',
        title: '用 Python 搭建 REST API 入门',
        desc: '使用 Flask 快速构建一个简洁高效的 API 服务...',
        date: '2026-06-18'
    },
    {
        emoji: '🎨',
        tag: '设计',
        title: 'CSS 动画与交互设计的思考',
        desc: '如何用微妙的动效提升用户体验，让页面更有活力...',
        date: '2026-06-15'
    },
    {
        emoji: '📱',
        tag: '技术',
        title: '响应式设计的实用技巧',
        desc: '一套让你的网页在手机和桌面上都好看的 CSS 方案...',
        date: '2026-06-12'
    },
    {
        emoji: '⚡',
        tag: '性能',
        title: '前端性能优化小贴士',
        desc: '几个简单易行的优化方法，让你的网站加载更快...',
        date: '2026-06-08'
    },
    {
        emoji: '📝',
        tag: '随笔',
        title: '为什么我选择用博客记录成长',
        desc: '写作是最好的思考方式，聊聊我写博客的初衷...',
        date: '2026-06-05'
    }
];

// ========== 渲染博客列表 ==========
function renderBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML = blogPosts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">${post.emoji}</div>
            <div class="blog-card-body">
                <span class="blog-card-tag">${post.tag}</span>
                <h3>${post.title}</h3>
                <p>${post.desc}</p>
                <time class="blog-card-date">${post.date}</time>
            </div>
        </article>
    `).join('');
}

// ========== 导航栏滚动效果 ==========
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ========== 返回顶部按钮 ==========
function createBackToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.title = '返回顶部';
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

// ========== 导航链接点击 - 修正固定导航栏偏移 ==========
function handleNavClick() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = 64;
                const position = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}

// ========== 卡片滚动渐入动画 ==========
function observeCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.blog-card, .skill-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    renderBlogPosts();
    createBackToTopButton();
    handleNavClick();
    observeCards();
    window.addEventListener('scroll', handleNavbarScroll);
});
