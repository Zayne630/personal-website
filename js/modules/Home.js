// 首页模块
class Home {
    constructor() {
        this.isQuickActionsInited = false;
        this.isViewAllLinksInited = false;
        this.init();
    }

    init() {
        // 防止重复初始化
        if (this.isInited) return;
        this.isInited = true;

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

        // 获取所有快速操作按钮并直接绑定事件
        const quickBtns = document.querySelectorAll('.quick-btn');
        quickBtns.forEach(btn => {
            // 使用单一事件监听器，防止重复
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const module = btn.getAttribute('data-module');
                if (!module) return;

                console.log('快速操作按钮点击:', module);

                // 切换到对应模块
                if (navbar) {
                    navbar.showSection(module);
                    navbar.setActiveLink(`#${module}`);
                }

                // 等待页面切换完成后，通过点击对应模块的添加按钮来打开模态框
                // 这样确保只有对应模块的模态框被打开
                setTimeout(() => {
                    let targetBtn = null;
                    switch (module) {
                        case 'goals':
                            targetBtn = document.getElementById('addGoalBtn');
                            break;
                        case 'notes':
                            targetBtn = document.getElementById('addNoteBtn');
                            break;
                        case 'habits':
                            targetBtn = document.getElementById('addHabitBtn');
                            break;
                    }

                    if (targetBtn) {
                        console.log('触发添加按钮点击:', module, targetBtn.id);
                        targetBtn.click();
                    }
                }, 100);
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
