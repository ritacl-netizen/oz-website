# El Secreto de la Ciudad Esmeralda - Website

Un sitio web inmersivo y responsive para el musical infantil "El Secreto de la Ciudad Esmeralda" por Ophelias - Compañía de Teatro.

## 🎭 Sobre el Proyecto

Este sitio web está inspirado en la estética steampunk y el mundo mágico de OZ, creado para promocionar el nuevo musical de Ophelias, los creadores de "Alicia en el País de las Maravillas" (ganadora de 7 Premios Florencio).

### Características Principales

- **Diseño Steampunk**: Paleta de colores esmeralda, dorado y cobre con elementos mecánicos animados
- **Totalmente Responsive**: Optimizado para desktop, tablet y móvil
- **Experiencia Inmersiva**: Animaciones suaves, efectos de paralaje y transiciones elegantes
- **SEO Optimizado**: Meta tags, estructura semántica y performance optimizada
- **Accesibilidad**: Navegación por teclado, focus management y contraste adecuado

### Secciones del Sitio

1. **Hero**: Presentación principal con call-to-actions
2. **Sobre el Show**: Descripción del musical y su estética única
3. **Personajes**: Galería de los personajes principales
4. **Equipo**: Información del equipo creativo
5. **Entradas**: Información de fechas y venta (placeholder)
6. **Galería**: Espacio para fotos y videos (placeholder)
7. **Contacto**: Formulario de contacto funcional
8. **Footer**: Links sociales y información adicional

## 🚀 Instalación y Hosting

### Opción 1: GitHub Pages (Recomendado)

#### Pasos para hospedar en GitHub Pages:

1. **Crear repositorio en GitHub**:
   ```bash
   # Crear nuevo repositorio en GitHub llamado 'oz-musical-website'
   # Inicializar repositorio local
   git init
   git add .
   git commit -m "Initial commit: El Secreto de la Ciudad Esmeralda website"
   git branch -M main
   git remote add origin https://github.com/USUARIO/oz-musical-website.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**:
   - Ve a Settings > Pages en tu repositorio
   - En "Source", selecciona "Deploy from a branch"
   - Selecciona "main" branch y "/ (root)" folder
   - Click "Save"
   - Tu site estará disponible en: `https://USUARIO.github.io/oz-musical-website/`

3. **Dominio personalizado (oselmusical.com)**:
   - Compra el dominio `oselmusical.com`
   - Crea un archivo `CNAME` en la raíz del proyecto:
     ```
     oselmusical.com
     ```
   - En tu proveedor de DNS, configura:
     ```
     Type: CNAME
     Name: www
     Value: USUARIO.github.io
     
     Type: A
     Name: @
     Value: 185.199.108.153
     Value: 185.199.109.153
     Value: 185.199.110.153
     Value: 185.199.111.153
     ```
   - En GitHub Pages settings, agrega `oselmusical.com` en "Custom domain"
   - Habilita "Enforce HTTPS"

### Opción 2: Netlify

1. **Deploy directo**:
   - Arrastra la carpeta `oz-website` a [Netlify Drop](https://app.netlify.com/drop)
   - O conecta tu repositorio de GitHub para deploys automáticos

2. **Dominio personalizado**:
   - En Netlify dashboard: Site settings > Domain management
   - Add custom domain: `oselmusical.com`
   - Configura DNS según las instrucciones de Netlify

### Opción 3: Hosting Tradicional

1. **Subir archivos**:
   - Sube todos los archivos a la carpeta public_html de tu hosting
   - Asegúrate de que `index.html` esté en la raíz

2. **Configuración del dominio**:
   - Apunta el dominio a la IP de tu hosting
   - Configura SSL/HTTPS

## 🛠️ Personalización

### Colores y Temas

Los colores están definidos en `:root` en `css/style.css`:

```css
:root {
    --emerald-primary: #2d5f3f;
    --emerald-secondary: #4a7c59;
    --emerald-light: #7fb069;
    --emerald-glow: #50c878;
    --gold: #d4af37;
    --copper: #b87333;
}
```

### Contenido

- **Textos**: Edita directamente en `index.html`
- **Metadatos SEO**: Actualiza las meta tags en el `<head>`
- **Imágenes**: Agrega imágenes en la carpeta `images/` y actualiza referencias

### Funcionalidades Pendientes

1. **Galería de imágenes**: Reemplazar placeholder con imágenes reales
2. **Sistema de tickets**: Integrar con plataforma de venta de entradas
3. **Blog/Noticias**: Agregar sección de noticias del musical
4. **Newsletter**: Integrar con servicio de email marketing
5. **Formulario de contacto**: Conectar con backend/servicio de email

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop**: 1200px y superior
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## ⚡ Performance

### Optimizaciones Incluidas

- **CSS/JS minificado**: Para producción
- **Lazy loading**: Para imágenes futuras
- **Debounced scroll events**: Para mejor performance
- **Optimized animations**: Solo cuando es necesario
- **CDN fonts**: Google Fonts optimizado

### Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🔧 Desarrollo Local

Para trabajar localmente:

```bash
# Usar cualquier servidor local, por ejemplo:
npx serve .
# o
python -m http.server 8000
# o
php -S localhost:8000
```

Luego abrir http://localhost:8000

## 📋 Lista de Tareas Post-Launch

### Contenido
- [ ] Agregar fotos profesionales del equipo
- [ ] Crear galería de imágenes de ensayos/vestuario
- [ ] Escribir biografías detalladas del elenco
- [ ] Definir fechas y precios de entradas
- [ ] Crear contenido de blog/noticias

### Funcionalidades
- [ ] Integrar sistema de venta de entradas
- [ ] Configurar formulario de contacto con backend
- [ ] Implementar newsletter signup
- [ ] Agregar mapa de ubicación del teatro
- [ ] Sistema de testimonios/reseñas

### Marketing
- [ ] Configurar Google Analytics
- [ ] Implementar Facebook Pixel
- [ ] Configurar Google Search Console
- [ ] Crear sitemap.xml
- [ ] Optimizar para palabras clave locales

### Technical
- [ ] Comprimir y optimizar imágenes
- [ ] Implementar service worker para PWA
- [ ] Configurar CDN para assets estáticos
- [ ] Monitoring de uptime y performance

## 🎨 Créditos de Diseño

- **Inspiración**: Estética steampunk, mundo de OZ, teatro inmersivo
- **Paleta de colores**: Esmeralda, oro, cobre - evocando la Ciudad Esmeralda
- **Tipografías**: 
  - Cinzel (elegante, teatral)
  - Nunito (legible, moderna)
- **Iconografía**: Font Awesome 6.0

## 📞 Soporte

Para modificaciones y mantenimiento del sitio:
- **Código**: Completamente documentado y modular
- **Hosting**: Compatible con cualquier proveedor
- **Actualizaciones**: Fácil edición de contenido sin conocimientos técnicos

---

**🎭 ¡Que comience la magia de la Ciudad Esmeralda!**

*Desarrollado con ❤️ para Ophelias - Compañía de Teatro*