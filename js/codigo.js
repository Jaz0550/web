function validarFormulario() {
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    // Realizar la solicitud POST al backend
    fetch("http://localhost:3000/guardar", { //localhost:3000 es el servidor local 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombres: nombres,
            apellidos: apellidos,
            correo: correo,
            contrasena: contrasena
        })
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Mostrar mensaje de éxito o error
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al enviar los datos");
    });
}

function mostrarMenu() {
    fetch("http://localhost:3000/paquetes")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("paquetes-container");
            container.innerHTML = ""; // Limpiar el contenedor antes de mostrar el menú

            data.forEach(paquete => {
                // Verificar si 'paquete.imagen' ya contiene la ruta completa
                const imagenSrc = paquete.imagen.startsWith("/images/") 
                    ? paquete.imagen 
                    : `/images/${paquete.imagen}`;

                // Crear un elemento para cada paquete
                const paqueteElement = document.createElement("div");
                paqueteElement.classList.add("paquete");
                paqueteElement.innerHTML = `
                    <img src="${imagenSrc}" alt="${paquete.nombre}" class="paquete-img">
                    <h2>${paquete.nombre}</h2>
                    <p>${paquete.precio} $</p>
                    <p>${paquete.descripcion}</p>
                    <p>Disponibles: ${paquete.cantidad_disponible}</p>
                    <button onclick="reservarPaquete(${paquete.id})">Reservar</button>
                `;
                container.appendChild(paqueteElement);
            });
        })
        .catch(error => {
            console.error("Error al obtener los paquetes:", error);
        });
}


function reservarPaquete(paqueteId) {
    // Redirige a la página de detalles del paquete, pasando el ID como parámetro en la URL
    window.location.href = `detalle_paquete.html?paqueteId=${paqueteId}`; 

    // Aquí puedes definir la funcionalidad para reservar un paquete
   // alert(`Paquete ${paqueteId} reservado (funcionalidad aún por implementar)`);
}