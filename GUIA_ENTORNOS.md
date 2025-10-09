# 🔄 Guía: Cambiar Entre Desarrollo Local y Producción

## 📋 Dos Modos de Trabajo

### 🏠 Modo 1: Desarrollo Local (Todo en tu computadora)

**Cuándo usar:** Cuando estás desarrollando y probando cambios localmente.

**Configuración:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Base de datos: Aiven Cloud (compartida)

**Pasos:**

1. **Configurar `.env` para local:**
   ```properties
   # Cliente/.env
   REACT_APP_API_URL=http://localhost:3001
   ```

2. **Iniciar el backend local:**
   ```powershell
   cd Servidor
   node index.js
   ```
   
   Deberías ver:
   ```
   ✅ Pool de conexiones configurado correctamente
   Servidor corriendo en el puerto 3001
   ✓ Tabla Profesores verificada/creada exitosamente
   ✓ Tabla Matricula_Notas verificada/creada
   ✓ Columnas extendidas (Profesor_Id, Grado_Id) detectadas
   ```

3. **Iniciar el frontend (en otra terminal):**
   ```powershell
   cd Cliente
   npm start
   ```

4. **Abrir en el navegador:**
   - http://localhost:3000

**Ventajas:**
- ✅ Puedes hacer cambios en el backend y ver resultados inmediatos
- ✅ Puedes debuggear el código del servidor
- ✅ No dependes de internet para Render

**Desventajas:**
- ❌ Debes tener ambos servidores corriendo
- ❌ Consume recursos de tu computadora

---

### 🌐 Modo 2: Desarrollo con Backend de Render

**Cuándo usar:** Cuando solo quieres trabajar en el frontend y no necesitas modificar el backend.

**Configuración:**
- Frontend: `http://localhost:3000`
- Backend: `https://escuelacerros.onrender.com` (en la nube)
- Base de datos: Aiven Cloud (compartida)

**Pasos:**

1. **Configurar `.env` para Render:**
   ```properties
   # Cliente/.env
   REACT_APP_API_URL=https://escuelacerros.onrender.com
   ```

2. **Iniciar SOLO el frontend:**
   ```powershell
   cd Cliente
   npm start
   ```

3. **Abrir en el navegador:**
   - http://localhost:3000

**Ventajas:**
- ✅ No necesitas correr el backend local
- ✅ Usa el backend de producción (más real)
- ✅ Menos recursos consumidos

**Desventajas:**
- ❌ No puedes hacer cambios en el backend
- ❌ Si Render está "dormido", la primera carga es lenta (30 segundos)
- ❌ Dependes de internet

---

### 🚀 Modo 3: Producción Total (Vercel + Render)

**Cuándo usar:** Para probar cómo funcionará en producción o para usuarios finales.

**Configuración:**
- Frontend: `https://escuela-cerros.vercel.app/` (Vercel)
- Backend: `https://escuelacerros.onrender.com` (Render)
- Base de datos: Aiven Cloud (compartida)

**Pasos:**

1. **Configurar variable de entorno en Vercel:**
   - Ve a: https://vercel.com/dashboard
   - Selecciona "escuela-cerros"
   - Settings → Environment Variables
   - Agrega: `REACT_APP_API_URL=https://escuelacerros.onrender.com`
   - Marca para **Production**

2. **Hacer commit y push:**
   ```powershell
   git add .
   git commit -m "Cambios en el frontend"
   git push origin main
   ```

3. **Vercel despliega automáticamente**
   - Espera 1-2 minutos
   - Vercel detecta el push y despliega

4. **Abrir en el navegador:**
   - https://escuela-cerros.vercel.app/

**Ventajas:**
- ✅ Es la configuración real que verán los usuarios
- ✅ No necesitas correr nada localmente
- ✅ Puedes compartir el link con otros
- ✅ HTTPS seguro

**Desventajas:**
- ❌ Cada cambio requiere commit y esperar deployment
- ❌ Más lento para probar cambios rápidos

