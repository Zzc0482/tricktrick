/**
 * 个人文字日记 - 交互脚本
 */

// ========== 日记元数据 ==========
const blogPosts = [
    {
        id: 1,
        emoji: '🌙',
        tag: '阿倩',
        title: '歧路亡羊',
        desc: '他站在楼顶天台的边缘，感觉风还是有点大了。',
        date: '2026-06-24',
        file: 'diaries/qilu.txt'
    },
    {
        id: 2,
        emoji: '☔',
        tag: '阿倩',
        title: '青苔草',
        desc: '冷雨夜我不想归家，怕望你背影，只苦笑望雨点。',
        date: '2026-06-21',
        file: 'diaries/qingcao.txt'
    },
    {
        id: 3,
        emoji: '🍃',
        tag: '阿倩',
        title: '金绳玉锁',
        desc: '赵沭同十六岁决定离家出走。',
        date: '2026-06-18',
        file: 'diaries/jinsheng.txt'
    },
    {
        id: 4,
        emoji: '📖',
        tag: '阿倩',
        title: '甩卖二十二',
        desc: '拜拜啦拜拜哦关于爱情我仍年轻。',
        date: '2026-06-14',
        file: 'diaries/4.txt'
    },
    {
        id: 5,
        emoji: '🕯️',
        tag: '阿倩',
        title: '是非对错成败之',
        desc: '没有花，这刹那被破坏吗。',
        date: '2026-06-10',
        file: 'diaries/5.txt'
    },
    {
        id: 6,
        emoji: '☕',
        tag: '阿倩',
        title: '夺路而跳',
        desc: '你的心和眼口和耳亦无缘分，我都捉不紧。',
        date: '2026-06-07',
        file: 'diaries/6.txt'
    }
];

// ========== 心灵角落数据 ==========
const skillDetails = [
    {
        id: 'skill-1',
        emoji: '📖',
        title: '阅读',
        tag: '角落',
        content: `我读书很慢，像在走路，不是赶路。

最近在读的是：
• 张爱玲《小团圆》—— 像在窥看一个人的梦
• 邱妙津《鳄鱼手记》—— 字字是血，读得很痛
• 沈从文《边城》—— 每次读都像回到湘西的河边

一本书读完，就像交了一个朋友。有些朋友会走，但书一直都在书架上，随时可以回去看看。`
    },
    {
        id: 'skill-2',
        emoji: '🖋️',
        title: '写作',
        tag: '角落',
        content: `写作对我来说，是把自己摊开来晾晒。

我在写的故事：
• 赵沭同的离家出走（正在进行中）
• 一些关于雨天的短篇
• 还有很多只开了头的文档

其实写得最多的是日记，在深夜、在雨天、在睡不着的时候。这些文字不需要给别人看，但写出来之后，心里就轻了一些。`
    },
    {
        id: 'skill-3',
        emoji: '☕',
        title: '日常',
        tag: '角落',
        content: `我是一个很容易满足的人。

一杯手冲咖啡的香气，可以让我安静整个下午。
窗外的树影在墙上晃动，我可以看很久。
闻到雨后泥土的味道，会莫名其妙地开心。

最近迷上了收集不同种类的茶，装在小罐子里，像收集四季。`
    },
    {
        id: 'skill-4',
        emoji: '🎞️',
        title: '光影',
        tag: '角落',
        content: `用镜头记录一些快要消失的瞬间。

喜欢拍的是：
• 路灯下的影子
• 旧墙上的藤蔓
• 玻璃窗上的雨滴
• 黄昏时分的天空

拍照的时候，世界会变得很安静。那个瞬间被凝固下来，像一首很短的诗。`
    }
];

// ========== 缓存已加载的内容 ==========
const contentCache = {};

// ========== 加载 TXT 文件内容 ==========
async function loadTxtContent(filePath) {
    if (contentCache[filePath]) {
        return contentCache[filePath];
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`无法加载文件: ${filePath}`);
        }
        const content = await response.text();
        contentCache[filePath] = content;
        return content;
    } catch (error) {
        console.error('加载日记内容失败:', error);
        return `[加载失败] 无法读取文件: ${filePath}`;
    }
}

// ========== 字数统计 ==========
function countWords(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const total = chineseChars + englishWords + digits;
    if (total === 0) return 0;
    return total;
}

