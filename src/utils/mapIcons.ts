import L from 'leaflet';

// Crear ícono personalizado para la posición del usuario
export const userIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3B82F6;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
}); 