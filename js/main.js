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
        xhr.open('GET', path, true);
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
        'business': 'components/business.html',
        'progress': 'components/progress.html',
        'endorsement': 'components/endorsement.html',
        'investment': 'components/investment.html',
        'footer': 'components/footer.html'
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