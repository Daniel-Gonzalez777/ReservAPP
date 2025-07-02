const lugar = JSON.parse(localStorage.getItem('lugarSeleccionado'));
    const infoDiv = document.getElementById('infoLugar');
    if (lugar) {
      infoDiv.innerHTML = `
        <h2>${lugar.icono} ${lugar.nombre}</h2>
        <p><strong>Descripción:</strong> ${lugar.descripcion}</p>
        <p><strong>Precio:</strong> ${lugar.precio}</p>
        <p><strong>Capacidad:</strong> ${lugar.capacidad}</p>
      `;
    }

    document.getElementById('formReserva').addEventListener('submit', function(e) {
      e.preventDefault();

      const reserva = {
        nombre: lugar.nombre,
        icono: lugar.icono,
        direccion: lugar.direccion || 'N/A',
        precio: lugar.precio,
        descripcion: lugar.descripcion,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value
      };

      const historial = JSON.parse(localStorage.getItem('historialReservas')) || [];
      historial.push(reserva);
      localStorage.setItem('historialReservas', JSON.stringify(historial));

      alert('Reserva confirmada');
      window.location.href = '/templates/inicio.html'; // Redirige al inicio
    });