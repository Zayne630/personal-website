// 习惯追踪模块
class Habits {
    constructor() {
        this.habits = [];
        this.editingId = null;
        this.isInited = false;

        this.elements = {
            list: document.getElementById('habitsList'),
            addBtn: document.getElementById('addHabitBtn'),
            modal: document.getElementById('habitModal'),
            form: document.getElementById('habitForm'),
            modalTitle: document.getElementById('habitModalTitle'),
            heatmap: document.getElementById('habitHeatmap')
        };

        this.init();
    }

    init() {
        // 防止重复初始化
        if (this.isInited) {
            console.log('Habits.init(): 已初始化，跳过');
            return;
        }
        this.isInited = true;

        console.log('Habits.init() 开始');
        console.log('Habits.addBtn:', this.elements.addBtn, 'ID:', this.elements.addBtn?.id);

        // 加载数据
        this.loadHabits();

        // 添加按钮 - 使用命名函数以便调试
        if (this.elements.addBtn) {
            const habitsAddHandler = () => {
                console.log('Habits.addBtn 被点击!');
                console.log('当前元素:', event.target, 'ID:', event.target.id);
                this.openAddModal();
            };
            this.elements.addBtn.addEventListener('click', habitsAddHandler);
            console.log('Habits.addBtn 事件监听器已绑定');
        } else {
            console.error('Habits.addBtn 未找到!');
        }

        // 表单提交
        this.elements.form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // 使用事件委托处理概览条目点击（使用捕获阶段优先处理）
        document.addEventListener('click', (e) => {
            const overviewItem = e.target.closest('#habitsOverview .overview-item');
            if (overviewItem) {
                // 如果点击的是打卡按钮，只执行打卡操作
                if (e.target.classList.contains('habit-check') || e.target.closest('.habit-check')) {
                    const habitId = overviewItem.getAttribute('data-id');
                    if (habitId) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        this.toggleCheck(habitId);
                    }
                    return;
                }
                // 否则跳转到习惯页面并打开编辑模态框
                const habitId = overviewItem.getAttribute('data-id');
                if (habitId) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    navbar?.showSection('habits');
                    navbar?.setActiveLink('#habits');
                    setTimeout(() => this.openEditModal(habitId), 100);
                }
            }
        }, true);

        // 监听页面切换
        window.addEventListener('sectionChange', (e) => {
            if (e.detail.sectionId === 'habits') {
                this.render();
                this.renderHeatmap();
            }
        });
    }

    loadHabits() {
        this.habits = Helpers.getFromStorage(CONSTANTS.STORAGE_KEYS.HABITS);
        this.render();
    }

    saveHabits() {
        Helpers.saveToStorage(CONSTANTS.STORAGE_KEYS.HABITS, this.habits);
        this.render();
        this.renderHeatmap();
        this.updateOverview();
    }

    openAddModal() {
        console.log('Habits.openAddModal() 被调用');
        this.editingId = null;
        this.elements.modalTitle.textContent = '添加习惯';
        this.elements.form.reset();
        this.elements.form.querySelector('#habitColor').value = '#FF8C42';
        console.log('准备打开 habitModal');
        modal?.open('habitModal');
        console.log('habitModal 已打开');
    }

    openEditModal(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        this.editingId = id;
        this.elements.modalTitle.textContent = '编辑习惯';

        this.elements.form.querySelector('#habitId').value = habit.id;
        this.elements.form.querySelector('#habitTitle').value = habit.title;
        this.elements.form.querySelector('#habitIcon').value = habit.icon || '';
        this.elements.form.querySelector('#habitColor').value = habit.color || '#FF8C42';

        modal?.open('habitModal');
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            id: this.editingId || Helpers.generateId(),
            title: this.elements.form.querySelector('#habitTitle').value.trim(),
            icon: this.elements.form.querySelector('#habitIcon').value.trim() || '✅',
            color: this.elements.form.querySelector('#habitColor').value,
            checkDates: this.editingId ? this.habits.find(h => h.id === this.editingId)?.checkDates : [],
            createdAt: this.editingId ? this.habits.find(h => h.id === this.editingId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editingId) {
            const index = this.habits.findIndex(h => h.id === this.editingId);
            if (index !== -1) {
                this.habits[index] = formData;
                toast?.success('习惯已更新');
            }
        } else {
            this.habits.push(formData);
            toast?.success('习惯已添加');
        }

        this.saveHabits();
        modal?.close('habitModal');
    }

    deleteHabit(id) {
        if (!confirm('确定要删除这个习惯吗？打卡记录也会被删除。')) return;

        this.habits = this.habits.filter(h => h.id !== id);
        this.saveHabits();
        toast?.success('习惯已删除');
    }

    toggleCheck(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const today = Helpers.getTodayString();
        const checkDates = habit.checkDates || [];

        const index = checkDates.indexOf(today);
        if (index > -1) {
            checkDates.splice(index, 1);
            toast?.info('已取消打卡');
        } else {
            checkDates.push(today);
            toast?.success('打卡成功！');
        }

        habit.checkDates = checkDates;
        habit.updatedAt = new Date().toISOString();

        this.saveHabits();
    }

    isCheckedToday(habit) {
        const today = Helpers.getTodayString();
        return (habit.checkDates || []).includes(today);
    }

    getStreak(habit) {
        return Helpers.calculateStreak(habit.checkDates);
    }

    render() {
        if (this.habits.length === 0) {
            this.elements.list.innerHTML = '<p class="empty-state">还没有习惯，点击上方按钮添加你的第一个习惯吧！</p>';
            return;
        }

        this.elements.list.innerHTML = this.habits.map(habit => this.createHabitCard(habit)).join('');
        this.attachCardEvents();
    }

    createHabitCard(habit) {
        const streak = this.getStreak(habit);
        const isChecked = this.isCheckedToday(habit);

        return `
            <div class="habit-card" data-id="${habit.id}" style="border-left: 4px solid ${habit.color};">
                <div class="habit-icon" style="background: ${habit.color}20;">
                    ${habit.icon || '✅'}
                </div>
                <div class="habit-info">
                    <div class="habit-title">${Helpers.escapeHtml(habit.title)}</div>
                    <div class="habit-streak">连续 ${streak} 天</div>
                </div>
                <div class="habit-check ${isChecked ? 'checked' : ''}" data-id="${habit.id}">
                    ${isChecked ? '✓' : ''}
                </div>
                <div class="habit-actions">
                    <button class="btn btn-icon edit-habit" data-id="${habit.id}" title="编辑">✏️</button>
                    <button class="btn btn-icon delete-habit" data-id="${habit.id}" title="删除">🗑️</button>
                </div>
            </div>
        `;
    }

    attachCardEvents() {
        this.elements.list.querySelectorAll('.habit-check').forEach(el => {
            el.addEventListener('click', () => this.toggleCheck(el.getAttribute('data-id')));
        });

        this.elements.list.querySelectorAll('.edit-habit').forEach(btn => {
            btn.addEventListener('click', () => this.openEditModal(btn.getAttribute('data-id')));
        });

        this.elements.list.querySelectorAll('.delete-habit').forEach(btn => {
            btn.addEventListener('click', () => this.deleteHabit(btn.getAttribute('data-id')));
        });
    }

    renderHeatmap() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const monthDays = Helpers.getMonthDays(year, month);

        // 获取本月所有打卡记录
        const checkData = {};
        this.habits.forEach(habit => {
            (habit.checkDates || []).forEach(dateStr => {
                const date = new Date(dateStr);
                if (date.getFullYear() === year && date.getMonth() === month) {
                    const day = date.getDate();
                    checkData[day] = (checkData[day] || 0) + 1;
                }
            });
        });

        const maxChecks = Math.max(...Object.values(checkData), 1);

        this.elements.heatmap.innerHTML = monthDays.map(date => {
            const day = date.getDate();
            const checks = checkData[day] || 0;
            const isToday = date.toDateString() === today.toDateString();

            let level = 0;
            if (checks > 0) level = 1;
            if (checks >= maxChecks * 0.5) level = 2;
            if (checks >= maxChecks) level = 3;

            return `
                <div class="heatmap-day level-${level} ${isToday ? 'today' : ''}">
                    ${checks > 0 ? `<span class="heatmap-tooltip">${date.getMonth() + 1}/${day} - ${checks}次打卡</span>` : ''}
                </div>
            `;
        }).join('');
    }

    updateOverview() {
        const overview = document.querySelector('#habitsOverview .card-content');
        if (!overview) return;

        if (this.habits.length === 0) {
            overview.innerHTML = '<p class="empty-state">还没有习惯，创建一个新习惯吧！</p>';
            return;
        }

        const todayHabits = this.habits.slice(0, 3);

        overview.innerHTML = todayHabits.map(habit => {
            const isChecked = this.isCheckedToday(habit);
            return `
                <div class="habit-card overview-item" data-id="${habit.id}" style="margin-bottom: 8px; padding: 12px; border-left: 4px solid ${habit.color}; cursor: pointer;">
                    <div class="habit-icon" style="width: 36px; height: 36px; font-size: 18px; background: ${habit.color}20;">
                        ${habit.icon || '✅'}
                    </div>
                    <div class="habit-info">
                        <div class="habit-title" style="font-size: 14px;">${Helpers.escapeHtml(habit.title)}</div>
                        <div class="habit-streak" style="font-size: 12px;">连续 ${this.getStreak(habit)} 天</div>
                    </div>
                    <div class="habit-check ${isChecked ? 'checked' : ''}" style="width: 32px; height: 32px; font-size: 14px;">
                        ${isChecked ? '✓' : ''}
                    </div>
                </div>
            `;
        }).join('');

        // 更新统计
        const statHabits = document.getElementById('statHabits');
        if (statHabits) {
            statHabits.textContent = this.habits.length;
        }
    }

    getStats() {
        return {
            total: this.habits.length,
            todayChecks: this.habits.filter(h => this.isCheckedToday(h)).length
        };
    }
}

// 初始化习惯追踪
let habits;
document.addEventListener('DOMContentLoaded', () => {
    habits = new Habits();
});
