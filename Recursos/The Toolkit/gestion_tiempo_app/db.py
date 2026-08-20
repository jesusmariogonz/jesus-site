"""
Capa de acceso a datos (SQLite) para la app "Gestión del Tiempo con Datos".
Toda la persistencia vive en un único archivo: gestion_tiempo.db
"""
import sqlite3
import hashlib
import os
import sys
import datetime

def _base_dir():
    """Carpeta donde vive el .exe / script, para que el .db quede junto a él."""
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

DB_PATH = os.path.join(_base_dir(), "gestion_tiempo.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # Bandeja de captura GTD + priorización Eisenhower/MoSCoW
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            eisenhower TEXT,            -- 'urgente_importante', 'no_urgente_importante',
                                         -- 'urgente_no_importante', 'no_urgente_no_importante'
            moscow TEXT,                -- 'Must', 'Should', 'Could', 'Wont'
            status TEXT DEFAULT 'pendiente',   -- pendiente / hecho / descartado
            external_id TEXT,           -- id estable del origen externo (p. ej. EntryID de Outlook)
            source_type TEXT DEFAULT 'Manual',  -- 'Manual', 'Correo', 'Sesión'
            description TEXT,           -- detalle adicional (p. ej. remitente/hora de un correo o sesión)
            kanban_stage TEXT DEFAULT 'Backlog',  -- 'Backlog','Esta semana','En progreso','Bloqueado','Terminado' (Cap. 12)
            created_at TEXT NOT NULL,
            done_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Migración suave: si la tabla ya existía sin estas columnas, agrégalas.
    existing_cols = [row["name"] for row in cur.execute("PRAGMA table_info(tasks)").fetchall()]
    if "external_id" not in existing_cols:
        cur.execute("ALTER TABLE tasks ADD COLUMN external_id TEXT")
    if "source_type" not in existing_cols:
        cur.execute("ALTER TABLE tasks ADD COLUMN source_type TEXT DEFAULT 'Manual'")
    if "description" not in existing_cols:
        cur.execute("ALTER TABLE tasks ADD COLUMN description TEXT")
    if "kanban_stage" not in existing_cols:
        cur.execute("ALTER TABLE tasks ADD COLUMN kanban_stage TEXT DEFAULT 'Backlog'")

    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_tasks_external_id ON tasks(user_id, external_id)
    """)

    # Bloques de tiempo (time blocking) con categoría
    cur.execute("""
        CREATE TABLE IF NOT EXISTS time_blocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            task_id INTEGER,
            category TEXT NOT NULL,
            title TEXT,
            date TEXT NOT NULL,         -- YYYY-MM-DD
            start_time TEXT NOT NULL,   -- HH:MM
            end_time TEXT NOT NULL,     -- HH:MM
            duration_minutes REAL NOT NULL,
            source TEXT DEFAULT 'manual',  -- 'manual' o 'pomodoro'
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(task_id) REFERENCES tasks(id)
        )
    """)

    # Revisiones periódicas guiadas
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            review_date TEXT NOT NULL,
            q1 TEXT, q2 TEXT, q3 TEXT, q4 TEXT, q5 TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Configuración por usuario (API key de Anthropic para la pestaña de IA, tema visual,
    # y credenciales de Microsoft Graph para importar sesiones de calendario sin COM)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_settings (
            user_id INTEGER PRIMARY KEY,
            anthropic_api_key TEXT,
            theme TEXT DEFAULT 'dark',
            ms_client_id TEXT,
            ms_token_cache TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    existing_settings_cols = [row["name"] for row in cur.execute("PRAGMA table_info(user_settings)").fetchall()]
    if "theme" not in existing_settings_cols:
        cur.execute("ALTER TABLE user_settings ADD COLUMN theme TEXT DEFAULT 'dark'")
    if "ms_client_id" not in existing_settings_cols:
        cur.execute("ALTER TABLE user_settings ADD COLUMN ms_client_id TEXT")
    if "ms_token_cache" not in existing_settings_cols:
        cur.execute("ALTER TABLE user_settings ADD COLUMN ms_token_cache TEXT")

    conn.commit()
    conn.close()


# ---------- Usuarios ----------

def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def create_user(username: str, password: str):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
            (username.strip(), _hash_password(password), datetime.datetime.now().isoformat()),
        )
        conn.commit()
        return True, "Usuario creado correctamente."
    except sqlite3.IntegrityError:
        return False, "Ese nombre de usuario ya existe."
    finally:
        conn.close()


def verify_user(username: str, password: str):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username.strip(),)
    ).fetchone()
    conn.close()
    if row is None:
        return None
    if row["password_hash"] == _hash_password(password):
        return dict(row)
    return None


# ---------- Tareas (Inbox / Eisenhower / MoSCoW) ----------

def add_task(user_id, title, category="General", external_id=None, source_type="Manual", description=None):
    conn = get_connection()
    conn.execute(
        """INSERT INTO tasks (user_id, title, category, status, external_id, source_type, description, created_at)
           VALUES (?, ?, ?, 'pendiente', ?, ?, ?, ?)""",
        (user_id, title.strip(), category.strip() or "General", external_id, source_type,
         description, datetime.datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()


def get_existing_external_ids(user_id):
    """Devuelve el conjunto de external_id ya presentes para este usuario (para deduplicar importaciones)."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT external_id FROM tasks WHERE user_id=? AND external_id IS NOT NULL",
        (user_id,),
    ).fetchall()
    conn.close()
    return {r["external_id"] for r in rows}


