document.addEventListener("DOMContentLoaded", async () => {
    const citasContainer = document.getElementById("citas-container");
    const noCitasMessage = document.getElementById("no-citas-message");
  
    const id = localStorage.getItem("idformu");
    const nombre = localStorage.getItem("nombre");
    const apellido = localStorage.getItem("apellido");
  
    if (!id || !nombre || !apellido) {
        noCitasMessage.style.display = "block";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/citas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idformu: id, nombre, apellido }),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.length > 0) {
            data.forEach((cita) => {
                const citaElement = document.createElement("div");
                citaElement.className = "cita";
                citaElement.innerHTML = `
                    <p><strong>Etiqueta Clave #</strong> ${cita.id}</p>
                    <p><strong>Paquete:</strong> ${cita.paquete}</p>
                    <p><strong>Cantidad seleccionada:</strong> ${cita.cant_seleccionada}</p>
                    <button class="btn-aceptar" data-id="${cita.id}">Aceptar</button>
                    <button class="btn-eliminar" data-id="${cita.id}">Eliminar</button>
                `;

                citasContainer.appendChild(citaElement);
            });

            // Eventos para los botones
            document.querySelectorAll(".btn-aceptar").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const id = e.target.dataset.id;
                    alert("Compra exitosa para el paquete con ID " + id);
                });
            });

            document.querySelectorAll(".btn-eliminar").forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.dataset.id;
                    try {
                        const response = await fetch(`http://localhost:3000/api/eliminar`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ id }),
                        });

                        if (!response.ok) {
                            throw new Error("Error al eliminar la cita.");
                        }

                        alert("Paquete eliminado con éxito.");
                        e.target.closest(".cita").remove(); // Eliminar del DOM.
                    } catch (error) {
                        console.error("Error al eliminar el paquete:", error);
                        alert("No se pudo eliminar el paquete.");
                    }
                });
            });
        } else {
            noCitasMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        noCitasMessage.style.display = "block";
    }
});