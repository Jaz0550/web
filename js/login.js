function iniciarSesion() {
    const usuarioID = document.getElementById("usuario_id").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;

    // Validar si todos los campos están llenos
    if (!usuarioID || !nombre || !apellido) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Enviar datos al servidor para validar
    fetch("http://localhost:3000/validarUsuario", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: usuarioID, nombre, apellido })
    })
    .then(response => response.json())
    .then(data => {
        if (data.existe) {
            const usuario = data.usuario;

            // Guardar ID y datos del usuario en localStorage
            localStorage.setItem("idformu", usuario.idformu);
            localStorage.setItem("nombre", usuario.nombre);
            localStorage.setItem("apellido", usuario.apellido);

            alert(`Bienvenido, ${usuario.nombre} ${usuario.apellido}`);
            
            // Redirigir al menú
            window.location.href = "http://127.0.0.1:3000/public/menu.html";
        } else {
            alert("Los datos ingresados no coinciden con ningún usuario.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al verificar los datos.");
    });
}