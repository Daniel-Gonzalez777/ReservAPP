document.addEventListener('DOMContentLoaded', () => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

  // Elementos del DOM
  const contenedor = document.getElementById('lugaresContenedor');
  const form = document.getElementById('formAgregarLugar');
  const cerrarSesion = document.getElementById('cerrarSesion');

  // Navegación entre secciones
  const linkPerfil = document.getElementById('linkPerfil');
  const linkGestionar = document.getElementById('linkGestionar');
  const seccionPerfil = document.getElementById('seccionPerfil');
  const seccionGestion = document.getElementById('seccionGestion');

  // Perfil
  const perfilNombre = document.getElementById('perfilNombre');
  const perfilCorreo = document.getElementById('perfilCorreo');
  const perfilFecha = document.getElementById('perfilFecha');
  const perfilRol = document.getElementById('perfilRol');

  // Mostrar lugares del gestor actual
  function mostrarLugaresGestor() {
    const lugares = JSON.parse(localStorage.getItem('lugares')) || [];
    const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};

    contenedor.innerHTML = '';

    const misLugares = lugares.filter(l => l.gestorId === usuarioActual.email);

    misLugares.forEach(lugar => {
      let reservados = 0;
      const usuariosReservaron = [];

      for (const usuario in reservasPorUsuario) {
        const reservasUsuario = reservasPorUsuario[usuario];
        reservasUsuario.forEach(reserva => {
          if (reserva.lugarId === lugar.id) {
            reservados++;
            if (!usuariosReservaron.includes(usuario)) {
              usuariosReservaron.push(usuario);
            }
          }
        });
      }

      const div = document.createElement('div');
      div.classList.add('lugar-card');

      div.innerHTML = `
        <h3>${lugar.nombre}</h3>
        <p><strong>Ubicación:</strong> ${lugar.ubicacion}</p>
        <p><strong>Descripción:</strong> ${lugar.descripcion}</p>
        <p><strong>Capacidad:</strong> ${lugar.capacidad}</p>
        <p><strong>Precio:</strong> ${lugar.precio}</p>
        <p><strong>Estado:</strong> ${reservados > 0 ? 'Reservado' : 'Disponible'}</p>
        <p><strong>Usuarios:</strong> ${usuariosReservaron.length > 0 ? usuariosReservaron.join(', ') : 'Ninguno'}</p>
        <button class="eliminar" data-id="${lugar.id}">Eliminar</button>
      `;

      contenedor.appendChild(div);
    });
  }

  // Agregar nuevo lugar
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreLugar').value.trim();
    const ubicacion = document.getElementById('ubicacionLugar').value.trim();
    const descripcion = document.getElementById('descripcionLugar').value.trim();
    const capacidad = parseInt(document.getElementById('capacidadLugar').value.trim());
    const precio = document.getElementById('precioLugar').value.trim();

    if (!nombre || !ubicacion || !descripcion || isNaN(capacidad) || capacidad < 1 || !precio) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const lugares = JSON.parse(localStorage.getItem('lugares')) || [];

    const nuevoLugar = {
      id: Date.now(),
      nombre,
      ubicacion,
      descripcion,
      capacidad,
      precio: `$${precio}/hora`,
      disponible: true,
      gestorId: usuarioActual.email
    };

    lugares.push(nuevoLugar);
    localStorage.setItem('lugares', JSON.stringify(lugares));

    form.reset();
    mostrarLugaresGestor();
  });

  // Eliminar lugar
  contenedor.addEventListener('click', (e) => {
    if (e.target.classList.contains('eliminar')) {
      const id = parseInt(e.target.dataset.id);
      const lugares = JSON.parse(localStorage.getItem('lugares')) || [];
      const index = lugares.findIndex(l => l.id === id && l.gestorId === usuarioActual.email);

      if (index !== -1) {
        lugares.splice(index, 1);
        localStorage.setItem('lugares', JSON.stringify(lugares));
        mostrarLugaresGestor();
      }
    }
  });

  // Cargar perfil
  function cargarPerfil() {
    perfilNombre.textContent = usuarioActual.nombre;
    perfilCorreo.textContent = usuarioActual.email;
    perfilFecha.textContent = usuarioActual.fecha;
    perfilRol.textContent = usuarioActual.rol;
  }

  // Navegación entre secciones
  linkPerfil.addEventListener('click', (e) => {
    e.preventDefault();
    seccionPerfil.style.display = 'block';
    seccionGestion.style.display = 'none';
    linkPerfil.classList.add('active');
    linkGestionar.classList.remove('active');
    cargarPerfil();
  });

  linkGestionar.addEventListener('click', (e) => {
    e.preventDefault();
    seccionPerfil.style.display = 'none';
    seccionGestion.style.display = 'block';
    linkGestionar.classList.add('active');
    linkPerfil.classList.remove('active');
  });

  // Cerrar sesión
  cerrarSesion.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('usuarioActual');
    window.location.href = 'ingresar.html';
  });

  // Inicialización
  cargarPerfil();
  mostrarLugaresGestor();

  // Actualización automática cada 3 segundos
  setInterval(mostrarLugaresGestor, 3000);
});