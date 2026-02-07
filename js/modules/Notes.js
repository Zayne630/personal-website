// 笔记管理模块
class Notes {
    constructor() {
        this.notes = [];
        this.searchQuery = '';
        this.selectedTag = null;
        this.editingId = null;
        this.isInited = false;

        this.elements = {
            list: document.getElementById('notesList'),
            addBtn: document.getElementById('addNoteBtn'),
            modal: document.getElementById('noteModal'),
            form: document.getElementById('noteForm'),
            modalTitle: document.getElementById('noteModalTitle'),
            searchInput: document.getElementById('noteSearch'),
            tagsFilter: document.getElementById('tagsFilter')
        };

        this.init();
    }

    init() {
        // 防止重复初始化
        if (this.isInited) return;
        this.isInited = true;

        // 加载数据
        this.loadNotes();

        // 添加按钮
        this.elements.addBtn?.addEventListener('click', () => this.openAddModal());

        // 搜索输入
        this.elements.searchInput?.addEventListener('input', Helpers.debounce((e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
        }, 300));

        // 表单提交
        this.elements.form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // 使用事件委托处理概览条目点击（使用捕获阶段优先处理）
        document.addEventListener('click', (e) => {
            const overviewItem = e.target.closest('#notesOverview .overview-item');
            if (overviewItem) {
                const noteId = overviewItem.getAttribute('data-id');
                if (noteId) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    navbar?.showSection('notes');
                    navbar?.setActiveLink('#notes');
                    setTimeout(() => this.openEditModal(noteId), 100);
                }
            }
        }, true);

