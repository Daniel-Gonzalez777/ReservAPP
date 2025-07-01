const reserva = {
    nombre: "Sala Ejecutiva Medellín",
    direccion: "Cra. 43A #1A Sur-188, Medellín",
    fecha: "2025-07-01",
    hora: "14:00",
    precio: "80.000",
    imagen: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    descripcion: "Espacio moderno con aire acondicionado, pantalla de proyección y capacidad para 12 personas. Perfecta para reuniones ejecutivas."
};

    // 🧠 Inyectar los datos al DOM
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imagen-lugar').src = reserva.imagen;
    document.getElementById('nombre-lugar').textContent = reserva.nombre;
    document.getElementById('direccion').textContent = reserva.direccion;
    document.getElementById('fecha').textContent = reserva.fecha;
    document.getElementById('hora').textContent = reserva.hora;
    document.getElementById('precio').textContent = reserva.precio;
    document.getElementById('descripcion').textContent = reserva.descripcion;

    document.getElementById('volver').addEventListener('click', () => {
    window.location.href = '../templates/inicio.html'; // Ajusta si está en otro directorio
    });
});