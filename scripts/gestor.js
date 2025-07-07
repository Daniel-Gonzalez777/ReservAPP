document.addEventListener('DOMContentLoaded', () => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

  const contenedor = document.getElementById('lugaresContenedor');
  const form = document.getElementById('formAgregarLugar');
  const cerrarSesion = document.getElementById('cerrarSesion');

  const linkPerfil = document.getElementById('linkPerfil');
  const linkGestionar = document.getElementById('linkGestionar');
  const seccionPerfil = document.getElementById('seccionPerfil');
  const seccionGestion = document.getElementById('seccionGestion');

  const perfilNombre = document.getElementById('perfilNombre');
  const perfilCorreo = document.getElementById('perfilCorreo');
  const perfilFecha = document.getElementById('perfilFecha');
  const perfilRol = document.getElementById('perfilRol');

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

      const imagenes = lugar.imagenes || [];
      const imagenHTML = imagenes.length > 0 ? `<img src="${imagenes[0]}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;" />` : '';

      div.innerHTML = `
        ${imagenHTML}
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreLugar').value.trim();
    const ubicacion = document.getElementById('ubicacionLugar').value.trim();
    const descripcion = document.getElementById('descripcionLugar').value.trim();
    const capacidad = parseInt(document.getElementById('capacidadLugar').value.trim());
    const precio = document.getElementById('precioLugar').value.trim();
    const archivos = document.getElementById('imagenesLugar').files;

    if (!nombre || !ubicacion || !descripcion || isNaN(capacidad) || capacidad < 1 || !precio || archivos.length === 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const imagenesBase64 = await Promise.all(Array.from(archivos).slice(0, 3).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }));

    const lugares = JSON.parse(localStorage.getItem('lugares')) || [];

    const nuevoLugar = {
      id: Date.now(),
      nombre,
      ubicacion,
      descripcion,
      capacidad,
      precio: `$${precio}/hora`,
      disponible: true,
      gestorId: usuarioActual.email,
      imagenes: imagenesBase64
    };

    lugares.push(nuevoLugar);
    localStorage.setItem('lugares', JSON.stringify(lugares));

    form.reset();
    mostrarLugaresGestor();
  });

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

  function cargarPerfil() {
    perfilNombre.textContent = usuarioActual.nombre;
    perfilCorreo.textContent = usuarioActual.email;
    perfilFecha.textContent = usuarioActual.fecha;
    perfilRol.textContent = usuarioActual.rol;
  }

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

  cerrarSesion.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('usuarioActual');
    window.location.href = 'ingresar.html';
  });

  cargarPerfil();
  mostrarLugaresGestor();
  setInterval(mostrarLugaresGestor, 3000);
});