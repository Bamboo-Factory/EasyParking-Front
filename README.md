# EasyParking - Sistema de Gestión de Estacionamientos

EasyParking es una aplicación web moderna para la gestión y reserva de estacionamientos. Permite a los usuarios encontrar, reservar y gestionar espacios de estacionamiento de manera eficiente.

## Características Principales

- 🗺️ Búsqueda de estacionamientos con geolocalización
- 📍 Visualización de estacionamientos en mapa interactivo
- 🚗 Registro de nuevos estacionamientos
- ⏰ Sistema de reservas con selección de horarios
- 💳 Cálculo automático de precios
- 📱 Diseño responsive y moderno

## Tecnologías Utilizadas

- React 19
- TypeScript
- Tailwind CSS
- React Router
- Leaflet (mapas)
- Axios
- Heroicons

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Backend API funcionando (ver configuración)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/easyparking-front.git
cd easyparking-front
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
VITE_API_URL=http://localhost:3000/api
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── pages/         # Páginas principales
  ├── services/      # Servicios y llamadas a API
  ├── types/         # Definiciones de tipos
  └── utils/         # Utilidades y helpers
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm run lint` - Ejecuta el linter

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@example.com

Link del Proyecto: [https://github.com/tu-usuario/easyparking-front](https://github.com/tu-usuario/easyparking-front)
