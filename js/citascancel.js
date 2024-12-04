document.addEventListener("DOMContentLoaded", async () => {
    const citasContainer = document.getElementById("citasCanceladas"); // Asegúrate de que este ID esté en tu HTML

    try {
        const response = await fetch("http://localhost:3000/api/citas-canceladas");
        if (!response.ok) {
            throw new Error("Error al obtener las citas canceladas.");
        }

        const citas = await response.json();

        // Limpiar el contenedor
        citasContainer.innerHTML = "";

        if (citas.length > 0) {
            citas.forEach((cita) => {
                // Crear el contenedor para cada cita
                const citaElement = document.createElement("div");
                citaElement.className = "cita";

                // Agregar contenido HTML
                citaElement.innerHTML = `
                    <p><strong>Etiqueta Clave:</strong> ${cita.id}</p>
                    <p><strong>Nombre:</strong> ${cita.nombre}</p>
                    <p><strong>Apellido:</strong> ${cita.apellido}</p>
                    <p><strong>Paquete:</strong> ${cita.paquete}</p>
                    <p><strong>Cantidad Seleccionada:</strong> ${cita.cant_seleccionada}</p>
                    <p><strong>Fecha Cancelación:</strong> ${cita.fecha_cancelacion}</p>
                `;

                // Añadir el elemento al contenedor principal
                citasContainer.appendChild(citaElement);
            });
        } else {
            // Mensaje si no hay citas canceladas
            citasContainer.innerHTML = "<p>No hay citas canceladas para mostrar.</p>";
        }
    } catch (error) {
        console.error("Error al cargar las citas canceladas:", error);
        citasContainer.innerHTML = "<p>Error al cargar las citas canceladas.</p>";
    }
});