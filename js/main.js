// 主入口文件
// 所有组件和模块已通过各自的文件初始化
// 这里可以添加全局初始化逻辑

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 成长空间已加载');

    // 检查 LocalStorage 是否可用
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        console.error('LocalStorage 不可用，数据无法保存');
        toast?.error('浏览器存储功能不可用，请检查浏览器设置', 0);
    }

    // 添加欢迎消息（仅首次访问）
    if (!localStorage.getItem('personal_website_visited')) {
        setTimeout(() => {
            toast?.success('欢迎来到成长空间！开始记录你的成长之旅吧 🌱');
        }, 500);
        localStorage.setItem('personal_website_visited', 'true');
    }

    // 监听在线/离线状态
    window.addEventListener('online', () => {
        toast?.success('网络已连接');
    });

    window.addEventListener('offline', () => {
        toast?.warning('网络已断开，但数据仍可正常使用');
    });

    // 导航到首页
    if (navbar) {
        navbar.showSection('home');
    }
});

// 导出供其他模块使用（如果需要）
window.App = {
    navbar,
    modal,
    toast,
    goals,
    notes,
    habits,
    home,
    CONSTANTS,
    Helpers
};
