document.addEventListener('DOMContentLoaded', () => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

  if (!usuarioActual || usuarioActual.rol !== 'admin') {
    alert('Acceso denegado. Solo administradores pueden acceder.');
    window.location.href = '../templates/ingresar.html';
    return;
  }

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  const verReservasBtn = document.getElementById('verReservasBtn');
  const verUsuariosBtn = document.getElementById('verUsuariosBtn');
  const verLugaresBtn = document.getElementById('verLugaresBtn');
  const contenidoAdmin = document.getElementById('contenidoAdmin');

  btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('usuarioActual');
    window.location.href = '../templates/ingresar.html';
  });

  verReservasBtn.addEventListener('click', mostrarTodasLasReservas);
  verUsuariosBtn.addEventListener('click', mostrarUsuariosRegistrados);
  verLugaresBtn.addEventListener('click', () => {
    window.location.href = './lugaresDisponibles.html';
  });

function mostrarTodasLasReservas() {
  contenidoAdmin.innerHTML = '<h2>Reservas registradas</h2>';

  const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
  const todasLasReservas = [];

  // 🔽 Agregado: cargar todos los lugares
  const lugaresPorDefecto = JSON.parse(localStorage.getItem('lugaresPorDefecto')) || [];
  const lugaresCreados = JSON.parse(localStorage.getItem('lugares')) || [];
  const todosLosLugares = [...lugaresPorDefecto, ...lugaresCreados];

  for (const email in reservasPorUsuario) {
    reservasPorUsuario[email].forEach(reserva => {
      todasLasReservas.push({ ...reserva, usuarioEmail: email });
    });
  }

  if (todasLasReservas.length === 0) {
    contenidoAdmin.innerHTML += '<p>No hay reservas registradas.</p>';
    return;
  }

  const lista = document.createElement('ul');
  lista.style.listStyle = 'none';
  lista.style.padding = '0';

  todasLasReservas.forEach((reserva, index) => {
    const item = document.createElement('li');
    item.innerHTML = `
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 6px;">
        <strong>Usuario:</strong> ${reserva.usuarioEmail}<br>
        <strong>Lugar:</strong> ${obtenerNombreLugar(reserva.lugarId, todosLosLugares)}<br>
        <strong>Fecha:</strong> ${reserva.fecha}<br>
        <strong>Hora:</strong> ${reserva.hora}<br>
        <strong>Precio:</strong> ${reserva.precio}<br>
        <button onclick="eliminarReserva('${reserva.usuarioEmail}', ${index})" style="margin-top:5px; background-color:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:5px;">Eliminar</button>
      </div>
    `;
    lista.appendChild(item);
  });

  contenidoAdmin.appendChild(lista);
}

function obtenerNombreLugar(id, listaLugares) {
  const lugar = listaLugares.find(l => l.id === id);
  return lugar ? lugar.nombre : 'Lugar no encontrado';
}


  function mostrarUsuariosRegistrados() {
    contenidoAdmin.innerHTML = '<h2>Usuarios registrados</h2>';

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.length === 0) {
      contenidoAdmin.innerHTML += '<p>No hay usuarios registrados.</p>';
      return;
    }

    const tabla = document.createElement('table');
    tabla.style.width = '100%';
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios.map((usuario, index) => `
          <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol || 'usuario'}</td>
            <td>
              ${usuario.rol !== 'admin' ? `<button onclick="eliminarUsuario(${index})" style="background-color:#c0392b; color:white; border:none; padding:5px 10px; border-radius:5px;">Eliminar</button>` : '—'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    contenidoAdmin.appendChild(tabla);
  }

  window.eliminarReserva = function(email, index) {
  const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};

  if (reservasPorUsuario[email] && reservasPorUsuario[email][index]) {
    if (confirm("¿Estás seguro de eliminar esta reserva?")) {
      reservasPorUsuario[email].splice(index, 1);

      if (reservasPorUsuario[email].length === 0) {
        delete reservasPorUsuario[email]; // elimina la clave si ya no hay reservas
      }

      localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));
      mostrarTodasLasReservas();
    }
  }
}

  window.eliminarUsuario = function(index) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
      usuarios.splice(index, 1);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      mostrarUsuariosRegistrados();
    }
  }
});