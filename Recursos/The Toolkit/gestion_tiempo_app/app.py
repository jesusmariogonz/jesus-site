"""
Gestión del Tiempo con Datos — Prueba de concepto
Autor de la app: prototipo generado a partir del libro "Gestión del Tiempo con Datos"
                  de Jesús Mario González Siller.

Cómo correrlo:
    python app.py

Requisitos:
    pip install matplotlib

Empaquetado a .exe (Windows):
    pip install pyinstaller
    pyinstaller --onefile --windowed --name GestionDelTiempo app.py
"""
import tkinter as tk
from tkinter import ttk, messagebox
import datetime
import calendar as cal_module
import webbrowser
import sys

import db
import outlook_integration as outlook
import ai_integration as ai
import graph_integration as msgraph


def _enable_windows_dpi_awareness():
    """
    En Windows, sin avisarle al sistema que la app maneja su propio DPI, Windows
    'estira' la ventana completa como si fuera una imagen cuando la pantalla tiene
    escalado (125%, 150%, etc.) — esto deja el texto pequeño (como los botones)
    borroso o con apariencia de estar cortado. Esto lo corrige, marcando el proceso
    como "DPI aware" antes de crear cualquier ventana.
    """
    if sys.platform != "win32":
        return
    try:
        import ctypes
        try:
            # Windows 8.1+: PROCESS_PER_MONITOR_DPI_AWARE
            ctypes.windll.shcore.SetProcessDpiAwareness(1)
        except Exception:
            # Versiones más viejas de Windows
            ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass


_enable_windows_dpi_awareness()

try:
    from matplotlib.figure import Figure
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    MATPLOTLIB_OK = True
except ImportError:
    MATPLOTLIB_OK = False

APP_TITLE = "Gestión del Tiempo con Datos"

# Versionamiento semántico (SemVer: MAYOR.MENOR.PARCHE — ver https://semver.org/lang/es/)
# MAYOR: cambios que rompen compatibilidad de datos/flujos existentes.
# MENOR: funcionalidad nueva compatible con lo anterior (p. ej. Kanban, IA, Graph).
# PARCHE: correcciones de errores sin funcionalidad nueva.
APP_VERSION = "1.0.0"
AUTHOR_NAME = "Jesús Mario González Siller"
AUTHOR_ROLE = "Data, Analytics & AI Solutions Architect · FEMSA Proximidad y Salud"
AUTHOR_URL = "https://jgonzalez.app"
AUTHOR_BIO = (
    "Arquitecto de Soluciones Analíticas y responsable de producto de Data & Analytics, "
    "desde Saltillo, Coahuila. Escribe sobre ingeniería de datos, Snowflake, Databricks, "
    "arquitectura e IA aplicada.\n\n"
    "Esta aplicación está basada en su libro "
    "\"Gestión del Tiempo con Datos: Estrategia para optimizar tu productividad\"."
)
AUTHOR_COPYRIGHT = f"© {datetime.datetime.now().year} {AUTHOR_NAME}. Todos los derechos reservados."

# ----------------------------------------------------------------------------
# Paleta de colores tomada de jgonzalez.app (fondo azul marino, acentos cyan/verde)
# Se soportan dos modos (oscuro/claro); las variables COLOR_* de abajo se
# reasignan dinámicamente al hacer toggle con set_palette().
# ----------------------------------------------------------------------------
PALETTES = {
    "dark": {
        "COLOR_BG": "#0b1220",          # fondo principal (theme-color del sitio)
        "COLOR_BG_PANEL": "#111a2e",    # paneles / tarjetas
        "COLOR_BG_INPUT": "#1a2740",    # campos de entrada
        "COLOR_BG_INPUT_FOCUS": "#20304f",
        "COLOR_BORDER": "#233252",
        "COLOR_TEXT": "#e6edf5",
        "COLOR_TEXT_MUTED": "#8fa1bd",
        "COLOR_ACCENT": "#38bdf8",      # cyan / sky
        "COLOR_ACCENT_DARK": "#0ea5c9",
        "COLOR_ACCENT2": "#34d399",     # verde
        "COLOR_DANGER": "#f87171",
        "COLOR_SELECT_BG": "#16324f",
    },
    "light": {
        "COLOR_BG": "#f5f7fb",
        "COLOR_BG_PANEL": "#ffffff",
        "COLOR_BG_INPUT": "#eef1f8",
        "COLOR_BG_INPUT_FOCUS": "#e2e8f4",
        "COLOR_BORDER": "#d7deea",
        "COLOR_TEXT": "#0b1220",
        "COLOR_TEXT_MUTED": "#5b6b85",
        "COLOR_ACCENT": "#0284c7",      # cyan más oscuro para contraste en blanco
        "COLOR_ACCENT_DARK": "#036592",
        "COLOR_ACCENT2": "#059669",     # verde más oscuro
        "COLOR_DANGER": "#dc2626",
        "COLOR_SELECT_BG": "#cfe8f7",
    },
}

CURRENT_THEME = "dark"


def set_palette(mode):
    """Reasigna las variables globales COLOR_* a la paleta del modo indicado ('dark'/'light')."""
    global CURRENT_THEME
    CURRENT_THEME = mode
    globals().update(PALETTES[mode])


# Valores iniciales (modo oscuro por defecto)
set_palette("dark")
CATEGORIES_DEFAULT = ["Trabajo profundo", "Reuniones", "Administrativo",
                       "Personal", "Descanso", "Aprendizaje"]

# Categorías de la Bandeja de captura: reflejan únicamente el origen de la actividad.
TASK_CATEGORIES = ["Manual", "Correo", "Sesión"]

# Columnas del tablero Kanban personal (Capítulo 12 y Apéndice D del libro)
KANBAN_STAGES = ["Backlog", "Esta semana", "En progreso", "Bloqueado", "Terminado"]
KANBAN_WIP_LIMIT = 3  # límite de trabajo en curso recomendado para "En progreso"

EISENHOWER_LABELS = {
    "urgente_importante": "Urgente + Importante (Hacer ahora)",
    "no_urgente_importante": "No urgente + Importante (Planificar)",
    "urgente_no_importante": "Urgente + No importante (Delegar)",
    "no_urgente_no_importante": "No urgente + No importante (Eliminar)",
}

MOSCOW_LABELS = {
    "Must": "Must (Debo hacer)",
    "Should": "Should (Debería hacer)",
    "Could": "Could (Podría hacer)",
    "Wont": "Won't (No lo haré ahora)",
}

REVIEW_QUESTIONS = [
    ("q1", "¿Cuál fue tu principal logro esta semana?"),
    ("q2", "¿En qué actividades sientes que perdiste más tiempo?"),
    ("q3", "¿Qué tareas importantes (no urgentes) postergaste?"),
    ("q4", "¿Qué ajuste concreto harás la próxima semana?"),
    ("q5", "¿Qué te impidió, en la práctica, sostener tu sistema con consistencia?"),
]


# ----------------------------------------------------------------------------
# Tema oscuro (paleta de jgonzalez.app)
# ----------------------------------------------------------------------------
def apply_theme_styles(root):
    style = ttk.Style(root)
    style.theme_use("clam")

    root.configure(bg=COLOR_BG)

    style.configure(".", background=COLOR_BG, foreground=COLOR_TEXT,
                     fieldbackground=COLOR_BG_INPUT, bordercolor=COLOR_BORDER,
                     font=("Segoe UI", 10))

    style.configure("TFrame", background=COLOR_BG)
    style.configure("Panel.TFrame", background=COLOR_BG_PANEL)

    style.configure("TLabel", background=COLOR_BG, foreground=COLOR_TEXT)
    style.configure("Muted.TLabel", background=COLOR_BG, foreground=COLOR_TEXT_MUTED)
    style.configure("Title.TLabel", background=COLOR_BG, foreground=COLOR_ACCENT,
                     font=("Segoe UI", 16, "bold"))
    style.configure("Heading.TLabel", background=COLOR_BG, foreground=COLOR_TEXT,
                     font=("Segoe UI", 12, "bold"))

    style.configure("TButton", background=COLOR_ACCENT, foreground="#04121c",
                     borderwidth=0, focusthickness=0, padding=(12, 7), relief="flat",
                     lightcolor=COLOR_ACCENT, darkcolor=COLOR_ACCENT, bordercolor=COLOR_ACCENT,
                     focuscolor=COLOR_ACCENT, font=("Segoe UI", 10, "bold"))
    style.map("TButton",
              background=[("active", COLOR_ACCENT_DARK), ("disabled", COLOR_BORDER)],
              lightcolor=[("active", COLOR_ACCENT_DARK), ("disabled", COLOR_BORDER)],
              darkcolor=[("active", COLOR_ACCENT_DARK), ("disabled", COLOR_BORDER)],
              bordercolor=[("active", COLOR_ACCENT_DARK), ("disabled", COLOR_BORDER)],
              foreground=[("disabled", COLOR_TEXT_MUTED)])

    style.configure("Secondary.TButton", background=COLOR_BG_INPUT, foreground=COLOR_TEXT,
                     borderwidth=1, padding=(12, 7), relief="flat",
                     lightcolor=COLOR_BG_INPUT, darkcolor=COLOR_BG_INPUT,
                     bordercolor=COLOR_BORDER, focuscolor=COLOR_BG_INPUT)
    style.map("Secondary.TButton",
              background=[("active", COLOR_BG_INPUT_FOCUS)],
              lightcolor=[("active", COLOR_BG_INPUT_FOCUS)],
              darkcolor=[("active", COLOR_BG_INPUT_FOCUS)])

    style.configure("Danger.TButton", background=COLOR_DANGER, foreground="#2a0a0a",
                     padding=(12, 7), relief="flat", lightcolor=COLOR_DANGER,
                     darkcolor=COLOR_DANGER, bordercolor=COLOR_DANGER, focuscolor=COLOR_DANGER)
    style.map("Danger.TButton",
              background=[("active", "#e14e4e")],
              lightcolor=[("active", "#e14e4e")], darkcolor=[("active", "#e14e4e")])

    style.configure("TEntry", fieldbackground=COLOR_BG_INPUT, foreground=COLOR_TEXT,
                     insertcolor=COLOR_TEXT, borderwidth=1, padding=6)
    style.map("TEntry", fieldbackground=[("focus", COLOR_BG_INPUT_FOCUS)])

    style.configure("TCombobox", fieldbackground=COLOR_BG_INPUT, background=COLOR_BG_INPUT,
                     foreground=COLOR_TEXT, arrowcolor=COLOR_ACCENT, padding=5)
    style.map("TCombobox", fieldbackground=[("readonly", COLOR_BG_INPUT)],
              foreground=[("readonly", COLOR_TEXT)])
    root.option_add("*TCombobox*Listbox.background", COLOR_BG_INPUT)
    root.option_add("*TCombobox*Listbox.foreground", COLOR_TEXT)
    root.option_add("*TCombobox*Listbox.selectBackground", COLOR_ACCENT)
    root.option_add("*TCombobox*Listbox.selectForeground", "#04121c")

    style.configure("TNotebook", background=COLOR_BG, borderwidth=0)
    style.configure("TNotebook.Tab", background=COLOR_BG_PANEL, foreground=COLOR_TEXT_MUTED,
                     padding=(14, 8), font=("Segoe UI", 10, "bold"), borderwidth=0)
    style.map("TNotebook.Tab",
              background=[("selected", COLOR_ACCENT)],
              foreground=[("selected", "#04121c")])
    style.layout("TNotebook.Tab", [
        ("Notebook.tab", {"sticky": "nswe", "children": [
            ("Notebook.padding", {"side": "top", "sticky": "nswe", "children": [
                ("Notebook.label", {"side": "top", "sticky": ""})
            ]})
        ]})
    ])

    style.configure("Treeview", background=COLOR_BG_PANEL, fieldbackground=COLOR_BG_PANEL,
                     foreground=COLOR_TEXT, rowheight=26, borderwidth=0)
    style.configure("Treeview.Heading", background=COLOR_BG_INPUT, foreground=COLOR_ACCENT,
                     font=("Segoe UI", 9, "bold"), relief="flat")
    style.map("Treeview.Heading", background=[("active", COLOR_BG_INPUT_FOCUS)])
    style.map("Treeview", background=[("selected", COLOR_SELECT_BG)],
              foreground=[("selected", COLOR_TEXT)])

    style.configure("TSeparator", background=COLOR_BORDER)
    style.configure("TCheckbutton", background=COLOR_BG, foreground=COLOR_TEXT)
    return style


