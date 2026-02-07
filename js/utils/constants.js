// 常量定义
const CONSTANTS = {
    // LocalStorage 键名
    STORAGE_KEYS: {
        GOALS: 'personal_website_goals',
        NOTES: 'personal_website_notes',
        HABITS: 'personal_website_habits'
    },

    // 目标状态
    GOAL_STATUS: {
        PENDING: 'pending',
        IN_PROGRESS: 'in-progress',
        COMPLETED: 'completed'
    },

    // 目标优先级
    GOAL_PRIORITY: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    },

    // 目标分类
    GOAL_CATEGORIES: ['学习', '工作', '健康', '生活', '其他'],

    // 优先级显示文本
    PRIORITY_LABELS: {
        low: '低',
        medium: '中',
        high: '高'
    },

    // 状态显示文本
    STATUS_LABELS: {
        'pending': '待开始',
        'in-progress': '进行中',
        'completed': '已完成'
    },

    // 默认习惯图标
    DEFAULT_HABIT_ICONS: ['📚', '🏃', '💧', '🧘', '🎨', '✍️', '🎵', '💪'],

    // 默认习惯颜色
    DEFAULT_HABIT_COLORS: ['#FF8C42', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'],

    // Toast 消息类型
    TOAST_TYPES: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    },

    // Toast 图标
    TOAST_ICONS: {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }
};
