// 辅助函数
const Helpers = {
    // 生成唯一 ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    },

    // 获取今天的日期字符串
    getTodayString() {
        return this.formatDate(new Date(), 'YYYY-MM-DD');
    },

    // 获取相对时间描述
    getRelativeTime(date) {
        const now = new Date();
        const target = new Date(date);
        const diff = now - target;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return '今天';
        if (days === 1) return '昨天';
        if (days === 2) return '前天';
        if (days < 7) return `${days}天前`;
        if (days < 30) return `${Math.floor(days / 7)}周前`;
        if (days < 365) return `${Math.floor(days / 30)}个月前`;
        return `${Math.floor(days / 365)}年前`;
    },

    // 解析标签
    parseTags(tagsString) {
        if (!tagsString || !tagsString.trim()) return [];
        return tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    },

    // 从 LocalStorage 获取数据
    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('读取 LocalStorage 失败:', error);
            return [];
        }
    },

    // 保存数据到 LocalStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存到 LocalStorage 失败:', error);
            return false;
        }
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 转义 HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // 截断文本
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // 计算连续天数
    calculateStreak(checkDates) {
        if (!checkDates || checkDates.length === 0) return 0;

        const sortedDates = [...checkDates].sort((a, b) => new Date(b) - new Date(a));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let currentDate = today;

        for (const dateStr of sortedDates) {
            const checkDate = new Date(dateStr);
            checkDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((currentDate - checkDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 0 || diffDays === 1) {
                streak++;
                currentDate = checkDate;
            } else if (diffDays > 1) {
                break;
            }
        }

        return streak;
    },

    // 获取本月日期数组
    getMonthDays(year, month) {
        const days = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }

        return days;
    }
};
