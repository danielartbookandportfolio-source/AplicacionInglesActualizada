import sqlite3
import os

os.makedirs("data", exist_ok=True)

def get_db():
    return sqlite3.connect("data/data.db")


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        contrasenia TEXT,
        xp INTEGER DEFAULT 0
    )
    """)

    conn.commit()
    conn.close()