# Guía completa: de cero a tu sitio en línea 🚀

Esta guía asume que **no sabes nada** de desarrollo web. Síguela en orden.

---

## Parte 1 — Instala las herramientas (solo una vez)

### 1.1 Node.js
Es el motor que ejecuta el sitio en tu computadora.

1. Ve a https://nodejs.org
2. Descarga la versión **LTS** (el botón verde grande).
3. Instala con todo por defecto (siguiente, siguiente, siguiente).
4. Verifica: abre una terminal (en Windows busca "PowerShell") y escribe:
   ```
   node --version
   ```
   Si ves algo como `v22.x.x`, listo.

### 1.2 Git
Es el sistema que "sube" tus cambios a internet.

1. Ve a https://git-scm.com/downloads e instala (todo por defecto).
2. Verifica en la terminal:
   ```
   git --version
   ```

### 1.3 Cuentas gratuitas
- **GitHub** (guarda tu código): https://github.com/signup
- **Vercel** (publica tu sitio): https://vercel.com/signup → elige **"Continue with GitHub"** para conectarlas desde el inicio.

### 1.4 Un editor de código (recomendado)
Descarga **Visual Studio Code**: https://code.visualstudio.com — es donde editarás tus notas y páginas.

---

## Parte 2 — Corre el sitio en tu computadora

1. Descomprime la carpeta `jesus-site` donde quieras (ej. Documentos).
2. Abre la terminal **dentro de esa carpeta**:
   - Windows: abre la carpeta en el Explorador, clic derecho → "Abrir en Terminal".
   - O en VS Code: File → Open Folder → selecciona `jesus-site`, luego Terminal → New Terminal.
3. Instala las dependencias (solo la primera vez, tarda 1-2 min):
   ```
   npm install
   ```
4. Enciende el sitio:
   ```
   npm run dev
   ```
5. Abre tu navegador en **http://localhost:3000** 🎉

Para apagarlo: en la terminal presiona `Ctrl + C`.

> 💡 Mientras `npm run dev` está corriendo, **cualquier cambio que guardes se refleja al instante** en el navegador. Así es como editarás todo.

---

## Parte 3 — Publica el sitio en internet (Vercel)

### 3.1 Sube el código a GitHub

En la terminal, dentro de la carpeta del proyecto:

```
git init
git add .
git commit -m "Primera versión de mi sitio"
```

Luego crea el repositorio en GitHub:
1. Ve a https://github.com/new
2. Nombre: `mi-sitio` (o el que quieras). Déjalo **Private** si prefieres.
3. NO marques ninguna casilla extra. Clic en **Create repository**.
4. GitHub te mostrará comandos. Copia los de "push an existing repository":
   ```
   git remote add origin https://github.com/TU-USUARIO/mi-sitio.git
   git branch -M main
   git push -u origin main
   ```
   (La primera vez te pedirá iniciar sesión en GitHub.)

### 3.2 Conecta Vercel

1. Ve a https://vercel.com/new
2. Verás tu repositorio `mi-sitio` en la lista → clic en **Import**.
3. No cambies nada (Vercel detecta Next.js solo) → clic en **Deploy**.
4. Espera ~1 minuto. Te dará una URL tipo `mi-sitio.vercel.app`. **Tu sitio ya está en línea.** ✅

> A partir de aquí, **cada vez que hagas `git push`, Vercel republica el sitio automáticamente**. No tienes que volver a tocar Vercel nunca.

---

## Parte 4 — ⭐ Cómo publicar una nota nueva (lo harás siempre)

Cada nota es un archivo `.md` (Markdown) dentro de `content/blog/`.

### Paso 1: crea el archivo

Crea `content/blog/mi-nueva-nota.md` (el nombre del archivo será la URL: `/blog/mi-nueva-nota`). Usa minúsculas, sin espacios ni acentos, con guiones.

### Paso 2: copia esta plantilla

```markdown
---
titulo: "El título de mi nota"
fecha: "2026-07-15"
categoria: "snowflake"
resumen: "Una o dos frases que aparecen en la lista del blog."
---

Aquí empieza el contenido. Escribe normal.

## Un subtítulo

Puedes usar **negritas**, *cursivas*, [enlaces](https://ejemplo.com) y listas:

- Punto uno
- Punto dos

Y bloques de código:

```sql
SELECT * FROM mi_tabla;
```
```

**Categorías válidas** (usa exactamente estas palabras en `categoria:`):

| Escribe esto      | Aparece como        |
|-------------------|---------------------|
| ingenieria-de-datos | Ingeniería de Datos |
| snowflake         | Snowflake           |
| arquitectura      | Arquitectura        |
| ia                | IA                  |
| oxxo              | OXXO                |
| opinion           | Opinión             |

### Paso 3: revisa en local (opcional pero recomendado)

Con `npm run dev` corriendo, entra a http://localhost:3000/blog y verifica que se vea bien.

### Paso 4: publica

```
git add .
git commit -m "Nueva nota: el título de mi nota"
git push
```

En ~1 minuto Vercel actualiza el sitio solo. **Eso es todo.** 🎉

---

## Parte 5 — Personaliza el resto

| Quiero cambiar…              | Edita este archivo                     |
|------------------------------|----------------------------------------|
| Texto de la página de inicio | `app/page.js`                          |
| Página "Sobre mí"            | `app/sobre-mi/page.js`                 |
| Mi CV en PDF                 | Reemplaza `public/cv/cv.pdf` por tu PDF real (mismo nombre) |
| Lista de proyectos           | `content/proyectos.js`                 |
| Email / LinkedIn / GitHub    | `app/contacto/page.js` (arriba del archivo) |
| Nombre en el encabezado      | `components/Header.js` (busca "jesus_datos") |
| Colores y estilos            | `app/globals.css` (variables al inicio) |
| Título del sitio (pestaña)   | `app/layout.js` (sección `metadata`)   |
| Categorías del blog          | `lib/posts.js` (objeto `CATEGORIAS`)   |

Después de cualquier cambio: `git add .` → `git commit -m "descripción"` → `git push`.

---

## Parte 6 — Problemas comunes

- **"npm no se reconoce como comando"** → Node.js no está instalado o hay que cerrar y reabrir la terminal.
- **La nota no aparece** → revisa que el archivo termine en `.md`, esté en `content/blog/`, y que el frontmatter tenga las tres rayitas `---` arriba y abajo.
- **Error de fecha** → usa siempre el formato `"AAAA-MM-DD"` entre comillas.
- **Vercel marca error al desplegar** → corre `npm run build` en tu computadora; el mensaje de error te dirá qué archivo tiene el problema.
- **Quiero un dominio propio** (ej. `jesus.mx`) → en Vercel: tu proyecto → Settings → Domains. Compra el dominio donde quieras y sigue las instrucciones.
