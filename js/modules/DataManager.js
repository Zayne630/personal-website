// 数据管理模块 - 导出和导入
class DataManager {
    constructor() {
        this.elements = {
            exportBtn: document.getElementById('exportDataBtn'),
            importBtn: document.getElementById('importDataBtn'),
            importInput: document.getElementById('importFileInput')
        };

        this.init();
    }

    init() {
        // 导出按钮
        this.elements.exportBtn?.addEventListener('click', () => this.exportData());

        // 导入按钮
        this.elements.importBtn?.addEventListener('click', () => {
            this.elements.importInput.click();
        });

        // 导入文件选择
        this.elements.importInput?.addEventListener('change', (e) => this.handleImport(e));
    }

    // 导出所有数据
    exportData() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            goals: Helpers.getFromStorage(CONSTANTS.STORAGE_KEYS.GOALS),
            notes: Helpers.getFromStorage(CONSTANTS.STORAGE_KEYS.NOTES),
            habits: Helpers.getFromStorage(CONSTANTS.STORAGE_KEYS.HABITS)
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `成长空间备份_${Helpers.formatDate(new Date(), 'YYYYMMDD_HHmmss')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast?.success('数据导出成功！');
    }

    // 处理导入
    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // 验证数据格式
                if (!this.validateData(data)) {
                    toast?.error('数据格式不正确，无法导入');
                    return;
                }

                // 确认导入
                if (!confirm('导入数据将覆盖现有数据，确定要继续吗？')) {
                    return;
                }

                // 导入数据
                this.importData(data);
                toast?.success('数据导入成功！页面将重新加载');
                setTimeout(() => location.reload(), 1500);

            } catch (error) {
                console.error('导入失败:', error);
                toast?.error('导入失败：文件格式错误');
            }
        };

        reader.readAsText(file);
        event.target.value = '';
    }

    // 验证数据格式
    validateData(data) {
        if (!data || typeof data !== 'object') return false;

        // 检查是否包含至少一个有效数据字段
        const hasValidData =
            Array.isArray(data.goals) ||
            Array.isArray(data.notes) ||
            Array.isArray(data.habits);

        return hasValidData;
    }

    // 导入数据到 LocalStorage
    importData(data) {
        if (Array.isArray(data.goals)) {
            Helpers.saveToStorage(CONSTANTS.STORAGE_KEYS.GOALS, data.goals);
        }

        if (Array.isArray(data.notes)) {
            Helpers.saveToStorage(CONSTANTS.STORAGE_KEYS.NOTES, data.notes);
        }

        if (Array.isArray(data.habits)) {
            Helpers.saveToStorage(CONSTANTS.STORAGE_KEYS.HABITS, data.habits);
        }
    }

    // 清除所有数据
    clearAllData() {
        if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) {
            return;
        }

        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.GOALS);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.NOTES);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.HABITS);
        localStorage.removeItem('personal_website_visited');

        toast?.success('数据已清除，页面将重新加载');
        setTimeout(() => location.reload(), 1000);
    }
}

// 初始化数据管理
let dataManager;
document.addEventListener('DOMContentLoaded', () => {
    dataManager = new DataManager();
});
