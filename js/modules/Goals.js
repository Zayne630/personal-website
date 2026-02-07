// 目标管理模块
class Goals {
    constructor() {
        this.goals = [];
        this.currentFilter = 'all';
        this.editingId = null;

        this.elements = {
            list: document.getElementById('goalsList'),
            addBtn: document.getElementById('addGoalBtn'),
            modal: document.getElementById('goalModal'),
            form: document.getElementById('goalForm'),
            modalTitle: document.getElementById('goalModalTitle'),
            filters: document.querySelectorAll('.filter-btn')
        };

        this.init();
    }

    init() {
        // 加载数据
        this.loadGoals();

        // 添加按钮
        this.elements.addBtn?.addEventListener('click', () => this.openAddModal());

        // 筛选按钮
        this.elements.filters.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });

        // 表单提交
        this.elements.form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // 使用事件委托处理概览条目点击（使用捕获阶段优先处理）
        document.addEventListener('click', (e) => {
            const overviewItem = e.target.closest('#goalsOverview .overview-item');
            if (overviewItem) {
                const goalId = overviewItem.getAttribute('data-id');
                if (goalId) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    navbar?.showSection('goals');
                    navbar?.setActiveLink('#goals');
                    setTimeout(() => this.openEditModal(goalId), 100);
                }
            }
        }, true);

        // 监听页面切换
        window.addEventListener('sectionChange', (e) => {
            if (e.detail.sectionId === 'goals') {
                this.render();
            }
        });
    }

    loadGoals() {
        this.goals = Helpers.getFromStorage(CONSTANTS.STORAGE_KEYS.GOALS);
        this.render();
    }

    saveGoals() {
        Helpers.saveToStorage(CONSTANTS.STORAGE_KEYS.GOALS, this.goals);
        this.render();
        this.updateOverview();
    }

    openAddModal() {
        this.editingId = null;
        this.elements.modalTitle.textContent = '添加目标';
        this.elements.form.reset();
        this.elements.form.querySelector('#goalStatus').value = 'pending';
        this.elements.form.querySelector('#goalPriority').value = 'medium';
        modal?.open('goalModal');
    }

    openEditModal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;

        this.editingId = id;
        this.elements.modalTitle.textContent = '编辑目标';

        this.elements.form.querySelector('#goalId').value = goal.id;
        this.elements.form.querySelector('#goalTitle').value = goal.title;
        this.elements.form.querySelector('#goalCategory').value = goal.category;
        this.elements.form.querySelector('#goalPriority').value = goal.priority;
        this.elements.form.querySelector('#goalStatus').value = goal.status;
        this.elements.form.querySelector('#goalDescription').value = goal.description || '';

        modal?.open('goalModal');
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            id: this.editingId || Helpers.generateId(),
            title: this.elements.form.querySelector('#goalTitle').value.trim(),
            category: this.elements.form.querySelector('#goalCategory').value,
            priority: this.elements.form.querySelector('#goalPriority').value,
            status: this.elements.form.querySelector('#goalStatus').value,
            description: this.elements.form.querySelector('#goalDescription').value.trim(),
            createdAt: this.editingId ? this.goals.find(g => g.id === this.editingId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editingId) {
            const index = this.goals.findIndex(g => g.id === this.editingId);
            if (index !== -1) {
                this.goals[index] = formData;
                toast?.success('目标已更新');
            }
        } else {
            this.goals.push(formData);
            toast?.success('目标已添加');
        }

        this.saveGoals();
        modal?.close('goalModal');
    }

    handleFilter(btn) {
        this.elements.filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.render();
    }

    deleteGoal(id) {
        if (!confirm('确定要删除这个目标吗？')) return;

        this.goals = this.goals.filter(g => g.id !== id);
        this.saveGoals();
        toast?.success('目标已删除');
    }

    toggleStatus(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;

        const statusFlow = {
            'pending': 'in-progress',
            'in-progress': 'completed',
            'completed': 'pending'
        };

        goal.status = statusFlow[goal.status];
        goal.updatedAt = new Date().toISOString();

        this.saveGoals();
        toast?.success(`状态已更新为：${CONSTANTS.STATUS_LABELS[goal.status]}`);
    }

    getFilteredGoals() {
        if (this.currentFilter === 'all') return this.goals;
        return this.goals.filter(g => g.status === this.currentFilter);
    }

    render() {
        const filtered = this.getFilteredGoals();

        if (filtered.length === 0) {
            this.elements.list.innerHTML = `
                <p class="empty-state">
                    ${this.currentFilter === 'all' ? '还没有目标，点击上方按钮添加你的第一个目标吧！' : '该分类下暂无目标'}
                </p>
            `;
            return;
        }

        this.elements.list.innerHTML = filtered.map(goal => this.createGoalCard(goal)).join('');
        this.attachCardEvents();
    }

    createGoalCard(goal) {
        return `
            <div class="goal-card priority-${goal.priority}" data-id="${goal.id}">
                <div class="goal-header">
                    <h3 class="goal-title">${Helpers.escapeHtml(goal.title)}</h3>
                    <div class="goal-badges">
                        <span class="goal-badge goal-category">${goal.category}</span>
                        <span class="goal-badge goal-status ${goal.status}">${CONSTANTS.STATUS_LABELS[goal.status]}</span>
                    </div>
                </div>
                ${goal.description ? `<p class="goal-description">${Helpers.escapeHtml(goal.description)}</p>` : ''}
                <div class="goal-actions">
                    <button class="btn btn-sm btn-secondary toggle-status" data-id="${goal.id}">
                        ${goal.status === 'completed' ? '重新开始' : '标记完成'}
                    </button>
                    <button class="btn btn-sm btn-secondary edit-goal" data-id="${goal.id}">编辑</button>
                    <button class="btn btn-sm btn-danger delete-goal" data-id="${goal.id}">删除</button>
                </div>
            </div>
        `;
    }

    attachCardEvents() {
        this.elements.list.querySelectorAll('.edit-goal').forEach(btn => {
            btn.addEventListener('click', () => this.openEditModal(btn.getAttribute('data-id')));
        });

        this.elements.list.querySelectorAll('.delete-goal').forEach(btn => {
            btn.addEventListener('click', () => this.deleteGoal(btn.getAttribute('data-id')));
        });

        this.elements.list.querySelectorAll('.toggle-status').forEach(btn => {
            btn.addEventListener('click', () => this.toggleStatus(btn.getAttribute('data-id')));
        });
    }

    updateOverview() {
        const overview = document.querySelector('#goalsOverview .card-content');
        if (!overview) return;

        const activeGoals = this.goals.filter(g => g.status !== 'completed').slice(0, 3);

        if (activeGoals.length === 0) {
            overview.innerHTML = '<p class="empty-state">还没有目标，开始创建你的第一个目标吧！</p>';
            return;
        }

        // 添加进度条
        const totalGoals = this.goals.length;
        const completedGoals = this.goals.filter(g => g.status === 'completed').length;
        const progressPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

        let progressHtml = '';
        if (totalGoals > 0) {
            progressHtml = `
                <div class="progress-section" style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-md);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); font-size: var(--font-size-sm);">
                        <span>完成进度</span>
                        <span style="font-weight: 600; color: var(--primary-color);">${progressPercent}%</span>
                    </div>
                    <div class="progress-bar" style="width: 100%; height: 8px; background: var(--bg-card); border-radius: var(--radius-full); overflow: hidden;">
                        <div class="progress-fill" style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--primary-light), var(--primary-color)); transition: width var(--transition-normal);"></div>
                    </div>
                    <div style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: var(--spacing-xs);">
                        ${completedGoals} / ${totalGoals} 个目标已完成
                    </div>
                </div>
            `;
        }

        overview.innerHTML = progressHtml + activeGoals.map(goal => `
            <div class="goal-card priority-${goal.priority} overview-item" data-id="${goal.id}" style="margin-bottom: 8px; cursor: pointer;">
                <div class="goal-header">
                    <h4 class="goal-title" style="font-size: 14px;">${Helpers.escapeHtml(goal.title)}</h4>
                    <span class="goal-badge goal-status ${goal.status}">${CONSTANTS.STATUS_LABELS[goal.status]}</span>
                </div>
            </div>
        `).join('');

        // 更新统计
        const statGoals = document.getElementById('statGoals');
        if (statGoals) {
            statGoals.textContent = this.goals.filter(g => g.status !== 'completed').length;
        }
    }

    getStats() {
        return {
            total: this.goals.length,
            pending: this.goals.filter(g => g.status === 'pending').length,
            inProgress: this.goals.filter(g => g.status === 'in-progress').length,
            completed: this.goals.filter(g => g.status === 'completed').length
        };
    }
}

// 初始化目标管理
let goals;
document.addEventListener('DOMContentLoaded', () => {
    goals = new Goals();
});
