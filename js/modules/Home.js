// 首页模块
class Home {
    constructor() {
        this.isInited = false;
        this.isQuickActionsInited = false;
        this.isViewAllLinksInited = false;
        this.init();
    }

    init() {
        // 防止重复初始化
        if (this.isInited) return;
        this.isInited = true;

        console.log('Home init 开始');

        // 监听页面切换
        window.addEventListener('sectionChange', (e) => {
            if (e.detail.sectionId === 'home') {
                this.updateAllOverviews();
            }
        });

        // 初始化时更新一次
        setTimeout(() => this.updateAllOverviews(), 100);

        // 初始化头像上传功能
        this.initAvatarUpload();

        // 统一处理快速操作按钮的点击事件
        this.initQuickActions();

        // 处理"查看全部"链接
        this.initViewAllLinks();
    }

    initQuickActions() {
        // 防止重复初始化
        if (this.isQuickActionsInited) return;
        this.isQuickActionsInited = true;

        console.log('initQuickActions 开始');

        // 获取所有快速操作按钮
        const quickBtns = document.querySelectorAll('.quick-btn');
        console.log('找到快速操作按钮数量:', quickBtns.length);

        quickBtns.forEach((btn, index) => {
            const module = btn.getAttribute('data-module');
            console.log(`按钮 ${index}: module=${module}`);

            // 移除所有可能的旧事件监听器
            btn.onclick = null;

            // 添加新的事件监听器 - 使用直接方法而不是 click()
            btn.onclick = (e) => {
                // 彻底阻止事件传播
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                console.log('快速操作按钮被点击:', module, '按钮 index:', index);

                // 切换到对应模块
                if (navbar) {
                    navbar.showSection(module);
                    navbar.setActiveLink(`#${module}`);
                }

                // 等待页面切换完成后，直接调用对应模块的 openAddModal 方法
                setTimeout(() => {
                    console.log('准备打开模态框:', module);

                    // 先关闭所有已打开的模态框
                    if (modal) modal.closeAll();

                    // 直接调用对应模块的方法，不使用 click()
                    switch (module) {
                        case 'goals':
                            if (goals && typeof goals.openAddModal === 'function') {
                                console.log('调用 goals.openAddModal()');
                                goals.openAddModal();
                            }
                            break;
                        case 'notes':
                            if (notes && typeof notes.openAddModal === 'function') {
                                console.log('调用 notes.openAddModal()');
                                notes.openAddModal();
                            }
                            break;
                        case 'habits':
                            if (habits && typeof habits.openAddModal === 'function') {
                                console.log('调用 habits.openAddModal()');
                                habits.openAddModal();
                            }
                            break;
                    }
                }, 150);
            };
        });
    }

    initViewAllLinks() {
        // 使用事件委托处理"查看全部"链接
        document.addEventListener('click', (e) => {
            const viewAllLink = e.target.closest('.view-all');
            if (!viewAllLink) return;

            // 获取目标模块
            const href = viewAllLink.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const sectionId = href.substring(1);

            e.preventDefault();
            e.stopPropagation();

            console.log('查看全部链接点击:', sectionId);

            // 切换到对应页面
            if (navbar) {
                navbar.showSection(sectionId);
                navbar.setActiveLink(href);
            }
        });
    }

    initAvatarUpload() {
        const avatarContainer = document.getElementById('avatarContainer');
        const avatarInput = document.getElementById('avatarInput');
        const avatarImage = document.getElementById('avatarImage');

        if (!avatarContainer || !avatarInput || !avatarImage) return;

        // 点击头像容器触发文件选择
        avatarContainer.addEventListener('click', () => {
            avatarInput.click();
        });

        // 加载保存的头像
        this.loadAvatar();

        // 处理文件选择
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                toast?.error('请选择图片文件');
                return;
            }

            // 验证文件大小（最大2MB）
            if (file.size > 2 * 1024 * 1024) {
                toast?.error('图片大小不能超过2MB');
                return;
            }

            // 读取并保存图片
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                this.saveAvatar(imageData);
                avatarImage.src = imageData;
                toast?.success('头像已更新');
            };
            reader.onerror = () => {
                toast?.error('读取图片失败，请重试');
            };
            reader.readAsDataURL(file);
        });

        // 添加悬停效果
        avatarContainer.addEventListener('mouseenter', () => {
            avatarContainer.style.boxShadow = '0 0 0 4px var(--primary-light)';
        });
        avatarContainer.addEventListener('mouseleave', () => {
            avatarContainer.style.boxShadow = '';
        });
    }

    saveAvatar(imageData) {
        try {
            localStorage.setItem('personal_website_avatar', imageData);
        } catch (error) {
            console.error('保存头像失败:', error);
            toast?.error('保存头像失败，图片可能太大');
        }
    }

    loadAvatar() {
        const avatarImage = document.getElementById('avatarImage');
        if (!avatarImage) return;

        try {
            const savedAvatar = localStorage.getItem('personal_website_avatar');
            if (savedAvatar) {
                avatarImage.src = savedAvatar;
            }
        } catch (error) {
            console.error('加载头像失败:', error);
        }
    }

    updateAllOverviews() {
        goals?.updateOverview();
        notes?.updateOverview();
        habits?.updateOverview();
    }

    getTotalStats() {
        return {
            goals: goals?.getStats() || { total: 0, pending: 0, inProgress: 0, completed: 0 },
            notes: notes?.getStats() || { total: 0, tags: 0 },
            habits: habits?.getStats() || { total: 0, todayChecks: 0 }
        };
    }
}

// 初始化首页
let home;
document.addEventListener('DOMContentLoaded', () => {
    home = new Home();
});
