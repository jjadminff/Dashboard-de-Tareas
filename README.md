# 🗂️ Dashboard de Tareas

📊 Un proyecto de tablero web interactivo que combina **Node.js**, **Express**, **SQLite** y **JavaScript** para gestionar tareas y subtareas de forma fácil, rápida y local, ideal para correr en una **Raspberry Pi** o en cualquier equipo local.

---

## 🛠️ Tecnologías principales

| Componente        | Tecnología      | Función Principal                           |
|-------------------|------------------|---------------------------------------------|
| 💻 Backend        | Node.js + Express | Servidor que maneja peticiones HTTP y API REST |
| 🗃️ Base de Datos | SQLite            | Almacenamiento local ligero y rápido       |
| 🌐 Frontend      | HTML / CSS / JS   | Interfaz gráfica del tablero web           |

---

## ⚙️ 1️⃣ Tipo de servidor

Tu proyecto utiliza un **servidor Node.js con Express**:

- 🟢 **Node.js:** Entorno de ejecución JavaScript del lado del servidor.  
- 🚀 **Express.js:** Framework que simplifica la creación de endpoints HTTP (ej.: `/api/tasks`, `/api/subtasks`).

🔧 **En tu proyecto:**

- Node.js escucha en un puerto HTTP (por ejemplo, `3000`).
- Recibe solicitudes `GET`, `POST`, `PUT`, `DELETE` y responde con **JSON**.
- Sirve archivos estáticos (**HTML, CSS, JS**) que conforman el dashboard.

---

## 🗄️ 2️⃣ Base de datos

El sistema utiliza **SQLite**, ideal para proyectos embebidos o de bajo consumo:

- 📁 Base de datos local basada en archivos (ej.: `database.db`).
- 📌 Tabla `tasks`: almacena tareas principales.
- 📌 Tabla `subtasks`: almacena subtareas, relacionadas mediante `taskId`.

✅ **Ventajas:**

- Ligera y sin configuración compleja.  
- Todo se guarda en un único archivo.  
- Perfecta para Raspberry Pi o entornos pequeños.

---

## 🖥️ 3️⃣ Frontend

El **dashboard web** corre directamente en el navegador:

- 📄 Archivos: `index.html`, `style.css`, `script.js`.
- 📡 El frontend utiliza `fetch()` para comunicarse con el backend.
- 🧩 Interacción 100% en el navegador:  
  - Agregar tareas y subtareas  
  - Drag & Drop  
  - Marcar completadas  
  - Cambiar prioridades  

---

## 🔄 4️⃣ Comunicación entre componentes

```text
[ 🌐 Navegador ] <-- HTTP/JSON --> [ 🖥️ Node.js + Express ] <-- SQL --> [ 🗃️ SQLite ]

🧭 El navegador muestra el tablero y envía acciones (crear tarea, marcar completada, etc.).

⚙️ Node.js procesa las acciones y actualiza la base de datos.

🔁 El navegador renderiza los cambios en tiempo real.

📡 5️⃣ Dónde corre todo

🛜 En tu configuración actual:

🖥️ Node.js + Express + SQLite: Corren en la Raspberry Pi como servicio (projects-dashboard.service).

🌍 Dashboard Web: Accesible desde cualquier dispositivo de la misma red.

📌 Tu Raspberry Pi actúa como servidor + base de datos, mientras que el navegador solo consume la interfaz.

🌟 Bonus: Ventajas de esta arquitectura

✅ 100% local: No requiere servicios externos.
📱 Acceso desde cualquier dispositivo: Solo necesitas la IP y el puerto.
🛠️ Fácil mantenimiento: Todos los datos en un único archivo SQLite.
⚡ Rápido y eficiente: Respuestas inmediatas dentro de la red local.

📬 Contacto / Autor

👤 Tu nombre o usuario de GitHub
📧 Correo (opcional)
🌐 Perfil de GitHub

💡 Tip: Puedes extender este README agregando secciones de instalación, ejemplos de uso o capturas de pantalla para hacerlo aún más profesional.


---

¿Quieres que lo mejore aún más con:  
- 🧪 Sección de instalación paso a paso  
- 📁 Estructura del proyecto  
- 📷 Capturas de pantalla  

? (Esto lo haría ver como un README ⭐⭐⭐⭐ de proyecto profesional en GitHub). Si sí, dime cuál de esas secciones quieres que agregue y lo hacemos.

