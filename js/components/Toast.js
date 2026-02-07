// Toast 提示消息组件
class Toast {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toasts = [];
        this.defaultDuration = 3000;
    }

    show(message, type = 'info', duration = this.defaultDuration) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = CONSTANTS.TOAST_ICONS[type] || CONSTANTS.TOAST_ICONS.info;

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${Helpers.escapeHtml(message)}</span>
            <button class="toast-close">&times;</button>
        `;

        // 关闭按钮
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        return toast;
    }

    remove(toast) {
        if (!toast || !toast.parentElement) return;

        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    clear() {
        this.toasts.forEach(toast => toast.remove());
        this.toasts = [];
    }
}

// 初始化 Toast
let toast;
document.addEventListener('DOMContentLoaded', () => {
    toast = new Toast();
});
