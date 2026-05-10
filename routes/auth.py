from flask import Blueprint
from flask import request
from flask import redirect
from flask import url_for
from flask import session

from db import get_db

# =========================
# BLUEPRINT
# =========================
auth = Blueprint("auth", __name__)


# =========================
# LOGIN
# =========================
@auth.route("/login", methods=["POST"])
def login():

    # Obtener datos del formulario
    nombre = request.form.get("nombre")
    contrasenia = request.form.get("contrasenia")

    # Validar campos
    if not nombre or not contrasenia:

        return "Faltan datos"

    # Conexion DB
    conn = get_db()
    cursor = conn.cursor()

    # Buscar usuario
    cursor.execute(
        """
        SELECT *
        FROM usuarios
        WHERE nombre = ?
        AND contrasenia = ?
        """,
        (nombre, contrasenia)
    )

    user = cursor.fetchone()

    conn.close()

    # Usuario valido
    if user:

        # Guardar sesion
        session["usuario"] = nombre

        # Ir al perfil
        return redirect(
            url_for("main.perfil")
        )

    # Error login
    return "Usuario o contrasenia incorrectos"


# =========================
# REGISTRO
# =========================
@auth.route("/registro", methods=["POST"])
def registro():

    # Obtener datos
    nombre = request.form.get("nombre")
    contrasenia = request.form.get("contrasenia")

    # Validar campos
    if not nombre or not contrasenia:

        return "Faltan datos"

    # Conexion DB
    conn = get_db()
    cursor = conn.cursor()

    # Verificar usuario existente
    cursor.execute(
        """
        SELECT id
        FROM usuarios
        WHERE nombre = ?
        """,
        (nombre,)
    )

    existe = cursor.fetchone()

    # Usuario existe
    if existe:

        conn.close()

        return "El usuario ya existe"

    # Crear usuario
    cursor.execute(
        """
        INSERT INTO usuarios
        (
            nombre,
            contrasenia
        )
        VALUES
        (
            ?,
            ?
        )
        """,
        (nombre, contrasenia)
    )

    conn.commit()
    conn.close()

    # Crear sesion
    session["usuario"] = nombre

    # Ir al perfil
    return redirect(
        url_for("main.perfil")
    )


# =========================
# LOGOUT
# =========================
@auth.route("/logout")
def logout():

    # Limpiar sesion
    session.clear()

    # Volver al inicio
    return redirect(
        url_for("main.home")
    )