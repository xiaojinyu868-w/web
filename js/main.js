// 组件加载逻辑 - 修改为支持本地文件协议
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 显示加载状态
        document.getElementById('loadingStatus').classList.remove('hidden');
        
        // 尝试加载组件
        loadAllComponents();
        
        // 隐藏加载状态和错误提示
        document.getElementById('loadingStatus').classList.add('hidden');
        
        // 如果5秒后仍未加载完成，显示错误信息并使用备选导航和页脚
        setTimeout(function() {
            const loadingContainers = document.querySelectorAll('.loading');
            if (loadingContainers.length > 0) {
                document.getElementById('errorMessage').classList.remove('hidden');
                document.getElementById('fallbackNavbar').classList.remove('hidden');
                document.getElementById('fallbackFooter').classList.remove('hidden');
            }
        }, 5000);
        
        // 即使组件无法加载，也清除loading类和指示器
        setTimeout(() => {
            document.querySelectorAll('.loading').forEach(el => {
                el.classList.remove('loading');
            });
            
            // 初始化动画
            initializeAnimations();
            
            // 为所有可见的元素添加active类触发动画
            document.querySelectorAll('.fade-in, .animate-fade-in, .animate-fade-in-left, .animate-fade-in-right').forEach(el => {
                el.classList.add('active');
            });
        }, 500);
    } catch (error) {
        console.error("初始化错误:", error);
    }
});

