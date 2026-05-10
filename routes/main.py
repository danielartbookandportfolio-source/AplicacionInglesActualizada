from flask import Blueprint
from flask import render_template
from flask import session
from flask import redirect
from flask import url_for

main = Blueprint("main", __name__)


# =========================
# INDEX
# =========================
@main.route("/")
def home():

    return render_template("index.html")


# =========================
# ABOUT
# =========================
@main.route("/about")
def about():

    return render_template("about.html")


# =========================
# REGISTER
# =========================
@main.route("/register")
def register():

    return render_template(
        "register.html"
    )

# =========================
# LOGIN
# =========================
@main.route("/login")
def login():

    return render_template(
        "login.html"
    )

# =========================
# DUAL WORDS
# =========================
@main.route("/dualwords")
def dualwords():
    return render_template("dualwords.html")




# =========================
# PERFIL
# =========================
@main.route("/perfil")
def perfil():

    # Verificar sesion
    if "usuario" not in session:

        return redirect(
            url_for("main.contacto")
        )

    nombre = session["usuario"]

    return render_template(
        "perfil.html",
        nombre=nombre
    )