# Registros globales de widgets "crudos" de Tk (no-ttk) que hay que restylear
# manualmente cuando se cambia de tema oscuro/claro.
THEMED_CANVASES = []
THEMED_TEXTS = []
THEMED_LISTBOXES = []


def style_text_widget(widget):
    """Aplica el tema oscuro a un tk.Text (no es un widget ttk)."""
    widget.configure(
        bg=COLOR_BG_INPUT, fg=COLOR_TEXT, insertbackground=COLOR_TEXT,
        relief="flat", padx=8, pady=6, highlightthickness=1,
        highlightbackground=COLOR_BORDER, highlightcolor=COLOR_ACCENT,
    )
    if widget not in THEMED_TEXTS:
        THEMED_TEXTS.append(widget)


def style_listbox_widget(widget):
    """Aplica el tema oscuro a un tk.Listbox (sus opciones difieren de tk.Text)."""
    widget.configure(
        bg=COLOR_BG_INPUT, fg=COLOR_TEXT, selectbackground=COLOR_SELECT_BG,
        selectforeground=COLOR_TEXT, relief="flat", highlightthickness=1,
        highlightbackground=COLOR_BORDER, highlightcolor=COLOR_ACCENT,
    )
    if widget not in THEMED_LISTBOXES:
        THEMED_LISTBOXES.append(widget)


def open_author_info(parent):
    """Ventana emergente 'Sobre el creador' con link a jgonzalez.app."""
    win = tk.Toplevel(parent)
    win.title("Sobre el creador")
    win.configure(bg=COLOR_BG_PANEL)
    win.geometry("420x420")
    win.resizable(False, False)
    win.transient(parent)
    win.grab_set()

    pad = ttk.Frame(win, style="Panel.TFrame", padding=22)
    pad.pack(fill="both", expand=True)
    pad.configure(style="Panel.TFrame")

    tk.Label(pad, text=AUTHOR_NAME, bg=COLOR_BG_PANEL, fg=COLOR_ACCENT,
              font=("Segoe UI", 14, "bold"), wraplength=370, justify="left").pack(anchor="w")
    tk.Label(pad, text=f"Gestión del Tiempo con Datos — v{APP_VERSION}", bg=COLOR_BG_PANEL,
              fg=COLOR_TEXT_MUTED, font=("Segoe UI", 9, "bold"),
              wraplength=370, justify="left").pack(anchor="w", pady=(2, 0))
    tk.Label(pad, text=AUTHOR_ROLE, bg=COLOR_BG_PANEL, fg=COLOR_TEXT_MUTED,
              font=("Segoe UI", 9), wraplength=370, justify="left").pack(anchor="w", pady=(2, 14))
    tk.Label(pad, text=AUTHOR_BIO, bg=COLOR_BG_PANEL, fg=COLOR_TEXT,
              font=("Segoe UI", 10), wraplength=370, justify="left").pack(anchor="w")

    link = tk.Label(pad, text=AUTHOR_URL, bg=COLOR_BG_PANEL, fg=COLOR_ACCENT2,
                     font=("Segoe UI", 10, "underline"), cursor="hand2")
    link.pack(anchor="w", pady=(16, 4))
    link.bind("<Button-1>", lambda e: webbrowser.open(AUTHOR_URL))

    tk.Label(pad, text=AUTHOR_COPYRIGHT, bg=COLOR_BG_PANEL, fg=COLOR_TEXT_MUTED,
              font=("Segoe UI", 8), wraplength=370, justify="left").pack(anchor="w", pady=(14, 0))

    btns = ttk.Frame(pad, style="Panel.TFrame")
    btns.pack(fill="x", pady=(14, 0))
    ttk.Button(btns, text="Abrir sitio web", command=lambda: webbrowser.open(AUTHOR_URL)).pack(
        side="left")
    ttk.Button(btns, text="Cerrar", style="Secondary.TButton", command=win.destroy).pack(
        side="right")


def _format_datetime_display(iso_string):
    """Convierte un datetime ISO (created_at) a 'YYYY-MM-DD HH:MM' para mostrar y ordenar."""
    if not iso_string:
        return ""
    try:
        dt = datetime.datetime.fromisoformat(iso_string)
        return dt.strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return iso_string


def add_scrollbar(parent, tree, horizontal=True):
    """Envuelve un Treeview con barra(s) de scroll (vertical y, opcionalmente, horizontal)
    dentro de un frame contenedor."""
    container = ttk.Frame(parent)

    vscroll = ttk.Scrollbar(container, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=vscroll.set)
    vscroll.pack(in_=container, side="right", fill="y")

    if horizontal:
        hscroll = ttk.Scrollbar(container, orient="horizontal", command=tree.xview)
        tree.configure(xscrollcommand=hscroll.set)
        hscroll.pack(in_=container, side="bottom", fill="x")

    tree.pack(in_=container, side="left", fill="both", expand=True)
    # El árbol y el contenedor son "hermanos" en la jerarquía real de widgets
    # (el árbol se creó antes con 'parent' como master); sin este lift() el
    # contenedor puede quedar apilado encima y tapar visualmente el árbol.
    tree.lift(container)
    return container


def _sort_treeview_column(tree, col, descending):
    data = [(tree.set(row_id, col), row_id) for row_id in tree.get_children("")]

    def sort_key(pair):
        value = pair[0]
        try:
            return (0, float(value))
        except ValueError:
            return (1, value.lower())

    data.sort(key=sort_key, reverse=descending)
    for index, (_, row_id) in enumerate(data):
        tree.move(row_id, "", index)
    tree.heading(col, command=lambda: _sort_treeview_column(tree, col, not descending))


def enable_column_sorting(tree):
    """Permite ordenar la tabla haciendo clic en cualquier encabezado de columna."""
    for col in tree["columns"]:
        tree.heading(col, command=lambda c=col: _sort_treeview_column(tree, c, False))


