const lugares = [
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
        disponible: false,
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
        disponible: false,
        icono: "🎨"
      }
    ];

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
          <div class="lugar-imagen">
            ${lugar.icono}
          </div>
          <div class="lugar-content">
            <h3 class="lugar-nombre">${lugar.nombre}</h3>
            <p class="lugar-descripcion">${lugar.descripcion}</p>
            <div class="lugar-info">
              <span class="lugar-capacidad">👥 ${lugar.capacidad}</span>
              <span class="lugar-precio">💰 ${lugar.precio}</span>
            </div>
            <div class="lugar-acciones">
              <button class="btn btn-secondary" onclick="verDetalles(${lugar.id})">Ver detalles</button>
              <button class="btn btn-primary" onclick="reservar(${lugar.id})" ${!lugar.disponible ? 'disabled' : ''}>
                ${lugar.disponible ? 'Reservar' : 'No disponible'}
              </button>
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

      let filteredLugares = lugares.filter(lugar => {
        const matchesSearch = lugar.nombre.toLowerCase().includes(searchTerm) || 
                            lugar.descripcion.toLowerCase().includes(searchTerm);
        
        const matchesCapacity = !capacityFilter || 
          (capacityFilter === '1-5' && parseInt(lugar.capacidad) <= 5) ||
          (capacityFilter === '6-15' && parseInt(lugar.capacidad) >= 6 && parseInt(lugar.capacidad) <= 15) ||
          (capacityFilter === '16+' && parseInt(lugar.capacidad) > 15);
        
        const matchesAvailability = !availabilityFilter ||
          (availabilityFilter === 'disponible' && lugar.disponible) ||
          (availabilityFilter === 'ocupado' && !lugar.disponible);

        return matchesSearch && matchesCapacity && matchesAvailability;
      });

      renderLugares(filteredLugares);
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
        <p><strong>Características adicionales:</strong></p>
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
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Initialize
    renderLugares();