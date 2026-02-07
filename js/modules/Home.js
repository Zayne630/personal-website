// 首页模块
class Home {
    constructor() {
        this.init();
    }

    init() {
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
