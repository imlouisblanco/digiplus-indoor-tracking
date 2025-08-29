# DigiPlus Indoor Tracking System

Sistema de monitoreo en tiempo real de personas y activos en espacios interiores, diseñado para integrarse con proveedores externos de tracking GPS.

## 🚀 Características

- **Tracking en Tiempo Real**: Monitoreo continuo de la ubicación de personas
- **Mapa Interactivo**: Visualización en tiempo real usando OpenStreetMap
- **Sistema de Alarmas**: Detección y notificación de eventos críticos
- **Panel de Control**: Gestión centralizada del sistema
- **Lista de Personas**: Vista detallada de todos los usuarios trackeados
- **Simulación de Datos**: Sistema de prueba para desarrollo y demostración
- **API Externa**: Preparado para integración con proveedores reales

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **React Leaflet** - Integración de mapas
- **Tailwind CSS** - Framework de estilos
- **JavaScript ES6+** - Lógica de aplicación

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/digiplus-indoor-tracking.git
   cd digiplus-indoor-tracking
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Arquitectura del Sistema

### Componentes Principales

- **`TrackingMap`**: Mapa interactivo con marcadores en tiempo real
- **`PeopleList`**: Lista de personas siendo trackeadas
- **`ControlPanel`**: Panel de control y estadísticas
- **`trackingService`**: Servicio que simula la API del proveedor

### Flujo de Datos

1. **Proveedor Externo** → Envía datos GPS de las tarjetas
2. **API del Proveedor** → Proporciona JSON con posiciones
3. **trackingService** → Consume y procesa los datos
4. **Componentes React** → Muestran la información en tiempo real

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_MAP_CENTER_LAT=19.4326
NEXT_PUBLIC_MAP_CENTER_LNG=-99.1332
NEXT_PUBLIC_MAP_ZOOM=18
NEXT_PUBLIC_UPDATE_INTERVAL=5000
```

### Personalización del Mapa

Editar `app/components/TrackingMap.js`:
```javascript
const mapCenter = [19.4326, -99.1332]; // Coordenadas del centro
const defaultZoom = 18; // Nivel de zoom inicial
```

## 📡 Integración con Proveedor Externo

### Estructura JSON Esperada

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "position": [19.4326, -99.1332],
      "status": "active",
      "lastUpdate": "2024-01-15T10:30:00Z",
      "department": "Desarrollo",
      "cardId": "CARD001",
      "battery": 85
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "provider": "Nombre del Proveedor"
}
```

### Implementación Real

Reemplazar en `app/services/trackingService.js`:
```javascript
export const fetchTrackingData = async () => {
  const response = await fetch('https://api.tuproveedor.com/positions');
  const data = await response.json();
  return data;
};
```

## 🎮 Funcionalidades de Simulación

### Simulación de Movimiento
- Las personas se mueven aleatoriamente en el mapa
- Actualización cada 5 segundos
- Movimiento realista dentro de coordenadas específicas

### Simulación de Alarmas
- Botón para generar alarmas aleatorias
- Cambio automático de estado
- Notificaciones visuales en tiempo real

### Simulación de Batería
- Niveles de batería que cambian gradualmente
- Indicadores visuales de estado
- Alertas de batería baja

## 📱 Características de la UI

### Diseño Responsivo
- Adaptable a diferentes tamaños de pantalla
- Layout optimizado para desktop y móvil
- Navegación intuitiva

### Indicadores Visuales
- **Verde**: Persona activa y segura
- **Rojo**: Alarma o emergencia
- **Azul**: Estado neutral o información

### Interacciones
- Click en marcadores para detalles
- Hover effects en elementos interactivos
- Transiciones suaves y animaciones

## 🔍 Uso del Sistema

### 1. Visualización del Mapa
- El mapa se centra automáticamente en la ubicación configurada
- Los marcadores muestran la posición actual de cada persona
- Click en un marcador para ver información detallada

### 2. Panel de Control
- Estadísticas en tiempo real
- Controles de actualización
- Simulación de eventos

### 3. Lista de Personas
- Vista completa de todos los usuarios
- Filtros por estado y departamento
- Selección para centrar en el mapa

## 🚨 Sistema de Alarmas

### Tipos de Alarma
- **Alarma de Emergencia**: Estado crítico (rojo)
- **Alarma de Batería**: Batería baja
- **Alarma de Ubicación**: Fuera de zona permitida

### Notificaciones
- Cambio visual inmediato en el mapa
- Indicadores en la lista de personas
- Sonidos de alerta (configurable)

## 📊 Monitoreo y Estadísticas

### Métricas en Tiempo Real
- Total de personas trackeadas
- Personas activas vs. en alarma
- Promedio de batería del sistema
- Última actualización de datos

### Histórico
- Registro de movimientos
- Historial de alarmas
- Tendencias de uso

## 🔒 Seguridad y Privacidad

### Protección de Datos
- Encriptación de comunicaciones
- Autenticación de usuarios
- Logs de auditoría
- Cumplimiento GDPR

### Acceso y Permisos
- Roles de usuario configurables
- Acceso restringido por área
- Registro de actividades

## 🚀 Despliegue

### Producción
```bash
npm run build
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Pruebas Unitarias
```bash
npm test
```

### Pruebas de Integración
```bash
npm run test:integration
```

### Pruebas E2E
```bash
npm run test:e2e
```

## 📈 Roadmap

### Versión 1.1
- [ ] Integración con múltiples proveedores
- [ ] Sistema de notificaciones push
- [ ] Dashboard avanzado con gráficos

### Versión 1.2
- [ ] Tracking de activos (no solo personas)
- [ ] Geofencing y zonas restringidas
- [ ] API REST para integraciones externas

### Versión 2.0
- [ ] Machine Learning para predicción de movimientos
- [ ] Análisis de patrones de comportamiento
- [ ] Integración con sistemas de seguridad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Soporte

- **Email**: soporte@digiplus.com
- **Documentación**: [docs.digiplus.com](https://docs.digiplus.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/digiplus-indoor-tracking/issues)

## 🙏 Agradecimientos

- OpenStreetMap por los mapas
- React Leaflet por la integración de mapas
- Tailwind CSS por el framework de estilos
- La comunidad de Next.js por el framework

---

**DigiPlus Indoor Tracking System** - Transformando la forma en que monitoreamos espacios interiores.
