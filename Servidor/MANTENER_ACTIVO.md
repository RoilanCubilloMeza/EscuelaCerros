# 🔥 Cómo mantener Render activo 24/7

## ⚠️ Problema

Render Free Tier suspende el servicio después de **15 minutos de inactividad**.

## ✅ Soluciones

### **Opción 1: Upgrade a Plan Paid ($7/mes) - RECOMENDADO**

#### Ventajas:
- ✅ Nunca se suspende
- ✅ Respuesta instantánea
- ✅ 750 horas CPU/mes
- ✅ Sin "cold starts"
- ✅ Mejor para producción

#### Cómo hacerlo:
1. Ve a https://dashboard.render.com
2. Selecciona tu servicio: `escuelacerros`
3. Settings → Plan → **Upgrade to Starter** ($7/mes)

---

### **Opción 2: Servicio Keep-Alive GRATIS**

#### A) UptimeRobot (Recomendado para free tier)

**Paso 1:** Regístrate en https://uptimerobot.com

**Paso 2:** Add New Monitor
```
Monitor Type: HTTP(s)
Friendly Name: Escuela Cerros API
URL: https://escuelacerros.onrender.com/health
Monitoring Interval: 5 minutes
```

**Paso 3:** Save Monitor

✅ **Resultado**: Tu API recibirá un ping cada 5 minutos y nunca se suspenderá.

---

#### B) Cron-job.org (Alternativa)

**Paso 1:** Regístrate en https://cron-job.org

**Paso 2:** Create cronjob
```
Title: Keep Render Alive
URL: https://escuelacerros.onrender.com/health
Schedule: */5 * * * * (Every 5 minutes)
```

**Paso 3:** Enable cronjob

---

#### C) Koyeb (Alternativa de hosting - Sin suspensión)

Si prefieres cambiar de hosting:

**Ventajas:**
- ✅ 512 MB RAM gratis
- ✅ No se suspende por inactividad
- ✅ Deploy desde GitHub
- ✅ SSL gratis

**Sitio:** https://koyeb.com

---

### **Opción 3: Crear tu propio script Keep-Alive**

Si tienes un servidor/PC encendido 24/7, puedes crear un script:

#### **keep-alive.js** (Node.js)
```javascript
const https = require('https');

const API_URL = 'https://escuelacerros.onrender.com/health';
const INTERVAL = 14 * 60 * 1000; // 14 minutos

function ping() {
  https.get(API_URL, (res) => {
    console.log(`[${new Date().toLocaleString()}] Ping exitoso - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleString()}] Error:`, err.message);
  });
}

// Ping inicial
ping();

// Ping cada 14 minutos
setInterval(ping, INTERVAL);

console.log('✅ Keep-Alive iniciado. Haciendo ping cada 14 minutos...');
```

**Ejecutar:**
```bash
node keep-alive.js
```

---

## 🎯 Recomendación por caso de uso

| Situación | Solución Recomendada |
|-----------|---------------------|
| 🏫 **Producción (escuela real)** | **Plan Paid de Render** ($7/mes) |
| 🧪 **Desarrollo/Testing** | **UptimeRobot gratis** |
| 💰 **Sin presupuesto** | **UptimeRobot + Cron-job** (doble seguridad) |
| 🔄 **Migrar hosting** | **Koyeb** (gratis sin suspensión) |

---

## 📊 Endpoints disponibles para ping

Usa cualquiera de estos en tu servicio de keep-alive:

```
✅ https://escuelacerros.onrender.com/health
✅ https://escuelacerros.onrender.com/
✅ https://escuelacerros.onrender.com/obtenerEventos
```

**Recomendado:** `/health` (es el más ligero)

---

## 🔍 Verificar que funciona

Después de configurar UptimeRobot o Cron-job:

1. Espera 20 minutos sin usar la app
2. Abre https://escuela-cerros.vercel.app
3. Si carga rápido (< 2 segundos) → ✅ Funciona
4. Si tarda 30-60 segundos → ❌ El servidor se suspendió

---

## 🆘 Troubleshooting

### Problema: "Sigue suspendiéndose"
**Solución:** 
- Verifica que el intervalo sea < 15 minutos
- Usa `/health` en lugar de endpoints pesados
- Considera usar 2 servicios (UptimeRobot + Cron-job)

### Problema: "Demasiadas solicitudes"
**Solución:**
- Aumenta el intervalo a 10 minutos
- Render Free permite tráfico ilimitado

### Problema: "Me cobran dinero"
**Solución:**
- UptimeRobot Free: 50 monitores gratis
- Cron-job.org: 100% gratis
- Solo Render Paid cuesta $7/mes

---

## 💡 Tip Final

Para una escuela real en producción, **paga los $7/mes de Render**. 
Es más barato que:
- ☕ Un café Starbucks
- 🍕 Una pizza
- 🎮 Un skin de videojuego

Y garantiza que los profesores y estudiantes **siempre** tengan acceso instantáneo al sistema.

---

## 📅 Actualizado
Octubre 2025