// 使用XMLHttpRequest替代fetch以支持本地文件加载
function loadComponent(id, path) {
    const componentContainer = document.getElementById(id);
    if (!componentContainer) {
        console.warn(`找不到ID为${id}的容器元素`);
        return;
    }

    try {
        const xhr = new XMLHttpRequest();
        // 添加时间戳参数防止缓存
        const timestamp = new Date().getTime();
        xhr.open('GET', `${path}?v=${timestamp}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) { // 0是本地文件成功的状态码
                    componentContainer.innerHTML = xhr.responseText;
                    componentContainer.classList.remove('loading');
                    
                    // 加载后初始化该组件内的动画
                    componentContainer.querySelectorAll('.fade-in, .animate-fade-in, .animate-fade-in-left, .animate-fade-in-right').forEach(el => {
                        el.classList.add('active');
                    });
                    
                    // 隐藏错误提示
                    document.getElementById('errorMessage').classList.add('hidden');
                } else {
                    console.error(`加载组件失败: ${path}, 状态: ${xhr.status}`);
                    componentContainer.classList.remove('loading');
                    
                    // 使用备用内容
                    if (fallbackContent[id]) {
                        componentContainer.innerHTML = fallbackContent[id];
                        
                        // 加载后初始化该组件内的动画
                        componentContainer.querySelectorAll('.fade-in, .animate-fade-in, .animate-fade-in-left, .animate-fade-in-right').forEach(el => {
                            el.classList.add('active');
                        });
                    } else {
                        componentContainer.innerHTML = `<div class="p-4 text-center">
                            <p class="text-gray-500">内容加载失败</p>
                            <p class="text-sm text-gray-400 mt-2">请尝试使用本地服务器运行此网站</p>
                        </div>`;
                    }
                }
            }
        };
        xhr.send();
    } catch (error) {
        console.error(`加载组件错误 ${path}:`, error);
        componentContainer.classList.remove('loading');
        
        // 使用备用内容
        if (fallbackContent[id]) {
            componentContainer.innerHTML = fallbackContent[id];
            
            // 加载后初始化该组件内的动画
            componentContainer.querySelectorAll('.fade-in, .animate-fade-in, .animate-fade-in-left, .animate-fade-in-right').forEach(el => {
                el.classList.add('active');
            });
        } else {
            componentContainer.innerHTML = `<div class="p-4 text-center">
                <p class="text-gray-500">内容加载失败</p>
                <p class="text-sm text-gray-400 mt-2">请尝试使用本地服务器运行此网站</p>
            </div>`;
        }
    }
}

// 备用内容 - 如果无法加载组件，使用此内容
const fallbackContent = {
    'hero': `<!-- 主横幅 - 备用内容 -->
    <section class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
                <h1 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in active">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">智能错题管理</span>
                    <span class="block mt-2">重新定义学习效率</span>
                </h1>
                <p class="text-xl text-blue-100 max-w-3xl mx-auto mb-8">基于AI驱动的智能学习平台，为师生提供一体化错题管理与分析解决方案</p>
            </div>
        </div>
    </section>`,
    
    'features': `<!-- 产品功能展示 - 备用内容 -->
    <section id="features" class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-10">产品功能</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="p-6 bg-blue-50 rounded-lg">
                    <h3 class="text-xl font-bold mb-3">学生端功能</h3>
                    <p>提供全维度数据无纸化、快速录入与多端适配能力</p>
                </div>
                <div class="p-6 bg-indigo-50 rounded-lg">
                    <h3 class="text-xl font-bold mb-3">教师端功能</h3>
                    <p>提供数据驱动分析与实时错题整合能力</p>
                </div>
            </div>
        </div>
    </section>`,

    'ai-features': `<!-- AI功能展示 - 备用内容 -->
    <div class="py-16 bg-gradient-to-b from-gray-100 to-white">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="text-center mb-12">
                <span class="inline-block px-6 py-2 bg-indigo-500/10 rounded-full text-indigo-700 text-sm font-medium mb-5">AI驱动</span>
                <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-blue-800">
                    深度学习与智能分析
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    基于领先的人工智能技术，让学习和教学更加智能化、个性化
                </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h3 class="text-3xl font-bold text-indigo-800 mb-6">AI对话解题功能</h3>
                    <p class="text-lg text-gray-600 mb-8">智能AI助手提供全天候解题支持，解析难题并提供个性化学习建议，让每位学生都能获得专属辅导。</p>
                    <button id="showChatDemo" class="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center">
                        <span>查看AI对话演示</span>
                    </button>
                </div>
                
                <div>
                    <h3 class="text-3xl font-bold text-blue-800 mb-6">AI学情分析</h3>
                    <p class="text-lg text-gray-600 mb-8">智能分析学生答题数据，发现知识盲点和学习模式，为教师提供精准教学指导。</p>
                    <button id="showAnalysisDemo" class="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center">
                        <span>查看学情分析演示</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    
    'patents': `<!-- 专利展示 - 备用内容 -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-10">核心专利技术</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="p-6 bg-white rounded-lg shadow">
                    <h3 class="text-xl font-bold mb-3">知识点展示方法及终端设备</h3>
                    <p class="text-gray-600 mb-2">申请公布号: CN 117171408 A</p>
                    <p>建立知识点层级架构，实现多知识点关联分析</p>
                </div>
                <div class="p-6 bg-white rounded-lg shadow">
                    <h3 class="text-xl font-bold mb-3">错题集生成方法及设备</h3>
                    <p class="text-gray-600 mb-2">申请公布号: CN 117112733 A</p>
                    <p>自动生成错题集，提高学习效率</p>
                </div>
                <div class="p-6 bg-white rounded-lg shadow">
                    <h3 class="text-xl font-bold mb-3">题目索引创建方法</h3>
                    <p class="text-gray-600 mb-2">申请公布号: CN 119202122 A</p>
                    <p>创建题目索引，便于快速精准查找特定题目</p>
                </div>
            </div>
        </div>
    </section>`,
    
    'imageModalContainer': `<!-- 图片弹窗 - 备用内容 -->
    <div id="imageModal" class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center hidden">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div class="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex justify-between items-center">
                <h3 id="modalTitle" class="text-xl font-bold">AI功能演示</h3>
                <button id="closeModal" class="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-4 overflow-auto max-h-[calc(90vh-64px)]">
                <img id="modalImage" src="" alt="AI功能演示" class="w-full h-auto rounded-lg">
                <div id="modalDescription" class="mt-4 text-gray-600 text-lg"></div>
                
                <div id="carouselControls" class="mt-4 hidden">
                    <div class="carousel-progress w-3/4 max-w-md">
                        <div id="progressBar" class="carousel-progress-bar"></div>
                    </div>
                    
                    <div class="carousel-controls">
                        <div data-index="1" class="carousel-dot active"></div>
                        <div data-index="2" class="carousel-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    
    'business': `<!-- 商业模式 - 备用内容 -->
    <section id="business" class="py-16 bg-blue-900 text-white">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-10">多元化收入结构</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="p-6 bg-white/10 rounded-lg">
                    <h3 class="text-xl font-bold mb-3">个人订阅服务</h3>
                    <p>年收入预期：1800万</p>
                </div>
                <div class="p-6 bg-white/10 rounded-lg">
                    <h3 class="text-xl font-bold mb-3">机构授权服务</h3>
                    <p>年收入预期：2250万</p>
                </div>
                <div class="p-6 bg-white/10 rounded-lg">
                    <h3 class="text-xl font-bold mb-3">数据分析服务</h3>
                    <p>年收入预期：800万</p>
                </div>
            </div>
            <div class="mt-8 text-center">
                <div class="inline-block bg-yellow-400/20 p-4 rounded-lg">
                    <span class="text-2xl font-bold">年度营收预期：4850万元</span>
                </div>
            </div>
        </div>
    </section>`
};

function loadAllComponents() {
    const components = {
        'navbar': 'components/navbar.html',
        'hero': 'components/hero.html',
        'story': 'components/story.html',
        'values': 'components/values.html',
        'features': 'components/features.html',
        'ai-features': 'components/ai-features.html',
        'patents': 'components/patents.html',
        'business': 'components/business.html',
        'progress': 'components/progress.html',
        'endorsement': 'components/endorsement.html',
        'team': 'components/team.html',
        'investment': 'components/investment.html',
        'footer': 'components/footer.html',
        'imageModalContainer': 'components/image-modal.html'
    };

    // 依次加载所有组件
    Object.entries(components).forEach(([id, path]) => {
        loadComponent(id, path);
    });
}

// 初始化交互动画
function initializeAnimations() {
    // 滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1 // 当元素10%可见时触发
    });

    // 延迟观察，确保DOM元素已加载
    setTimeout(() => {
        document.querySelectorAll('section, .fade-in, .animate-fade-in, .animate-fade-in-left, .animate-fade-in-right').forEach((el) => {
            observer.observe(el);
        });
    }, 500);
} 