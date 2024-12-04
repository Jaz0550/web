function registrarUsuario() {
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    fetch("http://localhost:3000/guardar", {
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
        alert(data); // Mensaje de éxito o error
        // Redirigir al login después del registro
        window.location.href = "http://127.0.0.1:3000/public/index.html"; 
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al registrar el usuario");
    });
}