// ========== 格式化长文本 ==========
function formatLongText(text) {
    const lines = text.split('\n');
    let result = [];
    let emptyCount = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.trim() === '') {
            emptyCount++;
            if (emptyCount === 1) {
                result.push('<span class="empty-line"></span>');
            }
            continue;
        }
        emptyCount = 0;

        const isDialogue = /^[「『""''《]/.test(line.trim()) ||
                          (/^.{1,30}[:：]/.test(line.trim()) && line.trim().length < 40);

        const isSectionBreak = /^[\*\-—]{3,}$/.test(line.trim()) ||
                              /^[~～]{3,}$/.test(line.trim());

        if (isSectionBreak) {
            result.push(`<span class="section-break">✦</span>`);
        } else if (isDialogue) {
            result.push(`<p class="dialogue">${escapeHtml(line)}</p>`);
        } else {
            result.push(`<p>${escapeHtml(line)}</p>`);
        }
    }

    return result.join('');
}

// ========== 渲染博客列表 ==========
function renderBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML = blogPosts.map(post => `
        <article class="blog-card" data-id="${post.id}">
            <div class="blog-card-image">${post.emoji}</div>
            <div class="blog-card-body">
                <span class="blog-card-tag">${post.tag}</span>
                <h3>${post.title}</h3>
                <p>${post.desc}</p>
                <time class="blog-card-date">${post.date}</time>
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const post = blogPosts.find(p => p.id === id);
            if (post) {
                openDetail(post);
            }
        });
    });
}

// ========== 打开详情（长文优化版） ==========
async function openDetail(post) {
    const overlay = document.getElementById('detailOverlay');
    const content = document.getElementById('detailContent');

    content.innerHTML = `
        <div class="detail-emoji">${post.emoji}</div>
        <h2 class="detail-title">${post.title}</h2>
        <span class="detail-tag">${post.tag}</span>
        <span class="detail-date">${post.date}</span>
        <div class="detail-body" style="color: var(--text-muted); text-align: center; padding: 60px 0;">
            <span style="display: inline-block; animation: pulse 1.2s ease-in-out infinite;">📖 加载中...</span>
        </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const txtContent = await loadTxtContent(post.file);

    const wordCount = countWords(txtContent);
    const wordCountDisplay = wordCount > 0 ? ` · ${wordCount.toLocaleString()}字` : '';

    const formattedContent = formatLongText(txtContent);

    content.innerHTML = `
        <div class="detail-emoji">${post.emoji}</div>
        <h2 class="detail-title">
            ${post.title}
            <span class="detail-word-count">${wordCountDisplay}</span>
        </h2>
        <span class="detail-tag">${post.tag}</span>
        <span class="detail-date">${post.date}</span>
        <div class="detail-body">${formattedContent}</div>
        <div class="detail-progress">
            <div class="detail-progress-bar" id="detailProgressBar"></div>
        </div>
    `;

    const container = document.querySelector('.detail-container');
    const progressBar = document.getElementById('detailProgressBar');

    if (container && progressBar) {
        container.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight - this.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    }
}

// ========== 打开心灵角落详情 ==========
function openSkillDetail(skill) {
    const overlay = document.getElementById('detailOverlay');
    const content = document.getElementById('detailContent');

    const lines = skill.content.split('\n');
    let formattedLines = [];
    let inList = false;

    for (let line of lines) {
        if (line.trim() === '') {
            formattedLines.push('<br>');
            inList = false;
            continue;
        }
        if (line.trim().startsWith('•')) {
            if (!inList) {
                formattedLines.push('<ul class="skill-detail-list">');
                inList = true;
            }
            formattedLines.push(`<li>${escapeHtml(line.trim().substring(1).trim())}</li>`);
        } else {
            if (inList) {
                formattedLines.push('</ul>');
                inList = false;
            }
            formattedLines.push(`<p>${escapeHtml(line)}</p>`);
        }
    }
    if (inList) {
        formattedLines.push('</ul>');
    }

    content.innerHTML = `
        <div class="detail-emoji">${skill.emoji}</div>
        <h2 class="detail-title">${skill.title}</h2>
        <span class="detail-tag">${skill.tag}</span>
        <div class="detail-body skill-detail">
            ${formattedLines.join('')}
        </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== HTML 转义 ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== 关闭详情 ==========
function closeDetail() {
    const overlay = document.getElementById('detailOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
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

// ========== 导航链接点击 ==========
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

    // 心灵角落卡片点击事件
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            const skill = skillDetails.find(s => s.id === id);
            if (skill) {
                openSkillDetail(skill);
            }
        });
    });

    // 关闭详情 - 点击遮罩
    document.getElementById('detailOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetail();
        }
    });

    // 关闭详情 - 点击关闭按钮
    document.getElementById('detailClose').addEventListener('click', closeDetail);

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetail();
        }
    });
});

// ========== 加载动画关键帧 ==========
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);