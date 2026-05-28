const login = () => { 
    const usuario = document.getElementById("usuario").value
    const contrasena = document.getElementById("contrasena").value
    fetch("http://localhost:8080/login?usuario=" + usuario + "&contrasena=" + contrasena)
    .then(response => response.json())
    .then(data => {
        if (data.status == "error") {
            document.getElementById("resultado").innerHTML = "<b class='text-danger'>" + data.message + "</b>"
            return false
        }else{
            location.href = "/principal"
        }

        console.log(data)

    })
}

document.getElementById("btnEnviar").addEventListener("click", login)