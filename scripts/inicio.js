const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');

function initializeNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
}

function handleNavClick(event) {
    const clickedItem = event.currentTarget;
    const targetSection = clickedItem.getAttribute('data-section');
    
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    clickedItem.classList.add('active');
    
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`content-${targetSection}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    addClickFeedback(clickedItem);
}

function addClickFeedback(element) {
    element.style.transform = 'translateX(6px) scale(0.98)';
    
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        if (event.altKey) {
            switch(event.key) {
                case '1':
                    activateNavItem('inicio');
                    break;
                case '2':
                    activateNavItem('lugares');
                    break;
                case '3':
                    activateNavItem('calendario');
                    break;
                case '4':
                    activateNavItem('reva');
                    break;
            }
        }
    });
}

function activateNavItem(section) {
    const navItem = document.querySelector(`[data-section="${section}"]`);
    if (navItem) {
        navItem.click();
    }
}

function initializeResponsiveFeatures() {
    const sidebar = document.querySelector('.sidebar');
    let isCollapsed = window.innerWidth <= 768;
    
    window.addEventListener('resize', () => {
        const shouldCollapse = window.innerWidth <= 768;
        if (shouldCollapse !== isCollapsed) {
            isCollapsed = shouldCollapse;
            updateSidebarState();
        }
    });
    
    if (window.innerWidth > 768) {
        sidebar.addEventListener('dblclick', toggleSidebar);
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

function updateSidebarState() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.add('mobile');
    } else {
        sidebar.classList.remove('mobile');
    }
}

function loadContent(section) {
    const contentArea = document.getElementById(`content-${section}`);
    
    contentArea.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando ${section}...</p>
        </div>
    `;
    
    setTimeout(() => {
        switch(section) {
            case 'inicio':
                contentArea.innerHTML = `
                    <h2>Bienvenido a ReservApp</h2>
                    <p>Panel de control principal</p>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Reservas Activas</h3>
                            <span class="stat-number">24</span>
                        </div>
                        <div class="stat-card">
                            <h3>Lugares Disponibles</h3>
                            <span class="stat-number">156</span>
                        </div>
                    </div>
                `;
                break;
            case 'lugares':
                contentArea.innerHTML = `
                    <h2>Lugares Disponibles</h2>
                    <p>Aquí puedes ver todos los lugares disponibles para reservar</p>
                    <div class="places-list">
                        <div class="place-item">Sala de Conferencias A</div>
                        <div class="place-item">Oficina Privada 1</div>
                        <div class="place-item">Espacio Coworking</div>
                    </div>
                `;
                break;
            case 'calendario':
                contentArea.innerHTML = `
                    <h2>Calendario</h2>
                    <p>Gestiona tus reservas y horarios</p>
                    <div class="calendar-widget">
                        <p>Widget de calendario aquí</p>
                    </div>
                `;
                break;
            case 'reva':
                contentArea.innerHTML = `
                    <h2>REVA - Asistente Virtual</h2>
                    <p>Tu asistente para reservas automáticas</p>
                    <div class="chat-interface">
                        <div class="chat-message">¡Hola! Soy REVA, tu asistente virtual.</div>
                    </div>
                `;
                break;
        }
    }, 500);
}

function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-theme', prefersDark);
}

function initializeAccessibility() {
    navItems.forEach((item, index) => {
        const section = item.getAttribute('data-section');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Navegar a ${section}`);
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.click();
            }
        });
    });
}

function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Ha ocurrido un error. Por favor, recarga la página.';
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

function initializeApp() {
    try {
        initializeNavigation();
        initializeKeyboardNavigation();
        initializeResponsiveFeatures();
        initializeTheme();
        initializeAccessibility();
        
        console.log('ReservApp initialized successfully');
    } catch (error) {
        handleError(error, 'App initialization');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App is now hidden');
    } else {
        console.log('App is now visible');
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        handleNavClick,
        activateNavItem,
        loadContent
    };
}

document.addEventListener('DOMContentLoaded', () => {
  const botonesVer = document.querySelectorAll('.btn-ver');
  botonesVer.forEach(boton => {
    boton.addEventListener('click', () => {
      const info = boton.getAttribute('data-info');
      alert(info);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const botonesVer = document.querySelectorAll('.btn-ver');
  botonesVer.forEach(boton => {
    boton.addEventListener('click', () => {
      const datosReserva = {
        nombre: boton.dataset.nombre,
        direccion: boton.dataset.direccion,
        fecha: boton.dataset.fecha,
        hora: boton.dataset.hora,
        precio: boton.dataset.precio,
        imagen: boton.dataset.imagen,
        descripcion: boton.dataset.descripcion
      };
      localStorage.setItem('detalleReserva', JSON.stringify(datosReserva));
      window.location.href = '../templates/detallesReserva.html';
    });
  });
});

