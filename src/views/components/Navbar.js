/**
 * AppNavbar Component
 * Layer   : View
 * Purpose : Custom Web Component for the application header and navigation.
 *           Emits custom event 'navigate' when navigation links are clicked.
 */

export class AppNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    this.highlightActiveRoute();
  }

  render() {
    this.innerHTML = `
      <header class="shell-header">
        <div class="container shell-header__inner">
          <a href="/" class="shell-logo" data-route="/">
            <span class="shell-logo__icon"><i class="bi bi-heart-pulse-fill"></i></span>
            <span class="shell-logo__name">SIPREDIA</span>
          </a>

          <!-- Desktop Navigation -->
          <nav class="shell-nav" aria-label="Navigasi utama">
            <a href="/" class="shell-nav__link" data-route="/">Home</a>
            <a href="/about" class="shell-nav__link" data-route="/about">Tentang</a>
            <a href="/screening" class="shell-nav__link" data-route="/screening">Prediksi</a>
          </nav>

          <!-- User Section -->
          <div class="shell-user">
            <!-- Rendered dynamically via setUser() -->
          </div>

          <!-- Mobile Toggle Button -->
          <button class="mobile-nav-toggle" aria-label="Buka Menu" aria-expanded="false">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>

        <!-- Mobile Navigation Menu -->
        <nav class="mobile-nav-menu" aria-label="Navigasi mobile" hidden>
          <a href="/" class="mobile-nav-menu__link" data-route="/">Home</a>
          <a href="/about" class="mobile-nav-menu__link" data-route="/about">Tentang</a>
          <a href="/screening" class="mobile-nav-menu__link" data-route="/screening">Prediksi</a>
          <div class="mobile-user-actions" style="border-top: 1px solid var(--color-border); margin-top: var(--space-3); padding-top: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2);">
            <!-- Rendered dynamically via setUser() -->
          </div>
        </nav>
      </header>
    `;
  }

  bindEvents() {
    // Intercept clicks on links with data-route
    this.addEventListener('click', (event) => {
      const link = event.target.closest('[data-route]');
      if (link) {
        event.preventDefault();
        const path = link.getAttribute('data-route');
        
        // Dispatch custom navigate event to be handled by Presenter
        this.dispatchEvent(new CustomEvent('navigate', {
          detail: { path },
          bubbles: true,
          composed: true
        }));

        // Close mobile menu after clicking a link
        this.closeMobileMenu();
      }
    });

    // Mobile menu toggle logic
    const toggleButton = this.querySelector('.mobile-nav-toggle');
    const mobileMenu = this.querySelector('.mobile-nav-menu');

    if (toggleButton && mobileMenu) {
      toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        toggleButton.classList.toggle('active');
        
        if (isExpanded) {
          mobileMenu.hidden = true;
          mobileMenu.classList.remove('open');
        } else {
          mobileMenu.hidden = false;
          mobileMenu.classList.add('open');
        }
      });
    }
  }

  closeMobileMenu() {
    const toggleButton = this.querySelector('.mobile-nav-toggle');
    const mobileMenu = this.querySelector('.mobile-nav-menu');
    if (toggleButton && mobileMenu) {
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.classList.remove('active');
      mobileMenu.hidden = true;
      mobileMenu.classList.remove('open');
    }
  }

  /**
   * Sets the user context in the navigation header.
   * @param {object|null} user - The user object containing name or username
   */
  setUser(user) {
    const desktopContainer = this.querySelector('.shell-user');
    const mobileContainer = this.querySelector('.mobile-user-actions');
    
    const renderUserDesktop = user ? `
      <span class="shell-user__name">${this.#escapeHtml(user.name || user.username)}</span>
      <button class="btn btn-secondary btn-sm" id="btn-logout-desktop" aria-label="Logout">Keluar</button>
    ` : `
      <a href="/login" class="btn btn-primary btn-sm" data-route="/login" style="display: none;">Masuk</a>
    `;

    const renderUserMobile = user ? `
      <span class="shell-user__name" style="color: var(--color-text-secondary); margin-bottom: var(--space-2); font-weight: 500;">${this.#escapeHtml(user.name || user.username)}</span>
      <button class="btn btn-secondary btn-sm" id="btn-logout-mobile" aria-label="Logout" style="width: 100%;">Keluar</button>
    ` : `
      <a href="/login" class="btn btn-primary btn-sm" data-route="/login" style="text-align: center; display: none;">Masuk</a>
    `;

    if (desktopContainer) desktopContainer.innerHTML = renderUserDesktop;
    if (mobileContainer) mobileContainer.innerHTML = renderUserMobile;

    // Attach logout event listeners
    [this.querySelector('#btn-logout-desktop'), this.querySelector('#btn-logout-mobile')].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.dispatchEvent(new CustomEvent('logout', {
            bubbles: true,
            composed: true
          }));
          this.closeMobileMenu();
        });
      }
    });
  }

  /**
   * Highlights active menu items based on current window location
   * @param {string} [currentPath] - Option to pass path directly
   */
  highlightActiveRoute(currentPath = window.location.pathname) {
    const links = this.querySelectorAll('[data-route]');
    links.forEach((link) => {
      const route = link.getAttribute('data-route');
      const isActive = route === currentPath;
      
      if (link.classList.contains('shell-nav__link')) {
        link.classList.toggle('shell-nav__link--active', isActive);
      } else if (link.classList.contains('mobile-nav-menu__link')) {
        link.classList.toggle('mobile-nav-menu__link--active', isActive);
      }
    });
  }

  #escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  }
}

customElements.define('app-navbar', AppNavbar);
