document.addEventListener('DOMContentLoaded', () => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  if (!usuarioActual || usuarioActual.rol !== 'admin') {
    alert('Acceso denegado. Solo administradores pueden acceder.');
    window.location.href = '../templates/ingresar.html';
    return;
  }

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  const verReservasBtn    = document.getElementById('verReservasBtn');
  const verUsuariosBtn    = document.getElementById('verUsuariosBtn');
  const verLugaresBtn     = document.getElementById('verLugaresBtn');
  const contenidoAdmin    = document.getElementById('contenidoAdmin');

  btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('usuarioActual');
    window.location.href = '../templates/ingresar.html';
  });
  verReservasBtn.addEventListener('click', mostrarTodasLasReservas);
  verUsuariosBtn.addEventListener('click', mostrarUsuariosRegistrados);
  verLugaresBtn.addEventListener('click', () => {
    window.location.href = './lugaresDisponibles.html';
  });

  const lugaresPorDefecto = [
    { id: 1, nombre: "Sala de Conferencias A"     },
    { id: 2, nombre: "Oficina Privada 1"          },
    { id: 3, nombre: "Espacio Coworking"          },
    { id: 4, nombre: "Sala de Reuniones B"        },
    { id: 5, nombre: "Auditorio Principal"        },
    { id: 6, nombre: "Sala Creativa"              }
  ];

  function mostrarTodasLasReservas() {
    contenidoAdmin.innerHTML = '<h2>Reservas registradas</h2>';

    const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
    const todasLasReservas   = [];

    for (const email in reservasPorUsuario) {
      reservasPorUsuario[email].forEach(r => {
        todasLasReservas.push({ ...r, usuarioEmail: email });
      });
    }

    if (!todasLasReservas.length) {
      contenidoAdmin.innerHTML += '<p>No hay reservas registradas.</p>';
      return;
    }

    const lugaresCreados = JSON.parse(localStorage.getItem('lugares')) || [];
    const todosLosLugares = [...lugaresPorDefecto, ...lugaresCreados];

    const lista = document.createElement('ul');
    lista.style.listStyle = 'none';
    lista.style.padding   = '0';

    todasLasReservas.forEach((reserva, idx) => {
      const lugar = todosLosLugares.find(l => l.id === reserva.lugarId);
      const nombreLugar = lugar ? lugar.nombre : '—';

      const item = document.createElement('li');
      item.innerHTML = `
        <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:6px;">
          <strong>Usuario:</strong> ${reserva.usuarioEmail}<br>
          <strong>Lugar:</strong>  ${nombreLugar}<br>
          <strong>Fecha:</strong>  ${reserva.fecha}<br>
          <strong>Hora:</strong>   ${reserva.hora}<br>
          <strong>Precio:</strong> ${reserva.precio}<br>
          <button onclick="eliminarReserva('${reserva.usuarioEmail}', ${idx})"
                  style="margin-top:5px;background-color:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:5px;">
            Eliminar
          </button>
        </div>
      `;
      lista.appendChild(item);
    });

    contenidoAdmin.appendChild(lista);
  }

window.eliminarReserva = function(email, index) {
  const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
  const reservasGlobal = JSON.parse(localStorage.getItem('reservas')) || [];
  let lugares = JSON.parse(localStorage.getItem('lugares')) || [];
  let lugaresPorDefecto = JSON.parse(localStorage.getItem('lugaresPorDefecto')) || [];

  if (reservasPorUsuario[email] && reservasPorUsuario[email][index]) {
    if (confirm("¿Estás seguro de eliminar esta reserva?")) {
      const reservaEliminada = reservasPorUsuario[email][index];
      const lugarId = reservaEliminada.lugarId;

      reservasPorUsuario[email].splice(index, 1);
      if (reservasPorUsuario[email].length === 0) {
        delete reservasPorUsuario[email];
      }
      localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));

      const nuevasGlobal = reservasGlobal.filter(r =>
        !(r.usuarioEmail === email && r.lugarId === lugarId && r.fecha === reservaEliminada.fecha && r.hora === reservaEliminada.hora)
      );
      localStorage.setItem('reservas', JSON.stringify(nuevasGlobal));

      const hayMasReservas = nuevasGlobal.some(r => r.lugarId === lugarId);
      if (!hayMasReservas) {
        const actualizarEstado = (lista) => {
          const i = lista.findIndex(l => l.id === lugarId);
          if (i !== -1) lista[i].disponible = true;
        };
        actualizarEstado(lugares);
        actualizarEstado(lugaresPorDefecto);
        localStorage.setItem('lugares', JSON.stringify(lugares));
        localStorage.setItem('lugaresPorDefecto', JSON.stringify(lugaresPorDefecto));
      }

      mostrarTodasLasReservas();
    }
  }
};

  function mostrarUsuariosRegistrados() {
    contenidoAdmin.innerHTML = '<h2>Usuarios registrados</h2>';
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (!usuarios.length) {
      contenidoAdmin.innerHTML += '<p>No hay usuarios registrados.</p>';
      return;
    }

    const tabla = document.createElement('table');
    tabla.style.width = '100%';
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Nombre</th><th>Email</th><th>Rol</th><th>Acción</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios.map((u,i) => `
          <tr>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.rol || 'usuario'}</td>
            <td>
              ${u.rol !== 'admin'
                ? `<button onclick="eliminarUsuario(${i})" class="eliminar-btn">Eliminar</button>`
                : '—'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    contenidoAdmin.appendChild(tabla);
  }

  window.eliminarUsuario = index => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (confirm("¿Eliminar este usuario?")) {
      usuarios.splice(index,1);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      mostrarUsuariosRegistrados();
    }
  };

});