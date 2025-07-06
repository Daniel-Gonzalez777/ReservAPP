const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || {};
const esAdmin = usuarioActual.rol === 'admin';

let lugaresPorDefecto = JSON.parse(localStorage.getItem('lugaresPorDefecto'));
if (!lugaresPorDefecto) {
  lugaresPorDefecto = [
    {
      id: 1,
      nombre: "Sala de Conferencias A",
      descripcion: "Amplio espacio ideal para presentaciones y reuniones corporativas con equipamiento audiovisual completo.",
      capacidad: "20 personas",
      precio: "$50/hora",
      disponible: true,
      icono: "🏢"
    },
    {
      id: 2,
      nombre: "Oficina Privada 1",
      descripcion: "Espacio privado perfecto para reuniones ejecutivas y llamadas confidenciales.",
      capacidad: "8 personas",
      precio: "$30/hora",
      disponible: true,
      icono: "🏪"
    },
    {
      id: 3,
      nombre: "Espacio Coworking",
      descripcion: "Ambiente colaborativo con mesas flexibles y excelente conectividad wifi.",
      capacidad: "15 personas",
      precio: "$25/hora",
      disponible: true,
      icono: "💼"
    },
    {
      id: 4,
      nombre: "Sala de Reuniones B",
      descripcion: "Sala moderna con pizarra digital y sistema de videoconferencia integrado.",
      capacidad: "12 personas",
      precio: "$40/hora",
      disponible: true,
      icono: "📋"
    },
    {
      id: 5,
      nombre: "Auditorio Principal",
      descripcion: "Gran auditorio con capacidad para eventos masivos y presentaciones importantes.",
      capacidad: "100 personas",
      precio: "$150/hora",
      disponible: true,
      icono: "🎭"
    },
    {
      id: 6,
      nombre: "Sala Creativa",
      descripcion: "Espacio diseñado para brainstorming y sesiones creativas con mobiliario flexible.",
      capacidad: "10 personas",
      precio: "$35/hora",
      disponible: true,
      icono: "🎨"
    }
  ];
  localStorage.setItem('lugaresPorDefecto', JSON.stringify(lugaresPorDefecto));
}

let lugaresCreados = JSON.parse(localStorage.getItem('lugares'));
if (!lugaresCreados) {
  lugaresCreados = [];
  localStorage.setItem('lugares', JSON.stringify(lugaresCreados));
}

let lugares = [...lugaresPorDefecto, ...lugaresCreados];

