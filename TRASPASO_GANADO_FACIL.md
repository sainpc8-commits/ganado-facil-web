# 🐂 PROYECTO: GANADO FÁCIL WEB - TRASPASO ACTUALIZADO

## 🛠️ ENTORNO ACTUAL
- **Frontend:** React 19 + Vite + Tailwind CSS (en `C:\Users\EQUIPO\ganado-facil-web`)
- **Backend:** Node.js + Express (en la carpeta `server`)
- **Base de Datos:** PostgreSQL alojado en Neon.tech (Cloud)
- **Autenticación:** JWT real (JSON Web Tokens) + Bcrypt.
- **Conexión:** El Frontend hace `fetch` a `http://localhost:3000/api/...`

## ✅ LO QUE YA ESTÁ CONSTRUIDO Y FUNCIONANDO (100% Nube)
1. **Backend Completo:** Rutas de Auth, Bloques, Animales, Pesos, Sanidad y Alimentación.
2. **Login/Registro Real:** El botón "Crear Cuenta" funciona y guarda en PostgreSQL.
3. **Bloques:** CRUD completo conectado a la base de datos.
4. **Animales:** CRUD completo conectado a la base de datos.
5. **Pesos, Sanidad y Alimentación:** Se guardan en la nube.
6. **Fechas blindadas:** El backend usa `TO_CHAR` de PostgreSQL para enviar fechas como texto y evitar pantallas verdes.

## 🚧 CÓMO ENCENDER EL PROYECTO (Para la próxima vez)
Se necesitan **DOS** ventanas de PowerShell:
1. **Backend:** `cd C:\Users\EQUIPO\ganado-facil-web\server` -> `node src/index.js`
2. **Frontend:** `cd C:\Users\EQUIPO\ganado-facil-web` -> `npm run dev`
*(Abrir el navegador en localhost:5173)*

## ⏳ LO QUE FALTA PARA EL FUTURO (Hoja de Ruta)
1. **Alimentación por Bloque:** Actualmente es solo por animal. Falta darle comida a todo un lote de una vez.
2. **Refactorizar App.jsx:** Dividir el monolito en componentes (ej. `<ListaAnimales />`, `<ModalPeso />`).
3. **Despliegue (Deploy):** Subir el Frontend a Vercel y el Backend a Render para que funcione en internet.
4. **Backup en la nube:** El botón de "Exportar JSON" sigue funcionando en local, pero se podría mejorar.

## 🎯 INSTRUCCIONES PARA LA NUEVA IA
"Estamos retomando el proyecto Ganado Fácil Web. Ya terminamos la migración completa a PostgreSQL en Neon y el backend en Express está funcionando. 
**Mi siguiente objetivo es:** [Escribe aquí lo que quieras hacer después: Ej. 'Desplegar la app en Vercel', 'Refactorizar App.jsx', o 'Hacer la alimentación por bloque']."