        // 监听页面切换
        window.addEventListener('sectionChange', (e) => {
            if (e.detail.sectionId === 'notes') {
                this.render();
                this.renderTagsFilter();
            }
        });
    }

    loadNotes() {
        this.notes = Helpers.getFromStorage(CONSTANTS.STORAGE_KEYS.NOTES);
        this.render();
    }

    saveNotes() {
        Helpers.saveToStorage(CONSTANTS.STORAGE_KEYS.NOTES, this.notes);
        this.render();
        this.renderTagsFilter();
        this.updateOverview();
    }

    getAllTags() {
        const tags = new Set();
        this.notes.forEach(note => {
            note.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }

    renderTagsFilter() {
        const tags = this.getAllTags();
        if (tags.length === 0) {
            this.elements.tagsFilter.innerHTML = '';
            return;
        }

        this.elements.tagsFilter.innerHTML = `
            <span class="tag-item ${!this.selectedTag ? 'active' : ''}" data-tag="">全部</span>
            ${tags.map(tag => `
                <span class="tag-item ${this.selectedTag === tag ? 'active' : ''}" data-tag="${Helpers.escapeHtml(tag)}">
                    ${Helpers.escapeHtml(tag)}
                </span>
            `).join('')}
        `;

        this.elements.tagsFilter.querySelectorAll('.tag-item').forEach(tagEl => {
            tagEl.addEventListener('click', () => {
                this.selectedTag = tagEl.getAttribute('data-tag') || null;
                this.renderTagsFilter();
                this.render();
            });
        });
    }

    openAddModal() {
        console.log('Notes.openAddModal() 被调用');
        this.editingId = null;
        this.elements.modalTitle.textContent = '添加笔记';
        this.elements.form.reset();
        console.log('准备打开 noteModal');
        modal?.open('noteModal');
        console.log('noteModal 已打开');
    }

    openEditModal(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        this.editingId = id;
        this.elements.modalTitle.textContent = '编辑笔记';

        this.elements.form.querySelector('#noteId').value = note.id;
        this.elements.form.querySelector('#noteTitle').value = note.title;
        this.elements.form.querySelector('#noteTags').value = note.tags?.join(', ') || '';
        this.elements.form.querySelector('#noteContent').value = note.content;

        modal?.open('noteModal');
    }

    handleSubmit(e) {
        e.preventDefault();

        const tagsString = this.elements.form.querySelector('#noteTags').value;
        const tags = Helpers.parseTags(tagsString);

        const formData = {
            id: this.editingId || Helpers.generateId(),
            title: this.elements.form.querySelector('#noteTitle').value.trim(),
            content: this.elements.form.querySelector('#noteContent').value.trim(),
            tags: tags,
            createdAt: this.editingId ? this.notes.find(n => n.id === this.editingId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editingId) {
            const index = this.notes.findIndex(n => n.id === this.editingId);
            if (index !== -1) {
                this.notes[index] = formData;
                toast?.success('笔记已更新');
            }
        } else {
            this.notes.unshift(formData);
            toast?.success('笔记已添加');
        }

        this.saveNotes();
        modal?.close('noteModal');
    }

    deleteNote(id) {
        if (!confirm('确定要删除这篇笔记吗？')) return;

        this.notes = this.notes.filter(n => n.id !== id);
        this.saveNotes();
        toast?.success('笔记已删除');
    }

    getFilteredNotes() {
        return this.notes.filter(note => {
            const matchesSearch = !this.searchQuery ||
                note.title.toLowerCase().includes(this.searchQuery) ||
                note.content.toLowerCase().includes(this.searchQuery);

            const matchesTag = !this.selectedTag ||
                note.tags?.includes(this.selectedTag);

            return matchesSearch && matchesTag;
        });
    }

    render() {
        const filtered = this.getFilteredNotes();

        if (filtered.length === 0) {
            let message = '还没有笔记，点击上方按钮添加你的第一篇笔记吧！';
            if (this.searchQuery || this.selectedTag) {
                message = '没有找到匹配的笔记';
            }

            this.elements.list.innerHTML = `<p class="empty-state">${message}</p>`;
            return;
        }

        this.elements.list.innerHTML = filtered.map(note => this.createNoteCard(note)).join('');
        this.attachCardEvents();
    }

    createNoteCard(note) {
        const tagsHtml = note.tags?.map(tag =>
            `<span class="note-tag">${Helpers.escapeHtml(tag)}</span>`
        ).join('') || '';

        const content = note.content;
        const isLong = content.length > 150;
        const truncatedContent = isLong ? Helpers.truncateText(content, 150) : content;

        return `
            <div class="note-card" data-id="${note.id}">
                <h3 class="note-title">${Helpers.escapeHtml(note.title)}</h3>
                ${tagsHtml ? `<div class="note-tags">${tagsHtml}</div>` : ''}
                <div class="note-content-wrapper">
                    <p class="note-content ${isLong ? 'collapsed' : ''}">${Helpers.escapeHtml(content)}</p>
                    ${isLong ? `<button class="btn-expand" style="color: var(--primary-color); font-size: var(--font-size-sm); margin-top: var(--spacing-xs); cursor: pointer;">展开全部</button>` : ''}
                </div>
                <div class="note-footer">
                    <span class="note-date">${Helpers.getRelativeTime(note.createdAt)}</span>
                    <div class="goal-actions">
                        <button class="btn btn-sm btn-secondary edit-note" data-id="${note.id}">编辑</button>
                        <button class="btn btn-sm btn-danger delete-note" data-id="${note.id}">删除</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachCardEvents() {
        this.elements.list.querySelectorAll('.edit-note').forEach(btn => {
            btn.addEventListener('click', () => this.openEditModal(btn.getAttribute('data-id')));
        });

        this.elements.list.querySelectorAll('.delete-note').forEach(btn => {
            btn.addEventListener('click', () => this.deleteNote(btn.getAttribute('data-id')));
        });

        // 展开/收起按钮
        this.elements.list.querySelectorAll('.btn-expand').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const content = e.target.previousElementSibling;
                const isExpanded = content.classList.contains('expanded');

                if (isExpanded) {
                    content.classList.remove('expanded');
                    content.classList.add('collapsed');
                    content.style.maxHeight = '120px';
                    content.style.display = '-webkit-box';
                    content.style.webkitLineClamp = '4';
                    e.target.textContent = '展开全部';
                } else {
                    content.classList.remove('collapsed');
                    content.classList.add('expanded');
                    content.style.maxHeight = 'none';
                    content.style.display = 'block';
                    content.style.webkitLineClamp = 'unset';
                    e.target.textContent = '收起';
                }
            });
        });
    }

    updateOverview() {
        const overview = document.querySelector('#notesOverview .card-content');
        if (!overview) return;

        const recentNotes = this.notes.slice(0, 3);

        if (recentNotes.length === 0) {
            overview.innerHTML = '<p class="empty-state">还没有笔记，记录你的学习心得吧！</p>';
            return;
        }

        overview.innerHTML = recentNotes.map(note => `
            <div class="note-card overview-item" data-id="${note.id}" style="margin-bottom: 8px; padding: 12px; cursor: pointer;">
                <h4 class="note-title" style="font-size: 14px;">${Helpers.escapeHtml(note.title)}</h4>
                <span class="note-date">${Helpers.getRelativeTime(note.createdAt)}</span>
            </div>
        `).join('');

        // 更新统计
        const statNotes = document.getElementById('statNotes');
        if (statNotes) {
            statNotes.textContent = this.notes.length;
        }
    }

    getStats() {
        return {
            total: this.notes.length,
            tags: this.getAllTags().length
        };
    }
}

// 初始化笔记管理
let notes;
document.addEventListener('DOMContentLoaded', () => {
    notes = new Notes();
});
