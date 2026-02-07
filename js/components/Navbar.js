// 导航栏组件 - 智能滚动检测
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.toggle = document.getElementById('navbarToggle');
        this.menu = document.querySelector('.navbar-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.lastScrollY = window.scrollY;
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        // 滚动检测
        window.addEventListener('scroll', () => this.handleScroll());

        // 移动端菜单切换
        this.toggle?.addEventListener('click', () => this.toggleMenu());

        // 导航链接点击
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // 下滑隐藏，上拉显示
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.navbar.classList.add('hidden');
        } else {
            this.navbar.classList.remove('hidden');
        }

        this.lastScrollY = currentScrollY;
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.toggle.classList.toggle('active', this.isMenuOpen);
        this.menu.classList.toggle('active', this.isMenuOpen);
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const sectionId = href.substring(1);

        // 切换活跃状态
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');

        // 切换页面区块
        this.showSection(sectionId);

        // 关闭移动端菜单
        this.closeMenu();

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('导航栏链接点击:', sectionId);
    }

    showSection(sectionId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // 触发页面更新事件
        window.dispatchEvent(new CustomEvent('sectionChange', { detail: { sectionId } }));
        console.log('页面切换:', sectionId);
    }

    showSection(sectionId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // 触发页面更新事件
        window.dispatchEvent(new CustomEvent('sectionChange', { detail: { sectionId } }));
    }

    setActiveLink(href) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
}

// 初始化导航栏
let navbar;
document.addEventListener('DOMContentLoaded', () => {
    navbar = new Navbar();
});