def get_tasks(user_id, status=None):
    conn = get_connection()
    if status:
        rows = conn.execute(
            "SELECT * FROM tasks WHERE user_id=? AND status=? ORDER BY created_at DESC",
            (user_id, status),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM tasks WHERE user_id=? ORDER BY created_at DESC", (user_id,)
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def update_task_priority(task_id, eisenhower=None, moscow=None):
    conn = get_connection()
    if eisenhower is not None:
        conn.execute("UPDATE tasks SET eisenhower=? WHERE id=?", (eisenhower, task_id))
    if moscow is not None:
        conn.execute("UPDATE tasks SET moscow=? WHERE id=?", (moscow, task_id))
    conn.commit()
    conn.close()


def set_kanban_stage(task_id, stage):
    conn = get_connection()
    conn.execute("UPDATE tasks SET kanban_stage=? WHERE id=?", (stage, task_id))
    conn.commit()
    conn.close()


def set_task_status(task_id, status):
    conn = get_connection()
    done_at = datetime.datetime.now().isoformat() if status == "hecho" else None
    conn.execute("UPDATE tasks SET status=?, done_at=? WHERE id=?", (status, done_at, task_id))
    conn.commit()
    conn.close()


def get_task(task_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def update_task_fields(task_id, title=None, category=None, status=None, description=None):
    """Edición manual de una tarea ya capturada (nombre, categoría, estado, descripción)."""
    fields = []
    values = []

    if title is not None:
        fields.append("title=?")
        values.append(title.strip())
    if category is not None:
        fields.append("category=?")
        values.append(category.strip() or "General")
    if description is not None:
        fields.append("description=?")
        values.append(description.strip())
    if status is not None:
        fields.append("status=?")
        values.append(status)
        fields.append("done_at=?")
        values.append(datetime.datetime.now().isoformat() if status == "hecho" else None)

    if not fields:
        return

    values.append(task_id)
    conn = get_connection()
    conn.execute(f"UPDATE tasks SET {', '.join(fields)} WHERE id=?", values)
    conn.commit()
    conn.close()


def delete_task(task_id):
    conn = get_connection()
    # Si algún bloque de tiempo quedó vinculado a esta tarea, se desvincula primero
    # (el bloque de tiempo en sí se conserva; solo se rompe la referencia).
    conn.execute("UPDATE time_blocks SET task_id=NULL WHERE task_id=?", (task_id,))
    conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    conn.close()


def delete_all_tasks(user_id):
    conn = get_connection()
    conn.execute("UPDATE time_blocks SET task_id=NULL WHERE user_id=?", (user_id,))
    conn.execute("DELETE FROM tasks WHERE user_id=?", (user_id,))
    conn.commit()
    conn.close()


# ---------- Time blocking ----------

def add_time_block(user_id, category, title, date, start_time, end_time, duration_minutes,
                    task_id=None, source="manual"):
    conn = get_connection()
    conn.execute(
        """INSERT INTO time_blocks
           (user_id, task_id, category, title, date, start_time, end_time, duration_minutes, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, task_id, category.strip() or "General", title, date, start_time, end_time,
         duration_minutes, source),
    )
    conn.commit()
    conn.close()


def get_time_blocks(user_id, limit=None):
    conn = get_connection()
    q = "SELECT * FROM time_blocks WHERE user_id=? ORDER BY date DESC, start_time DESC"
    if limit:
        q += f" LIMIT {int(limit)}"
    rows = conn.execute(q, (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def delete_time_block(block_id):
    conn = get_connection()
    conn.execute("DELETE FROM time_blocks WHERE id=?", (block_id,))
    conn.commit()
    conn.close()


# ---------- Revisiones ----------

def add_review(user_id, review_date, answers: dict):
    conn = get_connection()
    conn.execute(
        """INSERT INTO reviews (user_id, review_date, q1, q2, q3, q4, q5)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (user_id, review_date, answers.get("q1", ""), answers.get("q2", ""),
         answers.get("q3", ""), answers.get("q4", ""), answers.get("q5", "")),
    )
    conn.commit()
    conn.close()


def get_reviews(user_id):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM reviews WHERE user_id=? ORDER BY review_date DESC", (user_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_review(review_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM reviews WHERE id=?", (review_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


# ---------- Configuración por usuario (API key de IA) ----------

def save_api_key(user_id, api_key):
    conn = get_connection()
    conn.execute(
        """INSERT INTO user_settings (user_id, anthropic_api_key) VALUES (?, ?)
           ON CONFLICT(user_id) DO UPDATE SET anthropic_api_key = excluded.anthropic_api_key""",
        (user_id, api_key.strip()),
    )
    conn.commit()
    conn.close()


def get_api_key(user_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT anthropic_api_key FROM user_settings WHERE user_id=?", (user_id,)
    ).fetchone()
    conn.close()
    if row is None:
        return None
    return row["anthropic_api_key"] or None


def save_theme(user_id, theme):
    conn = get_connection()
    conn.execute(
        """INSERT INTO user_settings (user_id, theme) VALUES (?, ?)
           ON CONFLICT(user_id) DO UPDATE SET theme = excluded.theme""",
        (user_id, theme),
    )
    conn.commit()
    conn.close()


def get_theme(user_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT theme FROM user_settings WHERE user_id=?", (user_id,)
    ).fetchone()
    conn.close()
    if row is None or not row["theme"]:
        return "dark"
    return row["theme"]


# ---------- Microsoft Graph (para importar sesiones de calendario) ----------

def save_ms_client_id(user_id, client_id):
    conn = get_connection()
    conn.execute(
        """INSERT INTO user_settings (user_id, ms_client_id) VALUES (?, ?)
           ON CONFLICT(user_id) DO UPDATE SET ms_client_id = excluded.ms_client_id""",
        (user_id, client_id.strip()),
    )
    conn.commit()
    conn.close()


def get_ms_client_id(user_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT ms_client_id FROM user_settings WHERE user_id=?", (user_id,)
    ).fetchone()
    conn.close()
    return row["ms_client_id"] if row and row["ms_client_id"] else None


def save_ms_token_cache(user_id, cache_str):
    conn = get_connection()
    conn.execute(
        """INSERT INTO user_settings (user_id, ms_token_cache) VALUES (?, ?)
           ON CONFLICT(user_id) DO UPDATE SET ms_token_cache = excluded.ms_token_cache""",
        (user_id, cache_str),
    )
    conn.commit()
    conn.close()


def get_ms_token_cache(user_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT ms_token_cache FROM user_settings WHERE user_id=?", (user_id,)
    ).fetchone()
    conn.close()
    return row["ms_token_cache"] if row and row["ms_token_cache"] else None


def clear_ms_connection(user_id):
    conn = get_connection()
    conn.execute(
        "UPDATE user_settings SET ms_token_cache=NULL WHERE user_id=?", (user_id,)
    )
    conn.commit()
    conn.close()
