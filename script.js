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
        file: 'diaries/jinyu.txt'
    },
    {
        id: 4,
        emoji: '📖',
        tag: '阿倩',
        title: '甩卖二十二',
        desc: '拜拜啦拜拜哦关于爱情我仍年轻。',
        date: '2026-06-14',
        file: 'diaries/22.txt'
    },
    {
        id: 5,
        emoji: '🕯️',
        tag: '阿倩',
        title: '是非对错成败之',
        desc: '没有花，这刹那被破坏吗。',
        date: '2026-06-10',
        file: 'diaries/shifei.txt'
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
        content: `看的书真的不多，小时候比较爱看，沈石溪和曹文轩应该是我白描的启蒙，顺带爱看怪盗罗宾，然后初中看的都是必读书目，高中开始看日本文学，比起三岛由纪夫可能还是川端康成更对我胃口。
        此外也看了几本余华，看得我人已经傻掉了，疼得我龇牙咧嘴。汪曾祺好看，读他的书很轻松，木心则很符合文艺逼时期想要装一下的心情，于是我真的把文学回忆录看了一大半，反而感觉并没有很文艺逼，
        他说话挺有意思的，艺术家连讽刺人都透露着一些诙谐。除此之外就是读诗，古诗文都是课本里的，没有做特别多的课外，个人比较喜欢现代诗，海子比徐志摩好看，海子简直神了，木心的诗更随意一些，我
        看得囫囵吞枣。
        看外国诗实在要考虑翻译，中原中也的诗有几首挺有氛围的，聂鲁达的诗对我还是太露骨了，余下的此刻我也记不起来。大学四年没怎么阅读，看了一点点的太宰治和王小波，看不进去。`
    },
    {
        id: 'skill-2',
        emoji: '🖋️',
        title: '写作',
        tag: '角落',
        content: `大学之后才开始正儿八经写在电脑上，感觉还是很有成就感的，四年写了一百二十多万，也逐渐知道自己的文风和文笔概念了。
        这个反而不知道还能说什么，写东西的时候我很幸福，也认识了很多好朋友，就这样。`
    },
    {
        id: 'skill-3',
        emoji: '☕',
        title: '影视剧',
        tag: '角落',
        content: `国产剧不行国产剧其实反而正剧会好看一点，我的评价是有这个心情去看四十多集的国产剧不如干脆一点去看布袋戏。布袋戏我比较喜欢金光的前几部。后面剧情越来越拖了，节奏不太好。
        日剧推荐野木亚纪子的，非自然死亡很有名了应该，我更喜欢miu404一点，对我来说节奏更适合我，起码不会哭的特别惨了。电影的话，推荐告白，松隆子演的，凑佳苗的书改编的影视剧都不错，电视
        剧还有一部为了N，也很好看。`
    },
    {
        id: 'skill-4',
        emoji: '🎞️',
        title: '光影',
        tag: '角落',
        content: `等我先买个ccd再说吧。`
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

// ========== 格式化长文本（简化版 - 只保留段落换行） ==========
function formatLongText(text) {
    const lines = text.split('\n');
    let result = [];
    let emptyCount = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // 空行处理
        if (line.trim() === '') {
            emptyCount++;
            if (emptyCount === 1) {
                result.push('<span class="empty-line"></span>');
            }
            continue;
        }
        emptyCount = 0;

        // 所有内容都作为普通段落，不做任何自动识别
        result.push(`<p>${escapeHtml(line)}</p>`);
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