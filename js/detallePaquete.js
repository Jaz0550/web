document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paqueteId = urlParams.get("paqueteId");

    if (!paqueteId) {
        alert("No se especificó un paquete válido.");
        return;
    }

    fetch(`http://localhost:3000/paquetes/${paqueteId}`)
        .then(response => response.json())
        .then(paquete => {
            console.log("Ruta de imagen recibida:", paquete.imagen);

            const detalleContainer = document.getElementById("detalle-paquete");
            detalleContainer.innerHTML = `
                <img src="${paquete.imagen}" alt="${paquete.nombre}" class="detalle-img">
                <h2>${paquete.nombre}</h2>
                <p>${paquete.descripcion}</p>
                <p>Precio: ${paquete.precio} $</p>
                <p>Disponibles: ${paquete.cantidad_disponible}</p>
            `;
        })
        .catch(error => {
            console.error("Error al cargar el paquete:", error);
            alert("No se pudo cargar el detalle del paquete.");
        });
});

////
document.getElementById("confirmar-reserva").addEventListener("click", () => {
    const cantidad = parseInt(document.getElementById("cantidad").value, 10);

    if (cantidad <= 0 || isNaN(cantidad)) {
        alert("Por favor, selecciona una cantidad válida.");
        return;
    }

    const idformu = localStorage.getItem("idformu");
    const nombre = localStorage.getItem("nombre");
    const apellido = localStorage.getItem("apellido");
    const urlParams = new URLSearchParams(window.location.search);
    const paqueteId = urlParams.get("paqueteId");

    if (!idformu) {
        alert("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
        return;
    }

    // Paso 1: Actualizar cantidad disponible en `paquetes`
    fetch("http://localhost:3000/reservarPaquete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            paqueteId: paqueteId,
            cantidadSeleccionada: cantidad
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(error => { throw new Error(error); });
        }
        return response.text();
    })
    .then(() => {
        // Paso 2: Registrar reserva en `agendar`
        return fetch("http://localhost:3000/registrarReserva", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idformu: idformu,
                nombre: nombre,
                apellido: apellido,
                paqueteId: paqueteId,
                cantSeleccionada: cantidad
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(error => { throw new Error(error); });
        }
        return response.text();
    })
    .then(() => {
        alert("Reserva registrada exitosamente.");
        window.location.href = "http://127.0.0.1:3000/public/menu.html"; // Redirigir a una página de confirmación
    })
    .catch(error => {
        console.error("Error:", error);
        alert(`Ocurrió un problema: ${error.message}`);
    });
});
