// 图片弹窗功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化全局变量和函数
    let autoSwitchTimer = null;
    let progressTimer = null;
    let currentAnalysisImage = 1;
    
    // 更新进度条
    function updateProgressBar(reset = false) {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        if (reset) {
            progressBar.style.width = '0%';
            return;
        }
        
        let width = 0;
        clearInterval(progressTimer);
        progressTimer = setInterval(() => {
            if (width >= 100) {
                clearInterval(progressTimer);
            } else {
                width += 1;
                progressBar.style.width = width + '%';
            }
        }, 30); // 3000ms / 100 = 30ms per percent
    }
    
    // 更新轮播指示点
    function updateCarouselDots(index) {
        const carouselDots = document.querySelectorAll('.carousel-dot');
        if (!carouselDots || carouselDots.length === 0) return;
        
        carouselDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        const activeDot = document.querySelector(`.carousel-dot[data-index="${index}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    }
    
    // 切换分析图片函数
    function switchAnalysisImage() {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        
        if (!modal || !modalImage || !modalTitle || !modalDescription) return;
        
        if (currentAnalysisImage === 1) {
            modalImage.style.opacity = 0;
            setTimeout(() => {
                modalImage.src = 'images/2.2-2.png';
                modalTitle.textContent = 'AI学情分析 - 改进建议';
                modalDescription.textContent = '基于学生的错题数据，系统生成个性化的学习改进建议，帮助学生有针对性地提升薄弱环节。';
                modalImage.style.opacity = 1;
                currentAnalysisImage = 2;
                updateCarouselDots(2);
            }, 200);
        } else {
            modalImage.style.opacity = 0;
            setTimeout(() => {
                modalImage.src = 'images/2.2-1.png';
                modalTitle.textContent = 'AI学情分析 - 诊断结果';
                modalDescription.textContent = 'AI系统自动分析学生错题情况，识别出薄弱知识点和常见错误类型，为学生和教师提供精准反馈。';
                modalImage.style.opacity = 1;
                currentAnalysisImage = 1;
                updateCarouselDots(1);
            }, 200);
        }
    }
    
    // 启动自动切换
    function startAutoSwitch() {
        const carouselControls = document.getElementById('carouselControls');
        if (!carouselControls) return;
        
        // 确保定时器前已清除，避免多个定时器同时运行
        stopAutoSwitch();
        
        // 开始新的切换定时器
        autoSwitchTimer = setInterval(() => {
            switchAnalysisImage();
            // 每次切换后重置进度条并重新启动
            updateProgressBar(true);
            updateProgressBar();
        }, 3000);
        
        // 初始化进度条
        updateProgressBar(true);
        updateProgressBar();
        carouselControls.classList.remove('hidden');
    }
    
    // 停止自动切换
    function stopAutoSwitch() {
        const carouselControls = document.getElementById('carouselControls');
        
        if (autoSwitchTimer) {
            clearInterval(autoSwitchTimer);
            autoSwitchTimer = null;
        }
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        
        if (carouselControls) {
            carouselControls.classList.add('hidden');
        }
    }
    
    // 延迟一点时间等待组件加载完成后再绑定事件
    setTimeout(function() {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const closeModal = document.getElementById('closeModal');
        const carouselDots = document.querySelectorAll('.carousel-dot');
        
        // 检查关键元素是否存在
        if (!modal || !modalImage) {
            console.error('模态框或图片元素未找到');
            return;
        }
        
        // 添加轮播点击事件
        carouselDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (index !== currentAnalysisImage) {
                    switchAnalysisImage();
                    // 重启自动切换
                    startAutoSwitch();
                }
            });
        });
        
        // 显示AI对话演示
        const showChatDemo = document.getElementById('showChatDemo');
        if (showChatDemo) {
            showChatDemo.addEventListener('click', function() {
                console.log('点击了AI对话演示按钮');
                // 停止之前可能运行的定时器
                stopAutoSwitch();
                
                modalImage.src = 'images/2.2-chat.png';
                modalTitle.textContent = 'AI对话解题功能';
                modalDescription.textContent = '通过自然语言交互，智能AI助手能够针对学生的具体问题提供个性化解答，帮助学生理解概念和解决难题。';
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        } else {
            console.error('未找到AI对话演示按钮');
        }
        
        // 显示学情分析演示
        const showAnalysisDemo = document.getElementById('showAnalysisDemo');
        if (showAnalysisDemo) {
            showAnalysisDemo.addEventListener('click', function() {
                console.log('点击了学情分析演示按钮');
                // 如果弹窗已经打开且正在显示学情分析页面，手动切换一次
                if (!modal.classList.contains('hidden') && 
                    (modalTitle.textContent.includes('AI学情分析'))) {
                    switchAnalysisImage();
                    // 重启进度条和定时器
                    startAutoSwitch();
                } else {
                    // 首次打开弹窗，显示第一张图
                    currentAnalysisImage = 1;
                    modalImage.src = 'images/2.2-1.png';
                    modalTitle.textContent = 'AI学情分析 - 诊断结果';
                    modalDescription.textContent = 'AI系统自动分析学生错题情况，识别出薄弱知识点和常见错误类型，为学生和教师提供精准反馈。';
                    
                    updateCarouselDots(1);
                    modal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    
                    // 启动自动切换
                    startAutoSwitch();
                }
            });
        } else {
            console.error('未找到学情分析演示按钮');
        }
        
        // 关闭弹窗
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                stopAutoSwitch(); // 停止自动切换
            });
        }
        
        // 点击弹窗外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                stopAutoSwitch(); // 停止自动切换
            }
        });
        
        // ESC键关闭弹窗
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                stopAutoSwitch(); // 停止自动切换
            }
        });
        
        console.log('模态框事件绑定已完成');
    }, 500); // 延迟500毫秒等待组件完全加载
}); 