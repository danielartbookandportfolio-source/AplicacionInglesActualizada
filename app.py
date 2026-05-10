from flask import Flask
from db import init_db

app = Flask(__name__)
app.secret_key = "mi_clave_secreta"

init_db()

from routes.main import main
from routes.auth import auth

app.register_blueprint(main)
app.register_blueprint(auth)

if __name__ == "__main__":
    app.run(debug=True)