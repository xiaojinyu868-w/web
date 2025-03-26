// 组件加载逻辑
const components = {
    'navbar': 'components/navbar.html',
    'hero': 'components/hero.html',
    'story': 'components/story.html',
    'values': 'components/values.html',
    'business': 'components/business.html',
    'progress': 'components/progress.html',
    'endorsement': 'components/endorsement.html',
    'investment': 'components/investment.html',
    'footer': 'components/footer.html'
};

// 加载所有组件
Object.entries(components).forEach(([id, path]) => {
    fetch(path)
        .then(response => response.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(error => console.error(`Error loading ${path}:`, error));
});

// 添加滚动动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
});

document.querySelectorAll('section > div').forEach((el) => observer.observe(el)); 