def make_scrollable(parent):
    """
    Crea un área con scroll vertical dentro de 'parent' y devuelve el frame interior
    donde se debe seguir construyendo el contenido. Útil para pestañas que pueden
    crecer más que el alto de la ventana (p. ej. Revisión semanal).
    """
    canvas = tk.Canvas(parent, bg=COLOR_BG, highlightthickness=0)
    THEMED_CANVASES.append(canvas)
    scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
    inner = ttk.Frame(canvas)

    inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    window_id = canvas.create_window((0, 0), window=inner, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    # Que el frame interior ocupe todo el ancho disponible del canvas
    canvas.bind("<Configure>", lambda e: canvas.itemconfigure(window_id, width=e.width))

    def _on_mousewheel(event):
        delta = -1 * (event.delta // 120) if event.delta else (1 if event.num == 5 else -1)
        canvas.yview_scroll(delta, "units")

    canvas.bind_all("<MouseWheel>", _on_mousewheel, add="+")   # Windows/Mac
    canvas.bind_all("<Button-4>", _on_mousewheel, add="+")     # Linux scroll up
    canvas.bind_all("<Button-5>", _on_mousewheel, add="+")     # Linux scroll down

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")
    return inner


def refresh_themed_raw_widgets():
    """Reaplica el color actual a los widgets tk 'crudos' (Text/Listbox/Canvas) ya creados."""
    for widget in list(THEMED_TEXTS):
        try:
            style_text_widget(widget)
        except tk.TclError:
            THEMED_TEXTS.remove(widget)
    for widget in list(THEMED_LISTBOXES):
        try:
            style_listbox_widget(widget)
        except tk.TclError:
            THEMED_LISTBOXES.remove(widget)
    for canvas in list(THEMED_CANVASES):
        try:
            canvas.configure(bg=COLOR_BG)
        except tk.TclError:
            THEMED_CANVASES.remove(canvas)


# ----------------------------------------------------------------------------
# Ventana de autenticación
# ----------------------------------------------------------------------------
class AuthWindow(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title(APP_TITLE + " — Acceso")
        self.geometry("400x510")
        self.resizable(False, False)
        self.user = None

        THEMED_CANVASES.clear()
        THEMED_TEXTS.clear()
        THEMED_LISTBOXES.clear()
        apply_theme_styles(self)

        container = ttk.Frame(self, padding=28)
        container.pack(fill="both", expand=True)

        ttk.Label(container, text="Gestión del Tiempo\ncon Datos",
                  style="Title.TLabel", justify="center").pack(pady=(0, 4))
        ttk.Label(container, text="Estrategia para optimizar tu productividad",
                  style="Muted.TLabel", justify="center").pack(pady=(0, 20))

        self.notebook = ttk.Notebook(container)
        self.notebook.pack(fill="both", expand=True)

        self._build_login_tab()
        self._build_register_tab()

        ttk.Button(container, text="Sobre el creador", style="Secondary.TButton",
                   command=lambda: open_author_info(self)).pack(fill="x", pady=(16, 4))

        self.theme_btn = ttk.Button(container, text=self._theme_button_text(),
                                     style="Secondary.TButton", command=self._toggle_theme)
        self.theme_btn.pack(fill="x")

    def _theme_button_text(self):
        return "Cambiar a modo claro" if CURRENT_THEME == "dark" else "Cambiar a modo oscuro"

    def _toggle_theme(self):
        set_palette("light" if CURRENT_THEME == "dark" else "dark")
        apply_theme_styles(self)
        refresh_themed_raw_widgets()
        self.theme_btn.config(text=self._theme_button_text())

    def _build_login_tab(self):
        tab = ttk.Frame(self.notebook, padding=16)
        self.notebook.add(tab, text="Iniciar sesión")

        ttk.Label(tab, text="Usuario").pack(anchor="w")
        self.login_user = ttk.Entry(tab)
        self.login_user.pack(fill="x", pady=(0, 10))

        ttk.Label(tab, text="Contraseña").pack(anchor="w")
        self.login_pass = ttk.Entry(tab, show="*")
        self.login_pass.pack(fill="x", pady=(0, 16))
        self.login_pass.bind("<Return>", lambda e: self._do_login())

        ttk.Button(tab, text="Entrar", command=self._do_login).pack(fill="x")

    def _build_register_tab(self):
        tab = ttk.Frame(self.notebook, padding=16)
        self.notebook.add(tab, text="Crear cuenta")

        ttk.Label(tab, text="Elige un usuario").pack(anchor="w")
        self.reg_user = ttk.Entry(tab)
        self.reg_user.pack(fill="x", pady=(0, 10))

        ttk.Label(tab, text="Elige una contraseña").pack(anchor="w")
        self.reg_pass = ttk.Entry(tab, show="*")
        self.reg_pass.pack(fill="x", pady=(0, 10))

        ttk.Label(tab, text="Confirma la contraseña").pack(anchor="w")
        self.reg_pass2 = ttk.Entry(tab, show="*")
        self.reg_pass2.pack(fill="x", pady=(0, 16))

        ttk.Button(tab, text="Registrarme", command=self._do_register).pack(fill="x")

    def _do_login(self):
        username = self.login_user.get().strip()
        password = self.login_pass.get()
        if not username or not password:
            messagebox.showwarning(APP_TITLE, "Ingresa usuario y contraseña.")
            return
        user = db.verify_user(username, password)
        if user is None:
            messagebox.showerror(APP_TITLE, "Usuario o contraseña incorrectos.")
            return
        self.user = user
        self.destroy()

    def _do_register(self):
        username = self.reg_user.get().strip()
        password = self.reg_pass.get()
        password2 = self.reg_pass2.get()
        if not username or not password:
            messagebox.showwarning(APP_TITLE, "Completa usuario y contraseña.")
            return
        if password != password2:
            messagebox.showwarning(APP_TITLE, "Las contraseñas no coinciden.")
            return
        ok, msg = db.create_user(username, password)
        if ok:
            messagebox.showinfo(APP_TITLE, msg + " Ahora inicia sesión.")
            self.notebook.select(0)
            self.login_user.insert(0, username)
        else:
            messagebox.showerror(APP_TITLE, msg)


# ----------------------------------------------------------------------------
# Ventana principal
# ----------------------------------------------------------------------------
class MainApp(tk.Tk):
    def __init__(self, user):
        super().__init__()
        self.user = user
        self.title(f"{APP_TITLE} — {user['username']}")
        self.geometry("1000x680")
        self.minsize(880, 600)

        # Estado del Pomodoro
        self.pomo_seconds_left = 0
        self.pomo_running = False
        self.pomo_mode = "focus"  # focus / break
        self.pomo_category = tk.StringVar(value=CATEGORIES_DEFAULT[0])
        self.pomo_start_dt = None

        THEMED_CANVASES.clear()
        THEMED_TEXTS.clear()
        THEMED_LISTBOXES.clear()
        set_palette(db.get_theme(user["id"]))
        apply_theme_styles(self)

        header = ttk.Frame(self, padding=(16, 12))
        header.pack(fill="x")
        ttk.Label(header, text=APP_TITLE, style="Title.TLabel").pack(side="left")
        ttk.Label(header, text=f"  ·  Sesión: {user['username']}",
                  style="Muted.TLabel").pack(side="left")

        ttk.Button(header, text="Cerrar sesión", style="Secondary.TButton",
                   command=self._logout).pack(side="right")
        ttk.Button(header, text="Sobre el creador", style="Secondary.TButton",
                   command=lambda: open_author_info(self)).pack(side="right", padx=(0, 8))
        self.theme_btn = ttk.Button(header, text=self._theme_button_text(),
                                     style="Secondary.TButton", command=self._toggle_theme)
        self.theme_btn.pack(side="right", padx=(0, 8))

        ttk.Separator(self).pack(fill="x")

        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=(0, 10))

        self.tab_inbox = ttk.Frame(self.notebook)
        self.tab_blocks = ttk.Frame(self.notebook)
        self.tab_priority = ttk.Frame(self.notebook)
        self.tab_kanban = ttk.Frame(self.notebook)
        self.tab_dashboard = ttk.Frame(self.notebook)
        self.tab_review = ttk.Frame(self.notebook)
        self.tab_pomodoro = ttk.Frame(self.notebook)
        self.tab_ai = ttk.Frame(self.notebook)

        self.notebook.add(self.tab_inbox, text="Bandeja de captura")
        self.notebook.add(self.tab_blocks, text="Time Blocking")
        self.notebook.add(self.tab_priority, text="Priorización")
        self.notebook.add(self.tab_kanban, text="Kanban")
        self.notebook.add(self.tab_dashboard, text="Dashboard")
        self.notebook.add(self.tab_review, text="Revisión semanal")
        self.notebook.add(self.tab_pomodoro, text="Pomodoro")
        self.notebook.add(self.tab_ai, text="Asistente IA")

        self._build_inbox_tab()
        self._build_blocks_tab()
        self._build_priority_tab()
        self._build_kanban_tab()
        self._build_dashboard_tab()
        self._build_review_tab()
        self._build_pomodoro_tab()
        self._build_ai_tab()

        self.notebook.bind("<<NotebookTabChanged>>", self._on_tab_changed)

        self.protocol("WM_DELETE_WINDOW", self._on_close)

    def _logout(self):
        self.destroy()
        run_app(force_login=True)

    def _theme_button_text(self):
        return "Modo claro" if CURRENT_THEME == "dark" else "Modo oscuro"

    def _toggle_theme(self):
        new_mode = "light" if CURRENT_THEME == "dark" else "dark"
        set_palette(new_mode)
        apply_theme_styles(self)
        refresh_themed_raw_widgets()
        self.theme_btn.config(text=self._theme_button_text())
        db.save_theme(self.user["id"], new_mode)
        # Las gráficas de matplotlib no son widgets ttk: hay que regenerarlas con la nueva paleta.
        self._refresh_dashboard()

    def _on_close(self):
        if self.pomo_running:
            if not messagebox.askyesno(APP_TITLE, "Hay un Pomodoro corriendo. ¿Salir de todos modos?"):
                return
        self.destroy()

    def _on_tab_changed(self, event):
        tab_text = self.notebook.tab(self.notebook.select(), "text")
        if "Bandeja" in tab_text:
            self._refresh_inbox()
        elif "Time Blocking" in tab_text:
            self._refresh_block_task_options()
            self._refresh_blocks()
        elif "Priorización" in tab_text:
            self._refresh_priority()
        elif "Kanban" in tab_text:
            self._refresh_kanban()
        elif "Dashboard" in tab_text:
            self._refresh_dashboard()
        elif "Revisión" in tab_text:
            self._refresh_review_history()

    # ------------------------------------------------------------------
    # TAB 1: Bandeja de captura (GTD)
    # ------------------------------------------------------------------
    def _build_inbox_tab(self):
        scroll_root = make_scrollable(self.tab_inbox)
        frame = ttk.Frame(scroll_root, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Captura rápida (estilo GTD)", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text="Anota cualquier cosa que ocupe tu mente. Prioriza después, no ahora.",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 10))

        form = ttk.Frame(frame)
        form.pack(fill="x", pady=(0, 8))

        ttk.Label(form, text="Actividad / tarea:").grid(row=0, column=0, sticky="w")
        self.inbox_title_entry = ttk.Entry(form, width=55)
        self.inbox_title_entry.grid(row=1, column=0, padx=(0, 10), sticky="w")
        self.inbox_title_entry.bind("<Return>", lambda e: self._add_inbox_item())

        ttk.Button(form, text="Capturar", command=self._add_inbox_item).grid(row=1, column=1, padx=(0, 10))

        # --- Importar de Outlook: qué traer, rango de fechas + botón ---
        outlook_frame = ttk.Frame(frame)
        outlook_frame.pack(fill="x", pady=(4, 0))
        ttk.Label(outlook_frame, text="Importar de Outlook:").pack(side="left", padx=(0, 6))
        self.outlook_mode_combo = ttk.Combobox(
            outlook_frame, state="readonly", width=20,
            values=["Correos y sesiones", "Solo correos", "Solo sesiones"],
        )
        self.outlook_mode_combo.set("Correos y sesiones")
        self.outlook_mode_combo.pack(side="left", padx=(0, 10))

        today = datetime.date.today()
        monday = today - datetime.timedelta(days=today.weekday())
        sunday = monday + datetime.timedelta(days=6)

        ttk.Label(outlook_frame, text="Desde:").pack(side="left", padx=(0, 4))
        self.outlook_start_entry = ttk.Entry(outlook_frame, width=11)
        self.outlook_start_entry.insert(0, monday.isoformat())
        self.outlook_start_entry.pack(side="left", padx=(0, 8))

        ttk.Label(outlook_frame, text="Hasta:").pack(side="left", padx=(0, 4))
        self.outlook_end_entry = ttk.Entry(outlook_frame, width=11)
        self.outlook_end_entry.insert(0, sunday.isoformat())
        self.outlook_end_entry.pack(side="left", padx=(0, 8))

        ttk.Button(outlook_frame, text="Esta semana", style="Secondary.TButton",
                   command=self._set_outlook_range_this_week).pack(side="left", padx=(0, 8))
        ttk.Button(outlook_frame, text="Importar", command=self._import_from_outlook).pack(side="left")

        ttk.Label(frame, text="Formato de fecha: AAAA-MM-DD.", style="Muted.TLabel",
                  font=("Segoe UI", 8)).pack(anchor="w", pady=(2, 0))

        # --- Microsoft Graph: cuenta conectada para sesiones (funciona con Outlook nuevo) ---
        graph_frame = ttk.Frame(frame)
        graph_frame.pack(fill="x", pady=(8, 0))
        ttk.Label(graph_frame, text="Sesiones vía Microsoft Graph (funciona con Outlook nuevo):",
                  font=("Segoe UI", 9, "bold")).pack(anchor="w")

        graph_row = ttk.Frame(frame)
        graph_row.pack(fill="x", pady=(4, 0))

        self.ms_status_label = ttk.Label(graph_row, text="", style="Muted.TLabel")
        self.ms_status_label.pack(side="left", padx=(0, 10))

        self.ms_connect_btn = ttk.Button(graph_row, text="Conectar cuenta de Microsoft",
                                          command=self._connect_ms_account)
        self.ms_connect_btn.pack(side="left", padx=(0, 8))

        ttk.Button(graph_row, text="Configurar Client ID", style="Secondary.TButton",
                   command=self._open_ms_settings).pack(side="left", padx=(0, 8))

        self.ms_disconnect_btn = ttk.Button(graph_row, text="Desconectar", style="Secondary.TButton",
                                             command=self._disconnect_ms_account)
        self.ms_disconnect_btn.pack(side="left")

        self._refresh_ms_status()

        # --- Buscador ---
        search_frame = ttk.Frame(frame)
        search_frame.pack(fill="x", pady=(4, 8))
        ttk.Label(search_frame, text="Buscar:").pack(side="left", padx=(0, 6))
        self.inbox_search_entry = ttk.Entry(search_frame, width=40)
        self.inbox_search_entry.pack(side="left")
        self.inbox_search_entry.bind("<KeyRelease>", lambda e: self._refresh_inbox())
        ttk.Button(search_frame, text="Limpiar búsqueda", style="Secondary.TButton",
                   command=self._clear_inbox_search).pack(side="left", padx=(8, 0))

        # Lista de tareas pendientes
        cols = ("id", "title", "category", "description", "status", "captured_at")
        self.inbox_tree = ttk.Treeview(frame, columns=cols, show="headings", height=10,
                                        selectmode="extended")
        for c, label, w in [("id", "ID", 40), ("title", "Actividad", 320),
                             ("category", "Categoría", 100),
                             ("description", "Descripción", 320), ("status", "Estado", 85),
                             ("captured_at", "Capturado", 130)]:
            self.inbox_tree.heading(c, text=label)
            self.inbox_tree.column(c, width=w, anchor="w", stretch=False)
        enable_column_sorting(self.inbox_tree)
        self.inbox_tree.bind("<Double-1>", lambda e: self._edit_selected_task())
        self.inbox_tree.bind("<Control-Down>", self._extend_inbox_selection_down)
        self.inbox_tree.bind("<Control-Up>", self._extend_inbox_selection_up)
        add_scrollbar(frame, self.inbox_tree).pack(fill="both", expand=True, pady=(6, 6))

        ttk.Label(frame,
                  text="Tip: clic en encabezado para ordenar · doble clic para editar · "
                       "Ctrl + ↓/↑ para seleccionar varias filas y eliminarlas juntas.",
                  style="Muted.TLabel", font=("Segoe UI", 8)).pack(anchor="w")

        btns = ttk.Frame(frame)
        btns.pack(fill="x", pady=(4, 0))
        ttk.Button(btns, text="Editar", width=12,
                   command=self._edit_selected_task).pack(side="left", padx=(0, 6))
        ttk.Button(btns, text="Marcar como hecho", width=20,
                   command=self._mark_task_done).pack(side="left", padx=(0, 6))
        ttk.Button(btns, text="Eliminar", width=12,
                   command=self._delete_inbox_item).pack(side="left", padx=(0, 6))
        ttk.Button(btns, text="Borrar todo", width=14, style="Danger.TButton",
                   command=self._delete_all_inbox).pack(side="left")
        ttk.Button(btns, text="Actualizar lista", width=18,
                   command=self._refresh_inbox).pack(side="right")

        self._refresh_inbox()

    def _clear_inbox_search(self):
        self.inbox_search_entry.delete(0, "end")
        self._refresh_inbox()

    def _add_inbox_item(self):
        title = self.inbox_title_entry.get().strip()
        if not title:
            messagebox.showwarning(APP_TITLE, "Escribe una actividad antes de capturar.")
            return
        db.add_task(self.user["id"], title, "Manual", source_type="Manual")
        self.inbox_title_entry.delete(0, "end")
        self._refresh_inbox()

    def _set_outlook_range_this_week(self):
        today = datetime.date.today()
        monday = today - datetime.timedelta(days=today.weekday())
        sunday = monday + datetime.timedelta(days=6)
        self.outlook_start_entry.delete(0, "end")
        self.outlook_start_entry.insert(0, monday.isoformat())
        self.outlook_end_entry.delete(0, "end")
        self.outlook_end_entry.insert(0, sunday.isoformat())

    # ------------------------------------------------------------------
    # Microsoft Graph: conexión de cuenta para sesiones (funciona con Outlook nuevo)
    # ------------------------------------------------------------------
    def _refresh_ms_status(self):
        client_id = db.get_ms_client_id(self.user["id"])
        if not client_id:
            self.ms_status_label.config(text="Sin configurar. Da clic en 'Configurar Client ID'.")
            self.ms_connect_btn.config(state="disabled")
            self.ms_disconnect_btn.config(state="disabled")
            return

        self.ms_connect_btn.config(state="normal")

        ok, _ = msgraph.graph_available()
        if not ok:
            self.ms_status_label.config(text="Falta instalar 'msal' (pip install msal).")
            return

        cache_str = db.get_ms_token_cache(self.user["id"])
        if not cache_str:
            self.ms_status_label.config(text="No conectado.")
            self.ms_disconnect_btn.config(state="disabled")
            return

        cache = msgraph.new_token_cache(cache_str)
        account = msgraph.get_connected_account_name(client_id, cache)
        if account:
            self.ms_status_label.config(text=f"Conectado como: {account}")
            self.ms_disconnect_btn.config(state="normal")
        else:
            self.ms_status_label.config(text="No conectado.")
            self.ms_disconnect_btn.config(state="disabled")

    def _open_ms_settings(self):
        win = tk.Toplevel(self)
        win.title("Configurar Microsoft Graph")
        win.configure(bg=COLOR_BG_PANEL)
        win.geometry("560x520")
        win.transient(self)
        win.grab_set()

        pad = ttk.Frame(win, style="Panel.TFrame", padding=20)
        pad.pack(fill="both", expand=True)

        ttk.Label(pad, text="Configurar Microsoft Graph", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(pad,
                  text="Esto solo se configura una vez por instalación. Necesitas el "
                       "'Application (client) ID' de una app registrada en Azure.",
                  style="Muted.TLabel", wraplength=510, justify="left").pack(anchor="w", pady=(2, 12))

        ttk.Label(pad, text="Application (client) ID:").pack(anchor="w")
        client_id_entry = ttk.Entry(pad, width=50)
        existing = db.get_ms_client_id(self.user["id"])
        if existing:
            client_id_entry.insert(0, existing)
        client_id_entry.pack(anchor="w", fill="x", pady=(0, 10))

        def save_and_close():
            value = client_id_entry.get().strip()
            if not value:
                messagebox.showwarning(APP_TITLE, "Pega el Client ID antes de guardar.")
                return
            db.save_ms_client_id(self.user["id"], value)
            self._refresh_ms_status()
            win.destroy()

        btns = ttk.Frame(pad, style="Panel.TFrame")
        btns.pack(fill="x", pady=(0, 14))
        ttk.Button(btns, text="Guardar", command=save_and_close).pack(side="left")
        ttk.Button(btns, text="Cancelar", style="Secondary.TButton",
                   command=win.destroy).pack(side="right")

        ttk.Separator(pad).pack(fill="x", pady=(0, 12))
        ttk.Label(pad, text="¿Todavía no tienes un Client ID? Sigue estos pasos en Azure "
                             "(una sola vez, no por cada cliente):",
                  style="Muted.TLabel", wraplength=510, justify="left").pack(anchor="w", pady=(0, 8))

        instructions_text = tk.Text(pad, height=10, wrap="word")
        style_text_widget(instructions_text)
        instructions_text.insert("1.0", msgraph.azure_setup_instructions())
        instructions_text.config(state="disabled")
        instructions_text.pack(fill="both", expand=True)

    def _connect_ms_account(self):
        ok, msg = msgraph.graph_available()
        if not ok:
            messagebox.showinfo(APP_TITLE, msg)
            return

        client_id = db.get_ms_client_id(self.user["id"])
        if not client_id:
            messagebox.showinfo(APP_TITLE, "Primero configura tu Client ID de Azure.")
            return

        cache_str = db.get_ms_token_cache(self.user["id"])
        cache = msgraph.new_token_cache(cache_str)

        # Ventana simple mientras se abre el navegador con el login real de Microsoft
        # (correo, contraseña y verificación en dos pasos — igual que entrar a Outlook).
        win = tk.Toplevel(self)
        win.title("Conectar cuenta de Microsoft")
        win.configure(bg=COLOR_BG_PANEL)
        win.geometry("420x220")
        win.transient(self)
        win.grab_set()

        # Estado compartido para saber si la persona canceló (el hilo de fondo puede
        # seguir esperando una respuesta que quizás nunca llegue, p. ej. si la política
        # de la organización bloquea la app silenciosamente; por eso SIEMPRE debe haber
        # una forma de cerrar esta ventana).
        cancelled = {"value": False}

        def cancel_and_close():
            cancelled["value"] = True
            win.destroy()

        win.protocol("WM_DELETE_WINDOW", cancel_and_close)

        pad = ttk.Frame(win, style="Panel.TFrame", padding=20)
        pad.pack(fill="both", expand=True)

        ttk.Label(pad, text="Se abrió tu navegador con el inicio de sesión de Microsoft.",
                  wraplength=370, justify="left").pack(anchor="w")
        ttk.Label(pad, text="Ingresa tu correo, contraseña y verificación en dos pasos "
                             "si tu cuenta la usa (igual que entrar a Outlook).",
                  style="Muted.TLabel", wraplength=370, justify="left").pack(anchor="w", pady=(6, 14))

        status_label = ttk.Label(pad, text="Esperando a que termines de iniciar sesión…",
                                  style="Muted.TLabel")
        status_label.pack(anchor="w", pady=(0, 14))

        ttk.Label(pad, text="Si no avanza (por ejemplo, si tu organización bloquea este tipo "
                             "de conexión), puedes cancelar aquí.",
                  style="Muted.TLabel", font=("Segoe UI", 8), wraplength=370,
                  justify="left").pack(anchor="w", pady=(0, 8))

        ttk.Button(pad, text="Cancelar", style="Secondary.TButton",
                   command=cancel_and_close).pack(anchor="w")

        import threading

        def worker():
            success, result = msgraph.start_interactive_login(client_id, cache=cache)
            if not cancelled["value"]:
                self.after(0, lambda: on_done(success, result))

        def on_done(success, result):
            if cancelled["value"]:
                return
            if success:
                db.save_ms_token_cache(self.user["id"], cache.serialize())
                status_label.config(text="¡Conectado!")
                self.after(800, win.destroy)
                self._refresh_ms_status()
                messagebox.showinfo(APP_TITLE, "Cuenta de Microsoft conectada correctamente.")
            else:
                win.destroy()
                messagebox.showerror(APP_TITLE, f"No se pudo conectar: {result}")

        threading.Thread(target=worker, daemon=True).start()

    def _disconnect_ms_account(self):
        db.clear_ms_connection(self.user["id"])
        self._refresh_ms_status()
        messagebox.showinfo(APP_TITLE, "Cuenta de Microsoft desconectada.")

    def _graph_not_ready_reason(self):
        """Explica en una frase por qué Graph no se pudo usar para sesiones, para
        mostrarlo ANTES del diagnóstico genérico de COM."""
        ok, msg = msgraph.graph_available()
        if not ok:
            return f"Sesiones vía Microsoft Graph no disponibles: {msg}"

        client_id = db.get_ms_client_id(self.user["id"])
        if not client_id:
            return ("No has configurado Microsoft Graph todavía: en la Bandeja de captura, "
                    "da clic en 'Configurar Client ID' y luego en 'Conectar cuenta de Microsoft' "
                    "para poder traer sesiones aunque uses el Outlook nuevo.")

        cache_str = db.get_ms_token_cache(self.user["id"])
        if not cache_str:
            return ("Tienes el Client ID configurado, pero todavía no conectaste ninguna cuenta "
                    "de Microsoft. Da clic en 'Conectar cuenta de Microsoft' en la Bandeja de "
                    "captura para poder traer sesiones.")

        return ("No se pudo usar tu cuenta de Microsoft conectada (la sesión pudo haber "
                "expirado). Intenta 'Desconectar' y 'Conectar cuenta de Microsoft' de nuevo.")

    def _get_graph_sessions(self, start_date, end_date, max_items=200):
        """Intenta traer sesiones vía Microsoft Graph si hay una cuenta conectada.
        Regresa (items, error) si Graph está disponible y configurado, o (None, None)
        si no hay nada configurado (para que el llamador use el respaldo por COM)."""
        ok, _ = msgraph.graph_available()
        if not ok:
            return None, None

        client_id = db.get_ms_client_id(self.user["id"])
        if not client_id:
            return None, None

        cache_str = db.get_ms_token_cache(self.user["id"])
        if not cache_str:
            return None, None

        cache = msgraph.new_token_cache(cache_str)
        result = msgraph.get_token_silent(client_id, cache)

        if cache.has_state_changed:
            db.save_ms_token_cache(self.user["id"], cache.serialize())

        if not result or "access_token" not in result:
            return [], ("Tu sesión de Microsoft expiró o no está conectada. Ve a 'Conectar cuenta "
                        "de Microsoft' en la Bandeja de captura.")

        items, error = msgraph.fetch_calendar_events(
            result["access_token"], start_date, end_date, max_items=max_items)
        return items, error

    def _import_from_outlook(self):
        mode_label = self.outlook_mode_combo.get()
        mode = {
            "Correos y sesiones": "ambos",
            "Solo correos": "correos",
            "Solo sesiones": "sesiones",
        }.get(mode_label, "ambos")
        want_emails = mode in ("ambos", "correos")
        want_sessions = mode in ("ambos", "sesiones")

        try:
            start_date = datetime.datetime.strptime(
                self.outlook_start_entry.get().strip(), "%Y-%m-%d").date()
            end_date = datetime.datetime.strptime(
                self.outlook_end_entry.get().strip(), "%Y-%m-%d").date()
        except ValueError:
            messagebox.showerror(
                APP_TITLE, "Revisa el formato de las fechas 'Desde' y 'Hasta' (AAAA-MM-DD).")
            return

        if end_date < start_date:
            messagebox.showerror(APP_TITLE, "La fecha 'Hasta' no puede ser anterior a 'Desde'.")
            return

        items = []
        warnings = []
        used_graph_for_sessions = False

        # --- Correos: siempre por COM (funciona bien incluso con Outlook nuevo) ---
        if want_emails:
            ok, com_msg = outlook.outlook_available()
            if not ok:
                warnings.append(com_msg)
            else:
                email_items, email_warning = outlook.get_outlook_pending_items(
                    mode="correos", start_date=start_date, end_date=end_date)
                items += email_items
                if email_warning:
                    warnings.append(email_warning)

        # --- Sesiones: primero Microsoft Graph (si está conectado); si no, por COM ---
        if want_sessions:
            graph_items, graph_error = self._get_graph_sessions(start_date, end_date)
            if graph_items is not None:
                used_graph_for_sessions = True
                items += graph_items
                if graph_error:
                    warnings.append(graph_error)
            else:
                # Graph no está listo (no configurado o no conectado): avisamos
                # exactamente qué falta ANTES de caer al método clásico por COM,
                # para que quede claro qué paso falta en vez de repetir siempre
                # el mismo diagnóstico genérico de "Outlook nuevo".
                warnings.append(self._graph_not_ready_reason())
                ok, com_msg = outlook.outlook_available()
                if not ok:
                    warnings.append(com_msg)
                else:
                    session_items, session_warning = outlook.get_outlook_pending_items(
                        mode="sesiones", start_date=start_date, end_date=end_date)
                    items += session_items
                    if session_warning:
                        warnings.append(session_warning)

        warning = "\n\n".join(w for w in warnings if w)

        if not items:
            messagebox.showinfo(APP_TITLE, warning or "No se encontraron elementos en ese rango.")
            return

        already_imported = db.get_existing_external_ids(self.user["id"])

        added = 0
        skipped = 0
        for item in items:
            ext_id = item.get("external_id")
            if ext_id and ext_id in already_imported:
                skipped += 1
                continue
            # La categoría es directamente el origen: "Correo" o "Sesión".
            db.add_task(self.user["id"], item["title"], item["source"], external_id=ext_id,
                        source_type=item.get("source_type", "Manual"),
                        description=item.get("description"))
            if ext_id:
                already_imported.add(ext_id)
            added += 1

        self._refresh_inbox()

        range_label = f"del {start_date.isoformat()} al {end_date.isoformat()}"
        source_note = " (sesiones vía Microsoft Graph)" if used_graph_for_sessions else ""
        if added == 0:
            detail = (
                f"No hay elementos nuevos por importar: los {skipped} elementos {range_label} "
                "ya estaban en tu bandeja de captura."
            )
        else:
            detail = (f"Se importaron {added} elementos nuevos {range_label} "
                       f"({mode_label.lower()}){source_note}.")
            if skipped:
                detail += f" ({skipped} ya estaban importados y se omitieron)."
        if warning:
            detail += f"\n\nAviso: {warning}"
        messagebox.showinfo(APP_TITLE, detail)

    def _refresh_inbox(self):
        for row in self.inbox_tree.get_children():
            self.inbox_tree.delete(row)

        search = self.inbox_search_entry.get().strip().lower() if hasattr(self, "inbox_search_entry") else ""

        for t in db.get_tasks(self.user["id"], status="pendiente"):
            if search:
                haystack = " ".join([
                    t["title"] or "", t["category"] or "", t.get("description") or "",
                ]).lower()
                if search not in haystack:
                    continue
            captured = _format_datetime_display(t["created_at"])
            self.inbox_tree.insert("", "end", values=(
                t["id"], t["title"], t["category"], t.get("description") or "",
                t["status"], captured
            ))

    def _edit_selected_task(self):
        task_id = self._get_selected_task_id(self.inbox_tree)
        if task_id is None:
            return
        task = db.get_task(task_id)
        if task is None:
            return

        win = tk.Toplevel(self)
        win.title("Editar actividad")
        win.configure(bg=COLOR_BG_PANEL)
        win.geometry("460x380")
        win.resizable(False, False)
        win.transient(self)
        win.grab_set()

        pad = ttk.Frame(win, style="Panel.TFrame", padding=20)
        pad.pack(fill="both", expand=True)

        ttk.Label(pad, text="Actividad / tarea:").pack(anchor="w")
        title_entry = ttk.Entry(pad, width=48)
        title_entry.insert(0, task["title"])
        title_entry.pack(anchor="w", pady=(0, 10), fill="x")

        ttk.Label(pad, text="Categoría:").pack(anchor="w")
        cat_combo = ttk.Combobox(pad, values=TASK_CATEGORIES, state="readonly", width=28)
        cat_combo.set(task["category"] if task["category"] in TASK_CATEGORIES else "Manual")
        cat_combo.pack(anchor="w", pady=(0, 10))

        ttk.Label(pad, text="Estado:").pack(anchor="w")
        status_combo = ttk.Combobox(pad, values=["pendiente", "hecho", "descartado"],
                                     state="readonly", width=20)
        status_combo.set(task["status"])
        status_combo.pack(anchor="w", pady=(0, 10))

        ttk.Label(pad, text="Descripción:").pack(anchor="w")
        desc_text = tk.Text(pad, height=4, wrap="word")
        style_text_widget(desc_text)
        desc_text.insert("1.0", task.get("description") or "")
        desc_text.pack(fill="x", pady=(0, 14))

        def save_and_close():
            db.update_task_fields(
                task_id,
                title=title_entry.get(),
                category=cat_combo.get(),
                status=status_combo.get(),
                description=desc_text.get("1.0", "end").strip(),
            )
            self._refresh_inbox()
            win.destroy()

        btns = ttk.Frame(pad, style="Panel.TFrame")
        btns.pack(fill="x")
        ttk.Button(btns, text="Guardar cambios", command=save_and_close).pack(side="left")
        ttk.Button(btns, text="Cancelar", style="Secondary.TButton",
                   command=win.destroy).pack(side="right")

    def _get_selected_task_id(self, tree):
        sel = tree.selection()
        if not sel:
            messagebox.showinfo(APP_TITLE, "Selecciona primero una tarea de la lista.")
            return None
        return tree.item(sel[0])["values"][0]

    def _get_selected_task_ids(self, tree):
        sel = tree.selection()
        if not sel:
            messagebox.showinfo(APP_TITLE, "Selecciona primero una o varias tareas de la lista.")
            return []
        return [tree.item(row)["values"][0] for row in sel]

    def _extend_inbox_selection_down(self, event=None):
        return self._extend_tree_selection(self.inbox_tree, direction=1)

    def _extend_inbox_selection_up(self, event=None):
        return self._extend_tree_selection(self.inbox_tree, direction=-1)

    def _extend_tree_selection(self, tree, direction):
        """Ctrl+flecha abajo/arriba: agrega la siguiente/anterior fila a la selección
        actual (selección múltiple acumulativa), sin perder lo ya seleccionado."""
        children = tree.get_children()
        if not children:
            return "break"

        focus = tree.focus()
        current_index = children.index(focus) if focus in children else -1
        next_index = current_index + direction
        next_index = max(0, min(next_index, len(children) - 1))
        next_item = children[next_index]

        current_selection = list(tree.selection())
        if next_item not in current_selection:
            current_selection.append(next_item)
        tree.selection_set(current_selection)
        tree.focus(next_item)
        tree.see(next_item)
        return "break"

    def _mark_task_done(self):
        task_ids = self._get_selected_task_ids(self.inbox_tree)
        if not task_ids:
            return
        for task_id in task_ids:
            db.set_task_status(task_id, "hecho")
        self._refresh_inbox()

    def _delete_inbox_item(self):
        task_ids = self._get_selected_task_ids(self.inbox_tree)
        if not task_ids:
            return
        if len(task_ids) > 1:
            if not messagebox.askyesno(
                APP_TITLE, f"¿Eliminar las {len(task_ids)} actividades seleccionadas?"
            ):
                return
        for task_id in task_ids:
            db.delete_task(task_id)
        self._refresh_inbox()

    def _delete_all_inbox(self):
        all_tasks = db.get_tasks(self.user["id"])
        if not all_tasks:
            messagebox.showinfo(APP_TITLE, "Tu bandeja de captura ya está vacía.")
            return

        confirm1 = messagebox.askyesno(
            APP_TITLE,
            f"ADVERTENCIA: esto borrará PERMANENTEMENTE las {len(all_tasks)} actividades de tu bandeja "
            "de captura (incluyendo las ya marcadas como hechas o descartadas). "
            "Esta acción no se puede deshacer.\n\n¿Deseas continuar?",
            icon="warning",
        )
        if not confirm1:
            return

        confirm2 = messagebox.askyesno(
            APP_TITLE,
            "Última confirmación: ¿estás totalmente seguro de borrar TODA tu bandeja de captura?",
            icon="warning",
        )
        if not confirm2:
            return

        db.delete_all_tasks(self.user["id"])
        self._refresh_inbox()
        messagebox.showinfo(APP_TITLE, "Se borró toda la bandeja de captura.")

    # ------------------------------------------------------------------
    # TAB 2: Time Blocking
    # ------------------------------------------------------------------
    def _build_blocks_tab(self):
        frame = ttk.Frame(self.tab_blocks, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Registro de tiempo por bloques", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text="Tu calendario como base de datos: registra qué hiciste, cuándo y en qué categoría.",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 10))

        # --- Vincular con una tarea de la Bandeja de captura ---
        link_frame = ttk.Frame(frame)
        link_frame.pack(fill="x", pady=(0, 10))
        ttk.Label(link_frame, text="Vincular con tarea de la bandeja (opcional):").grid(
            row=0, column=0, sticky="w")
        self.block_task_map = {}
        self.block_task_combo = ttk.Combobox(link_frame, values=[], width=55, state="readonly")
        self.block_task_combo.grid(row=1, column=0, padx=(0, 10), sticky="w")
        self.block_task_combo.bind("<<ComboboxSelected>>", self._on_block_task_selected)
        ttk.Button(link_frame, text="Actualizar tareas", style="Secondary.TButton",
                   command=self._refresh_block_task_options).grid(row=1, column=1, padx=(0, 10))
        self.block_mark_done_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(link_frame, text="Marcar la tarea como hecha al registrar el bloque",
                         variable=self.block_mark_done_var).grid(row=1, column=2, sticky="w")

        form = ttk.Frame(frame)
        form.pack(fill="x", pady=(0, 12))

        today = datetime.date.today().isoformat()

        ttk.Label(form, text="Fecha (YYYY-MM-DD):").grid(row=0, column=0, sticky="w")
        self.block_date_entry = ttk.Entry(form, width=14)
        self.block_date_entry.insert(0, today)
        self.block_date_entry.grid(row=1, column=0, padx=(0, 10), sticky="w")

        ttk.Label(form, text="Inicio (HH:MM):").grid(row=0, column=1, sticky="w")
        self.block_start_entry = ttk.Entry(form, width=10)
        self.block_start_entry.insert(0, "09:00")
        self.block_start_entry.grid(row=1, column=1, padx=(0, 10), sticky="w")

        ttk.Label(form, text="Fin (HH:MM):").grid(row=0, column=2, sticky="w")
        self.block_end_entry = ttk.Entry(form, width=10)
        self.block_end_entry.insert(0, "10:00")
        self.block_end_entry.grid(row=1, column=2, padx=(0, 10), sticky="w")

        ttk.Label(form, text="Categoría:").grid(row=0, column=3, sticky="w")
        self.block_cat_combo = ttk.Combobox(form, values=CATEGORIES_DEFAULT, width=18)
        self.block_cat_combo.set(CATEGORIES_DEFAULT[0])
        self.block_cat_combo.grid(row=1, column=3, padx=(0, 10), sticky="w")

        ttk.Label(form, text="Descripción:").grid(row=0, column=4, sticky="w")
        self.block_title_entry = ttk.Entry(form, width=28)
        self.block_title_entry.grid(row=1, column=4, padx=(0, 10), sticky="w")

        ttk.Button(form, text="Registrar bloque", command=self._add_time_block).grid(row=1, column=5)

        cols = ("id", "date", "start_time", "end_time", "duration", "category", "title")
        self.blocks_tree = ttk.Treeview(frame, columns=cols, show="headings", height=15)
        headers = [("id", "ID", 40), ("date", "Fecha", 90), ("start_time", "Inicio", 60),
                   ("end_time", "Fin", 60), ("duration", "Min", 60),
                   ("category", "Categoría", 140), ("title", "Descripción", 260)]
        for c, label, w in headers:
            self.blocks_tree.heading(c, text=label)
            self.blocks_tree.column(c, width=w, anchor="w", stretch=False)
        enable_column_sorting(self.blocks_tree)
        add_scrollbar(frame, self.blocks_tree).pack(fill="both", expand=True, pady=(6, 6))

        ttk.Button(frame, text="Eliminar bloque seleccionado", command=self._delete_block).pack(anchor="w")

        self._refresh_block_task_options()
        self._refresh_blocks()

    def _refresh_block_task_options(self):
        """Repuebla el combo de 'vincular con tarea' con las tareas pendientes de la bandeja."""
        tasks = db.get_tasks(self.user["id"], status="pendiente")
        self.block_task_map = {}
        labels = ["(Ninguna — bloque libre)"]
        for t in tasks:
            label = f"#{t['id']} · {t['title']} ({t['category']})"
            labels.append(label)
            self.block_task_map[label] = t
        self.block_task_combo.configure(values=labels)
        if not self.block_task_combo.get():
            self.block_task_combo.set(labels[0])

    def _on_block_task_selected(self, event=None):
        selected = self.block_task_map.get(self.block_task_combo.get())
        if not selected:
            return
        # Solo autocompleta la descripción si está vacía, para no pisar lo que el usuario ya escribió.
        if not self.block_title_entry.get().strip():
            self.block_title_entry.insert(0, selected["title"])

    def _parse_hhmm(self, s):
        return datetime.datetime.strptime(s.strip(), "%H:%M")

    def _add_time_block(self):
        date_str = self.block_date_entry.get().strip()
        start_str = self.block_start_entry.get().strip()
        end_str = self.block_end_entry.get().strip()
        category = self.block_cat_combo.get().strip() or "General"
        title = self.block_title_entry.get().strip()

        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
            t_start = self._parse_hhmm(start_str)
            t_end = self._parse_hhmm(end_str)
        except ValueError:
            messagebox.showerror(APP_TITLE, "Revisa el formato de fecha (YYYY-MM-DD) y horas (HH:MM).")
            return

        duration = (t_end - t_start).total_seconds() / 60
        if duration <= 0:
            messagebox.showerror(APP_TITLE, "La hora de fin debe ser posterior a la de inicio.")
            return

        linked_task = self.block_task_map.get(self.block_task_combo.get())
        task_id = linked_task["id"] if linked_task else None

        db.add_time_block(self.user["id"], category, title, date_str, start_str, end_str,
                           duration, task_id=task_id)

        if linked_task and self.block_mark_done_var.get():
            db.set_task_status(linked_task["id"], "hecho")

        self.block_title_entry.delete(0, "end")
        self._refresh_block_task_options()
        self.block_task_combo.set("(Ninguna — bloque libre)")
        self._refresh_blocks()
        if linked_task:
            self._refresh_inbox()

    def _refresh_blocks(self):
        for row in self.blocks_tree.get_children():
            self.blocks_tree.delete(row)
        for b in db.get_time_blocks(self.user["id"], limit=300):
            self.blocks_tree.insert("", "end", values=(
                b["id"], b["date"], b["start_time"], b["end_time"],
                round(b["duration_minutes"]), b["category"], b["title"] or ""
            ))

    def _delete_block(self):
        sel = self.blocks_tree.selection()
        if not sel:
            messagebox.showinfo(APP_TITLE, "Selecciona un bloque de la lista.")
            return
        block_id = self.blocks_tree.item(sel[0])["values"][0]
        db.delete_time_block(block_id)
        self._refresh_blocks()

    # ------------------------------------------------------------------
    # TAB 3: Priorización (Eisenhower + MoSCoW)
    # ------------------------------------------------------------------
    def _build_priority_tab(self):
        frame = ttk.Frame(self.tab_priority, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Priorización: Matriz Eisenhower y MoSCoW",
                  font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text="Selecciona una tarea de tu bandeja y asígnale un cuadrante y una categoría MoSCoW.",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 10))

        top = ttk.Frame(frame)
        top.pack(fill="x", pady=(0, 10))

        cols = ("id", "title", "category", "eisenhower", "moscow")
        self.priority_tree = ttk.Treeview(top, columns=cols, show="headings", height=12)
        headers = [("id", "ID", 40), ("title", "Actividad", 300), ("category", "Categoría", 130),
                   ("eisenhower", "Eisenhower", 220), ("moscow", "MoSCoW", 100)]
        for c, label, w in headers:
            self.priority_tree.heading(c, text=label)
            self.priority_tree.column(c, width=w, anchor="w", stretch=False)
        add_scrollbar(top, self.priority_tree).pack(fill="both", expand=True)

        controls = ttk.Frame(frame)
        controls.pack(fill="x", pady=(10, 0))

        ttk.Label(controls, text="Cuadrante Eisenhower:").grid(row=0, column=0, sticky="w")
        self.eisenhower_combo = ttk.Combobox(controls, values=list(EISENHOWER_LABELS.values()), width=38)
        self.eisenhower_combo.grid(row=1, column=0, padx=(0, 10), sticky="w")

        ttk.Label(controls, text="MoSCoW:").grid(row=0, column=1, sticky="w")
        self.moscow_combo = ttk.Combobox(controls, values=list(MOSCOW_LABELS.values()), width=24)
        self.moscow_combo.grid(row=1, column=1, padx=(0, 10), sticky="w")

        ttk.Button(controls, text="Guardar priorización", command=self._save_priority).grid(row=1, column=2)
        ttk.Button(controls, text="Actualizar lista", command=self._refresh_priority).grid(row=1, column=3, padx=(10, 0))

        self._refresh_priority()

    def _refresh_priority(self):
        for row in self.priority_tree.get_children():
            self.priority_tree.delete(row)
        for t in db.get_tasks(self.user["id"], status="pendiente"):
            eis = EISENHOWER_LABELS.get(t["eisenhower"], "") if t["eisenhower"] else ""
            mos = t["moscow"] or ""
            self.priority_tree.insert("", "end", values=(t["id"], t["title"], t["category"], eis, mos))

    def _save_priority(self):
        sel = self.priority_tree.selection()
        if not sel:
            messagebox.showinfo(APP_TITLE, "Selecciona una tarea de la lista.")
            return
        task_id = self.priority_tree.item(sel[0])["values"][0]

        eis_label = self.eisenhower_combo.get().strip()
        mos_label = self.moscow_combo.get().strip()

        eis_key = next((k for k, v in EISENHOWER_LABELS.items() if v == eis_label), None)
        mos_key = next((k for k, v in MOSCOW_LABELS.items() if v == mos_label), None)

        if eis_key is None and mos_key is None:
            messagebox.showinfo(APP_TITLE, "Elige al menos un cuadrante Eisenhower o una categoría MoSCoW.")
            return

        db.update_task_priority(task_id, eisenhower=eis_key, moscow=mos_key)
        self._refresh_priority()

    # ------------------------------------------------------------------
    # TAB Kanban personal (Capítulo 12 y Apéndice D del libro)
    # ------------------------------------------------------------------
    def _build_kanban_tab(self):
        frame = ttk.Frame(self.tab_kanban, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Kanban personal", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame,
                  text="Visualiza tu flujo de trabajo en columnas. \"En progreso\" tiene un límite "
                       f"recomendado de {KANBAN_WIP_LIMIT} tarjetas a la vez (WIP limit).",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 12))

        board = ttk.Frame(frame)
        board.pack(fill="both", expand=True)

        self.kanban_listboxes = {}
        self.kanban_count_labels = {}
        for i, stage in enumerate(KANBAN_STAGES):
            board.columnconfigure(i, weight=1)
            col = ttk.Frame(board, style="Panel.TFrame", padding=8)
            col.grid(row=0, column=i, sticky="nsew", padx=4)

            count_label = ttk.Label(col, text=stage, font=("Segoe UI", 10, "bold"))
            count_label.pack(anchor="w")
            self.kanban_count_labels[stage] = count_label

            listbox = tk.Listbox(col, height=18, exportselection=False, activestyle="none")
            style_listbox_widget(listbox)
            listbox.pack(fill="both", expand=True, pady=(6, 0))
            self.kanban_listboxes[stage] = listbox

        board.rowconfigure(0, weight=1)

        move_frame = ttk.Frame(frame)
        move_frame.pack(fill="x", pady=(12, 0))
        ttk.Label(move_frame, text="Mover tarjeta seleccionada a:").pack(side="left", padx=(0, 8))
        self.kanban_target_combo = ttk.Combobox(move_frame, values=KANBAN_STAGES,
                                                  state="readonly", width=18)
        self.kanban_target_combo.pack(side="left", padx=(0, 8))
        ttk.Button(move_frame, text="Mover", command=self._move_kanban_selected).pack(side="left")
        ttk.Button(move_frame, text="Actualizar tablero", style="Secondary.TButton",
                   command=self._refresh_kanban).pack(side="right")

        self._refresh_kanban()

    def _refresh_kanban(self):
        tasks = db.get_tasks(self.user["id"], status="pendiente")
        by_stage = {stage: [] for stage in KANBAN_STAGES}
        for t in tasks:
            stage = t.get("kanban_stage") or "Backlog"
            if stage not in by_stage:
                stage = "Backlog"
            by_stage[stage].append(t)

        self.kanban_task_by_row = {stage: [] for stage in KANBAN_STAGES}
        for stage in KANBAN_STAGES:
            listbox = self.kanban_listboxes[stage]
            listbox.delete(0, "end")
            for t in by_stage[stage]:
                listbox.insert("end", f"#{t['id']} · {t['title']}")
                self.kanban_task_by_row[stage].append(t["id"])

            count = len(by_stage[stage])
            label_text = stage
            if stage == "En progreso":
                label_text += f"  ({count}/{KANBAN_WIP_LIMIT})"
                if count > KANBAN_WIP_LIMIT:
                    self.kanban_count_labels[stage].configure(foreground=COLOR_DANGER)
                else:
                    self.kanban_count_labels[stage].configure(foreground=COLOR_TEXT)
            else:
                label_text += f"  ({count})"
                self.kanban_count_labels[stage].configure(foreground=COLOR_TEXT)
            self.kanban_count_labels[stage].configure(text=label_text)

    def _get_kanban_selection(self):
        for stage in KANBAN_STAGES:
            listbox = self.kanban_listboxes[stage]
            sel = listbox.curselection()
            if sel:
                task_id = self.kanban_task_by_row[stage][sel[0]]
                return task_id, stage
        return None, None

    def _move_kanban_selected(self):
        task_id, current_stage = self._get_kanban_selection()
        if task_id is None:
            messagebox.showinfo(APP_TITLE, "Selecciona primero una tarjeta de alguna columna.")
            return
        target = self.kanban_target_combo.get()
        if not target:
            messagebox.showinfo(APP_TITLE, "Elige a qué columna quieres mover la tarjeta.")
            return
        if target == "En progreso":
            current_count = len(self.kanban_task_by_row.get("En progreso", []))
            if current_stage != "En progreso" and current_count >= KANBAN_WIP_LIMIT:
                if not messagebox.askyesno(
                    APP_TITLE,
                    f"\"En progreso\" ya tiene {current_count} tarjetas (límite recomendado: "
                    f"{KANBAN_WIP_LIMIT}). El libro sugiere terminar algo antes de empezar más. "
                    "¿Moverla de todos modos?"
                ):
                    return
        db.set_kanban_stage(task_id, target)
        self._refresh_kanban()

    # ------------------------------------------------------------------
    # TAB 4: Dashboard
    # ------------------------------------------------------------------
    def _build_dashboard_tab(self):
        frame = ttk.Frame(self.tab_dashboard, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Dashboard de productividad", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text="Tu tiempo es un dataset. Aquí lo ves resumido.",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 10))

        self.dashboard_summary_label = ttk.Label(frame, text="", foreground=COLOR_TEXT)
        self.dashboard_summary_label.pack(anchor="w", pady=(0, 4))

        self.dashboard_pareto_label = ttk.Label(frame, text="", style="Muted.TLabel", wraplength=900,
                                                 justify="left")
        self.dashboard_pareto_label.pack(anchor="w", pady=(0, 10))

        self.dashboard_chart_container = ttk.Frame(frame)
        self.dashboard_chart_container.pack(fill="both", expand=True)

        ttk.Button(frame, text="Actualizar dashboard", command=self._refresh_dashboard).pack(anchor="e", pady=(8, 0))

    def _build_pareto_insight(self, by_category, total_minutes):
        """Principio 80/20 (Pareto), Capítulo 16 del libro: identifica qué pocas
        categorías concentran la mayor parte de tu tiempo, en vez de mirar
        métricas de vanidad (número de bloques, por ejemplo)."""
        if not by_category or total_minutes <= 0:
            return ""

        sorted_cats = sorted(by_category.items(), key=lambda kv: -kv[1])
        cumulative = 0
        vital_few = []
        for cat, minutes in sorted_cats:
            cumulative += minutes
            vital_few.append(cat)
            if cumulative / total_minutes >= 0.8:
                break

        pct_categorias = round(100 * len(vital_few) / len(sorted_cats))
        return (
            f"Análisis 80/20 (Pareto): el {pct_categorias}% de tus categorías "
            f"({', '.join(vital_few)}) concentra ~80% de tu tiempo registrado. "
            "Revisa si eso coincide con lo que de verdad importa (Capítulo 16)."
        )

    def _refresh_dashboard(self):
        for widget in self.dashboard_chart_container.winfo_children():
            widget.destroy()

        blocks = db.get_time_blocks(self.user["id"])
        if not blocks:
            self.dashboard_summary_label.config(text="Aún no tienes bloques de tiempo registrados.")
            self.dashboard_pareto_label.config(text="")
            ttk.Label(self.dashboard_chart_container,
                      text="Registra bloques en la pestaña 'Time Blocking' o usa el Pomodoro para ver tu dashboard aquí.",
                      style="Muted.TLabel").pack(pady=40)
            return

        total_minutes = sum(b["duration_minutes"] for b in blocks)
        hours = total_minutes / 60

        by_category = {}
        by_day = {}
        for b in blocks:
            by_category[b["category"]] = by_category.get(b["category"], 0) + b["duration_minutes"]
            by_day[b["date"]] = by_day.get(b["date"], 0) + b["duration_minutes"]

        top_day = max(by_day.items(), key=lambda kv: kv[1]) if by_day else ("-", 0)
        top_category = max(by_category.items(), key=lambda kv: kv[1]) if by_category else ("-", 0)

        self.dashboard_summary_label.config(
            text=(f"Total registrado: {hours:.1f} h en {len(blocks)} bloques  |  "
                  f"Categoría con más tiempo: {top_category[0]} ({top_category[1]/60:.1f} h)  |  "
                  f"Día más productivo: {top_day[0]} ({top_day[1]/60:.1f} h)")
        )

        # Análisis 80/20 (Pareto) — Capítulo 16: métricas que importan, no las de vanidad.
        self.dashboard_pareto_label.config(text=self._build_pareto_insight(by_category, total_minutes))

        if not MATPLOTLIB_OK:
            ttk.Label(self.dashboard_chart_container,
                      text="Instala matplotlib para ver gráficas: pip install matplotlib",
                      foreground="red").pack(pady=40)
            return

        fig = Figure(figsize=(9, 4.2), dpi=100, facecolor=COLOR_BG)

        def _style_axes(ax):
            ax.set_facecolor(COLOR_BG_PANEL)
            for spine in ax.spines.values():
                spine.set_color(COLOR_BORDER)
            ax.tick_params(colors=COLOR_TEXT_MUTED)
            ax.title.set_color(COLOR_TEXT)
            ax.yaxis.label.set_color(COLOR_TEXT_MUTED)
            ax.xaxis.label.set_color(COLOR_TEXT_MUTED)
            ax.grid(color=COLOR_BORDER, linestyle="--", linewidth=0.5, alpha=0.5)

        ax1 = fig.add_subplot(1, 2, 1)
        cats = list(by_category.keys())
        vals = [round(by_category[c] / 60, 2) for c in cats]
        ax1.bar(cats, vals, color=COLOR_ACCENT)
        ax1.set_title("Horas por categoría")
        ax1.set_ylabel("Horas")
        ax1.tick_params(axis="x", rotation=35, labelsize=8)
        _style_axes(ax1)

        ax2 = fig.add_subplot(1, 2, 2)
        days_sorted = sorted(by_day.items())[-10:]  # últimos 10 días con datos
        day_labels = [d for d, _ in days_sorted]
        day_vals = [round(v / 60, 2) for _, v in days_sorted]
        ax2.plot(day_labels, day_vals, marker="o", color=COLOR_ACCENT2)
        ax2.set_title("Horas por día (últimos registros)")
        ax2.set_ylabel("Horas")
        ax2.tick_params(axis="x", rotation=45, labelsize=8)
        _style_axes(ax2)

        fig.tight_layout()

        canvas = FigureCanvasTkAgg(fig, master=self.dashboard_chart_container)
        canvas.draw()
        canvas.get_tk_widget().pack(fill="both", expand=True)

    # ------------------------------------------------------------------
    # TAB 5: Revisión semanal guiada
    # ------------------------------------------------------------------
    def _build_review_tab(self):
        scroll_root = make_scrollable(self.tab_review)
        frame = ttk.Frame(scroll_root, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Revisión semanal guiada", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text="La revisión periódica es la práctica más determinante del sistema. Tómate 10 minutos.",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 10))

        form = ttk.Frame(frame)
        form.pack(fill="x")

        self.review_entries = {}
        for key, question in REVIEW_QUESTIONS:
            ttk.Label(form, text=question, wraplength=850, font=("Segoe UI", 10, "bold")).pack(
                anchor="w", pady=(10, 2))
            text_widget = tk.Text(form, height=3, wrap="word")
            style_text_widget(text_widget)
            text_widget.pack(fill="x")
            self.review_entries[key] = text_widget

        ttk.Button(frame, text="Guardar revisión de esta semana",
                   command=self._save_review).pack(anchor="w", pady=(14, 10))

        ttk.Separator(frame).pack(fill="x", pady=8)
        ttk.Label(frame, text="Historial de revisiones", font=("Segoe UI", 11, "bold")).pack(anchor="w")
        ttk.Label(frame, text="Doble clic en una revisión para ver todas las respuestas completas.",
                  style="Muted.TLabel", font=("Segoe UI", 8)).pack(anchor="w", pady=(0, 4))

        cols = ("id", "date", "q1", "q4")
        self.review_tree = ttk.Treeview(frame, columns=cols, show="headings", height=8)
        headers = [("id", "ID", 40), ("date", "Fecha", 100), ("q1", "Logro principal", 350),
                   ("q4", "Ajuste para la próxima semana", 350)]
        for c, label, w in headers:
            self.review_tree.heading(c, text=label)
            self.review_tree.column(c, width=w, anchor="w", stretch=False)
        enable_column_sorting(self.review_tree)
        self.review_tree.bind("<Double-1>", lambda e: self._show_review_detail())
        add_scrollbar(frame, self.review_tree).pack(fill="both", expand=True, pady=(6, 6))

        ttk.Button(frame, text="Ver detalle completo",
                   command=self._show_review_detail).pack(anchor="w")

        self._refresh_review_history()

    def _save_review(self):
        answers = {key: widget.get("1.0", "end").strip() for key, widget in self.review_entries.items()}
        if not any(answers.values()):
            messagebox.showinfo(APP_TITLE, "Responde al menos una pregunta antes de guardar.")
            return
        today = datetime.date.today().isoformat()
        db.add_review(self.user["id"], today, answers)
        messagebox.showinfo(APP_TITLE, "Revisión guardada. ¡Buen hábito!")
        for widget in self.review_entries.values():
            widget.delete("1.0", "end")
        self._refresh_review_history()

    def _refresh_review_history(self):
        for row in self.review_tree.get_children():
            self.review_tree.delete(row)
        for r in db.get_reviews(self.user["id"]):
            self.review_tree.insert("", "end", values=(
                r["id"], r["review_date"], (r["q1"] or "")[:80], (r["q4"] or "")[:80]))

    def _show_review_detail(self):
        sel = self.review_tree.selection()
        if not sel:
            messagebox.showinfo(APP_TITLE, "Selecciona primero una revisión del historial.")
            return
        review_id = self.review_tree.item(sel[0])["values"][0]
        review = db.get_review(review_id)
        if review is None:
            return

        win = tk.Toplevel(self)
        win.title(f"Revisión del {review['review_date']}")
        win.configure(bg=COLOR_BG_PANEL)
        win.geometry("560x520")
        win.transient(self)
        win.grab_set()

        pad = ttk.Frame(win, style="Panel.TFrame", padding=20)
        pad.pack(fill="both", expand=True)

        ttk.Label(pad, text=f"Revisión del {review['review_date']}",
                  font=("Segoe UI", 13, "bold")).pack(anchor="w", pady=(0, 12))

        # El botón se empaca antes (side="bottom") para reservar su espacio; si el
        # área con scroll se empacara primero, reclamaría todo el espacio disponible
        # y el botón quedaría tapado o sin lugar (mismo detalle que con las tablas).
        bottom_bar = ttk.Frame(pad, style="Panel.TFrame")
        bottom_bar.pack(side="bottom", fill="x", pady=(10, 0))
        ttk.Button(bottom_bar, text="Cerrar", style="Secondary.TButton",
                   command=win.destroy).pack(anchor="e")

        inner = make_scrollable(pad)
        content = ttk.Frame(inner, style="Panel.TFrame")
        content.pack(fill="both", expand=True)

        for key, question in REVIEW_QUESTIONS:
            ttk.Label(content, text=question, font=("Segoe UI", 10, "bold"),
                      wraplength=480, justify="left").pack(anchor="w", pady=(10, 2))
            answer = review.get(key) or "(sin responder)"
            ttk.Label(content, text=answer, wraplength=480, justify="left").pack(anchor="w")

    # ------------------------------------------------------------------
    # TAB 6: Pomodoro
    # ------------------------------------------------------------------
    def _build_pomodoro_tab(self):
        frame = ttk.Frame(self.tab_pomodoro, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Pomodoro", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text="25 minutos de enfoque, 5 de descanso. Cada sesión de enfoque se guarda como bloque de tiempo.",
                  style="Muted.TLabel").pack(anchor="w", pady=(0, 16))

        config_frame = ttk.Frame(frame)
        config_frame.pack(pady=(0, 10))

        ttk.Label(config_frame, text="Categoría de la sesión:").grid(row=0, column=0, padx=(0, 8))
        cat_combo = ttk.Combobox(config_frame, values=CATEGORIES_DEFAULT, textvariable=self.pomo_category, width=20)
        cat_combo.grid(row=0, column=1)

        self.pomo_label = ttk.Label(frame, text="25:00", font=("Segoe UI", 48, "bold"),
                                     foreground=COLOR_ACCENT)
        self.pomo_label.pack(pady=10)

        self.pomo_status_label = ttk.Label(frame, text="Listo para enfocarte", style="Muted.TLabel")
        self.pomo_status_label.pack()

        btns = ttk.Frame(frame)
        btns.pack(pady=16)
        self.pomo_start_btn = ttk.Button(btns, text="Iniciar enfoque (25 min)", command=self._start_pomo_focus)
        self.pomo_start_btn.grid(row=0, column=0, padx=6)
        self.pomo_break_btn = ttk.Button(btns, text="Iniciar descanso (5 min)", command=self._start_pomo_break)
        self.pomo_break_btn.grid(row=0, column=1, padx=6)
        self.pomo_stop_btn = ttk.Button(btns, text="Detener", command=self._stop_pomo, state="disabled")
        self.pomo_stop_btn.grid(row=0, column=2, padx=6)

    def _start_pomo_focus(self):
        self._start_pomo(25 * 60, "focus")

    def _start_pomo_break(self):
        self._start_pomo(5 * 60, "break")

    def _start_pomo(self, seconds, mode):
        if self.pomo_running:
            messagebox.showinfo(APP_TITLE, "Ya hay un temporizador corriendo.")
            return
        self.pomo_seconds_left = seconds
        self.pomo_mode = mode
        self.pomo_running = True
        self.pomo_start_dt = datetime.datetime.now()
        self.pomo_status_label.config(
            text="Enfocado en: " + self.pomo_category.get() if mode == "focus" else "En descanso")
        self.pomo_stop_btn.config(state="normal")
        self.pomo_start_btn.config(state="disabled")
        self.pomo_break_btn.config(state="disabled")
        self._tick_pomo()

    def _tick_pomo(self):
        if not self.pomo_running:
            return
        mins, secs = divmod(self.pomo_seconds_left, 60)
        self.pomo_label.config(text=f"{mins:02d}:{secs:02d}")

        if self.pomo_seconds_left <= 0:
            self._finish_pomo()
            return

        self.pomo_seconds_left -= 1
        self.after(1000, self._tick_pomo)

    def _finish_pomo(self):
        self.pomo_running = False
        self.pomo_stop_btn.config(state="disabled")
        self.pomo_start_btn.config(state="normal")
        self.pomo_break_btn.config(state="normal")

        end_dt = datetime.datetime.now()
        if self.pomo_mode == "focus" and self.pomo_start_dt is not None:
            duration = (end_dt - self.pomo_start_dt).total_seconds() / 60
            db.add_time_block(
                self.user["id"],
                self.pomo_category.get() or "General",
                "Sesión Pomodoro",
                self.pomo_start_dt.date().isoformat(),
                self.pomo_start_dt.strftime("%H:%M"),
                end_dt.strftime("%H:%M"),
                duration,
                source="pomodoro",
            )
            self.pomo_status_label.config(text="¡Sesión de enfoque completada y registrada!")
            messagebox.showinfo(APP_TITLE, "Pomodoro de enfoque terminado. Se registró como bloque de tiempo.")
        else:
            self.pomo_status_label.config(text="Descanso terminado. Listo para otra sesión.")
            messagebox.showinfo(APP_TITLE, "Descanso terminado.")

        self.pomo_label.config(text="25:00")

    def _stop_pomo(self):
        self.pomo_running = False
        self.pomo_stop_btn.config(state="disabled")
        self.pomo_start_btn.config(state="normal")
        self.pomo_break_btn.config(state="normal")
        self.pomo_status_label.config(text="Temporizador detenido manualmente (no se registró el bloque).")
        self.pomo_label.config(text="25:00")

    # ------------------------------------------------------------------
    # TAB 7: Asistente IA
    # ------------------------------------------------------------------
    def _build_ai_tab(self):
        scroll_root = make_scrollable(self.tab_ai)
        frame = ttk.Frame(scroll_root, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Asistente IA", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        ttk.Label(frame,
                  text="Analiza tus tareas, tus horas registradas y tu última revisión semanal, "
                       "y te da sugerencias concretas de cómo organizar tu semana (Capítulo 13 del libro).",
                  style="Muted.TLabel", wraplength=900, justify="left").pack(anchor="w", pady=(0, 14))

        # --- Configuración de API key ---
        key_frame = ttk.Frame(frame)
        key_frame.pack(fill="x", pady=(0, 6))

        ttk.Label(key_frame, text="Tu API key de Anthropic:").grid(row=0, column=0, sticky="w")
        self.ai_key_entry = ttk.Entry(key_frame, width=50, show="•")
        self.ai_key_entry.grid(row=1, column=0, padx=(0, 10), sticky="w")

        existing_key = db.get_api_key(self.user["id"])
        if existing_key:
            self.ai_key_entry.insert(0, existing_key)

        ttk.Button(key_frame, text="Guardar API key", style="Secondary.TButton",
                   command=self._save_ai_key).grid(row=1, column=1)

        self.ai_key_status_label = ttk.Label(
            frame,
            text=("Ya tienes una API key guardada." if existing_key
                  else "Aún no has guardado tu API key. Consíguela en console.anthropic.com."),
            style="Muted.TLabel")
        self.ai_key_status_label.pack(anchor="w", pady=(2, 14))

        ttk.Separator(frame).pack(fill="x", pady=(0, 14))

        # --- Botón de análisis ---
        self.ai_analyze_btn = ttk.Button(frame, text="Analizar mi semana y darme sugerencias",
                                          command=self._run_ai_analysis)
        self.ai_analyze_btn.pack(anchor="w")

        self.ai_loading_label = ttk.Label(frame, text="", style="Muted.TLabel")
        self.ai_loading_label.pack(anchor="w", pady=(6, 0))

        ttk.Label(frame, text="Sugerencias:", font=("Segoe UI", 10, "bold")).pack(anchor="w", pady=(16, 4))

        self.ai_output_text = tk.Text(frame, height=16, wrap="word", state="disabled")
        style_text_widget(self.ai_output_text)
        self.ai_output_text.pack(fill="both", expand=True)

    def _save_ai_key(self):
        key = self.ai_key_entry.get().strip()
        if not key:
            messagebox.showwarning(APP_TITLE, "Pega tu API key antes de guardar.")
            return
        db.save_api_key(self.user["id"], key)
        self.ai_key_status_label.config(text="Listo: API key guardada correctamente en este equipo.")
        messagebox.showinfo(APP_TITLE, "API key guardada. Ya puedes usar el análisis con IA.")

    def _run_ai_analysis(self):
        api_key = db.get_api_key(self.user["id"])
        if not api_key:
            messagebox.showinfo(APP_TITLE, "Primero guarda tu API key de Anthropic arriba.")
            return

        tasks = db.get_tasks(self.user["id"])
        time_blocks = db.get_time_blocks(self.user["id"])
        reviews = db.get_reviews(self.user["id"])
        latest_review = reviews[0] if reviews else None

        summary = ai.build_summary(tasks, time_blocks, latest_review)

        self.ai_analyze_btn.config(state="disabled")
        self.ai_loading_label.config(text="Analizando con IA… esto puede tardar unos segundos.")
        self.update_idletasks()

        import threading

        def worker():
            text, error = ai.ask_claude(api_key, summary)
            self.after(0, lambda: self._on_ai_result(text, error))

        threading.Thread(target=worker, daemon=True).start()

    def _on_ai_result(self, text, error):
        self.ai_analyze_btn.config(state="normal")
        self.ai_loading_label.config(text="")

        self.ai_output_text.config(state="normal")
        self.ai_output_text.delete("1.0", "end")
        if error:
            self.ai_output_text.insert("1.0", "Aviso: " + error)
            messagebox.showinfo(APP_TITLE, error)
        else:
            self.ai_output_text.insert("1.0", text)
        self.ai_output_text.config(state="disabled")


def run_app(force_login=True):
    db.init_db()
    auth = AuthWindow()
    auth.mainloop()
    if auth.user is None:
        return  # usuario cerró la ventana sin iniciar sesión
    main_app = MainApp(auth.user)
    main_app.mainloop()


if __name__ == "__main__":
    run_app()
