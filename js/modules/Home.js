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