function renderLugares(lugaresToRender = lugares) {
  const grid = document.getElementById('lugaresGrid');
  grid.innerHTML = '';

  lugaresToRender.forEach(lugar => {
    const card = document.createElement('div');
    card.className = 'lugar-card';
    card.innerHTML = `
      <div class="disponibilidad-badge ${lugar.disponible ? 'disponible' : 'ocupado'}">
        ${lugar.disponible ? 'Disponible' : 'Ocupado'}
      </div>
      <div class="lugar-imagen">${lugar.icono}</div>
      <div class="lugar-content">
        <h3 class="lugar-nombre">${lugar.nombre}</h3>
        <p class="lugar-descripcion">${lugar.descripcion}</p>
        <div class="lugar-info">
          <span class="lugar-capacidad">👥 ${lugar.capacidad}</span>
          <span class="lugar-precio">💰 ${lugar.precio}</span>
        </div>
        <div class="lugar-acciones">
          <button class="btn btn-secondary" onclick="verDetalles(${lugar.id})">Ver detalles</button>
          ${esAdmin
            ? `<button class="btn btn-danger" onclick="eliminarLugar(${lugar.id})">Eliminar</button>`
            : `<button class="btn btn-primary" onclick="reservar(${lugar.id})" ${!lugar.disponible ? 'disabled' : ''}>
                ${lugar.disponible ? 'Reservar' : 'No disponible'}
              </button>`
          }
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterLugares() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const capacityFilter = document.getElementById('capacityFilter').value;
  const availabilityFilter = document.getElementById('availabilityFilter').value;

  const filtered = lugares.filter(lugar => {
    const capacidadNum = parseInt(lugar.capacidad);
    const matchesSearch = lugar.nombre.toLowerCase().includes(searchTerm) || lugar.descripcion.toLowerCase().includes(searchTerm);
    const matchesCapacity = !capacityFilter ||
      (capacityFilter === '1-5' && capacidadNum <= 5) ||
      (capacityFilter === '6-15' && capacidadNum >= 6 && capacidadNum <= 15) ||
      (capacityFilter === '16+' && capacidadNum > 15);
    const matchesAvailability = !availabilityFilter ||
      (availabilityFilter === 'disponible' && lugar.disponible) ||
      (availabilityFilter === 'ocupado' && !lugar.disponible);
    return matchesSearch && matchesCapacity && matchesAvailability;
  });

  renderLugares(filtered);
}

function verDetalles(id) {
  const lugar = lugares.find(l => l.id === id);
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

  modalContent.innerHTML = `
    <h2>${lugar.icono} ${lugar.nombre}</h2>
    <p><strong>Descripción:</strong> ${lugar.descripcion}</p>
    <p><strong>Capacidad:</strong> ${lugar.capacidad}</p>
    <p><strong>Precio:</strong> ${lugar.precio}</p>
    <p><strong>Estado:</strong> ${lugar.disponible ? '✅ Disponible' : '❌ Ocupado'}</p>
    <ul style="color: #a0aec0; margin-left: 20px; line-height: 1.6;">
      <li>Aire acondicionado</li>
      <li>Wi-Fi de alta velocidad</li>
      <li>Sistema de sonido</li>
      <li>Proyector incluido</li>
    </ul>
  `;

  modal.style.display = 'block';
}

function reservar(id) {
  const lugar = lugares.find(l => l.id === id);
  if (!lugar || !lugar.disponible) {
    showNotification('Este lugar no está disponible para reserva.', 'error');
    return;
  }

  localStorage.setItem('lugarSeleccionado', JSON.stringify(lugar));
  window.location.href = '../templates/formularioReserva.html';
}

function eliminarLugar(id) {
  if (!confirm('¿Seguro que quieres eliminar este lugar?')) return;

  let creados = JSON.parse(localStorage.getItem('lugares')) || [];
  creados = creados.filter(l => l.id !== id);
  localStorage.setItem('lugares', JSON.stringify(creados));

  let porDef = JSON.parse(localStorage.getItem('lugaresPorDefecto')) || [];
  porDef = porDef.filter(l => l.id !== id);
  localStorage.setItem('lugaresPorDefecto', JSON.stringify(porDef));

  let reservasGlobal = JSON.parse(localStorage.getItem('reservas')) || [];
  reservasGlobal = reservasGlobal.filter(r => r.lugarId !== id);
  localStorage.setItem('reservas', JSON.stringify(reservasGlobal));

  let reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
  for (let email in reservasPorUsuario) {
    reservasPorUsuario[email] = reservasPorUsuario[email].filter(r => r.lugarId !== id);
  }
  localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));

  porDef.forEach(l => {
    if (l.id === id) l.disponible = true;
  });
  creados.forEach(l => {
    if (l.id === id) l.disponible = true;
  });

  lugares = [...porDef, ...creados];
  renderLugares(lugares);
  showNotification('Lugar eliminado y reservas canceladas.');
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');

  notificationText.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

document.getElementById('searchInput').addEventListener('input', filterLugares);
document.getElementById('capacityFilter').addEventListener('change', filterLugares);
document.getElementById('availabilityFilter').addEventListener('change', filterLugares);
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('modal')) {
    document.getElementById('modal').style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (esAdmin) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      const linkInicio = document.getElementById('linkInicio');
      const linkReva = document.getElementById('linkReva');
      if (linkInicio) linkInicio.style.display = 'none';
      if (linkReva) linkReva.style.display = 'none';

      const adminLink = document.createElement('a');
      adminLink.href = 'adminInicio.html';
      adminLink.className = 'nav-link';
      adminLink.textContent = 'Panel Admin';
      navLinks.appendChild(adminLink);
    }
  }
  renderLugares();
});

document.addEventListener('DOMContentLoaded', () => {
  const btnCerrarSesion = document.getElementById('cerrarSesionBtn');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioActual');
      window.location.href = 'ingresar.html';
    });
  }
});