---

## 🔄 Cómo Cambiar Rápidamente

### Cambiar de Local a Render:

**Opción A: Editar .env**
```properties
# Cliente/.env
# Comenta la línea local y descomenta la de Render
# REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_URL=https://escuelacerros.onrender.com
```

**Luego reinicia el frontend:**
```powershell
# Presiona Ctrl+C en la terminal del frontend
npm start
```

**Opción B: Variable de entorno en la línea de comandos** (Windows PowerShell)
```powershell
$env:REACT_APP_API_URL="https://escuelacerros.onrender.com"; npm start
```

---

### Cambiar de Render a Local:

**Editar .env:**
```properties
# Cliente/.env
REACT_APP_API_URL=http://localhost:3001
# REACT_APP_API_URL=https://escuelacerros.onrender.com
```

**No olvides iniciar el backend:**
```powershell
cd Servidor
node index.js
```

**Reinicia el frontend:**
```powershell
# Presiona Ctrl+C en la terminal del frontend
npm start
```

---

## 📊 Tabla Comparativa

| Característica | Local | Render | Vercel+Render |
|----------------|-------|--------|---------------|
| Frontend | localhost:3000 | localhost:3000 | escuela-cerros.vercel.app |
| Backend | localhost:3001 | escuelacerros.onrender.com | escuelacerros.onrender.com |
| Ejecutar backend local | ✅ Sí | ❌ No | ❌ No |
| Ejecutar frontend local | ✅ Sí | ✅ Sí | ❌ No |
| Velocidad desarrollo | ⚡ Rápida | ⚡ Rápida | 🐢 Lenta (deploy) |
| Debug backend | ✅ Sí | ❌ No | ❌ No |
| Requiere internet | ⚠️ Solo para DB | ✅ Sí | ✅ Sí |
| Para usuarios finales | ❌ No | ❌ No | ✅ Sí |

---

## 💡 Recomendación

**Para desarrollo diario:**
```
Modo Local → Hacer cambios → Probar
```

**Antes de hacer commit:**
```
Modo Render → Probar que funcione con backend de producción
```

**Después de hacer push:**
```
Modo Vercel+Render → Verificar que todo funcione en producción
```

---

## 🆘 Troubleshooting

### Frontend no se conecta al backend local
**Causa:** El backend no está corriendo
**Solución:** Ejecuta `node index.js` en la carpeta Servidor

### Frontend muestra error de CORS con localhost
**Causa:** El backend no tiene configurado CORS para localhost
**Solución:** Ya está configurado. Reinicia el backend.

### Frontend sigue usando la URL antigua después de cambiar .env
**Causa:** React no detectó el cambio
**Solución:** Presiona Ctrl+C y ejecuta `npm start` de nuevo

### Render responde lento (30 segundos)
**Causa:** El servicio estaba "dormido" (free tier)
**Solución:** Es normal la primera vez. Las siguientes peticiones serán rápidas.

---

## 📝 Checklist Antes de Hacer Push

- [ ] El código funciona en **Modo Local** (localhost:3001)
- [ ] El código funciona con **Modo Render** (escuelacerros.onrender.com)
- [ ] El archivo `.env` está en **.gitignore** (no se sube a GitHub)
- [ ] Hiciste commit de los cambios
- [ ] Hiciste push a GitHub
- [ ] Esperaste que Vercel desplegara (1-2 min)
- [ ] Probaste en **Modo Vercel+Render** (producción)

---

## 🎯 Configuración Actual Recomendada

```properties
# Cliente/.env (para desarrollo local)
REACT_APP_API_URL=http://localhost:3001

# Vercel Environment Variables (para producción)
REACT_APP_API_URL=https://escuelacerros.onrender.com
```

**Recuerda:** El archivo `.env` es solo para tu desarrollo local. Vercel tiene sus propias variables de entorno configuradas en el dashboard.

---

**¡Con esta guía podrás cambiar fácilmente entre entornos según lo que necesites!** 🚀
