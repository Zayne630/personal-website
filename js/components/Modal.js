// 模态框组件
class Modal {
    constructor() {
        this.overlay = document.getElementById('modalOverlay');
        this.modals = document.querySelectorAll('.modal');
        this.closeButtons = document.querySelectorAll('[data-close]');

        this.init();
    }

    init() {
        // 关闭按钮点击
        this.closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-close');
                this.close(modalId);
            });
        });

        // 点击遮罩层关闭
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closeAll();
            }
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    }

    open(modalId) {
        console.log('Modal.open() 被调用，modalId:', modalId);

        const modal = document.getElementById(modalId);
        if (!modal) {
            console.log('Modal.open(): 找不到模态框', modalId);
            return;
        }

        console.log('Modal.open(): 准备打开模态框', modalId);
        this.overlay.classList.add('active');
        modal.classList.add('active');
        console.log('Modal.open(): 模态框已打开', modalId);

        // 聚焦到第一个输入框
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    }

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');

        // 检查是否还有打开的模态框
        const hasActiveModal = [...this.modals].some(m => m.classList.contains('active'));
        if (!hasActiveModal) {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAll() {
        this.modals.forEach(modal => modal.classList.remove('active'));
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    isOpen(modalId) {
        const modal = document.getElementById(modalId);
        return modal?.classList.contains('active');
    }
}

// 初始化模态框
let modal;
document.addEventListener('DOMContentLoaded', () => {
    modal = new Modal();
});
