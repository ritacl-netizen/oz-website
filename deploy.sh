#!/bin/bash

# Deployment script for El Secreto de la Ciudad Esmeralda website
# Usage: ./deploy.sh

echo "🎭 Desplegando El Secreto de la Ciudad Esmeralda..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_status "Inicializando repositorio Git..."
    git init
    git branch -M main
fi

# Add and commit all changes
print_status "Agregando archivos al repositorio..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_status "No hay cambios para commitear."
else
    print_status "Commiteando cambios..."
    
    # Ask for commit message
    echo -n "Mensaje del commit (presiona Enter para usar mensaje por defecto): "
    read commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update website: $(date +'%Y-%m-%d %H:%M')"
    fi
    
    git commit -m "$commit_message"
    print_success "Cambios commiteados"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No hay repositorio remoto configurado."
    echo "Configura el repositorio remoto con:"
    echo "git remote add origin https://github.com/USUARIO/oz-musical-website.git"
    exit 1
fi

# Push to GitHub
print_status "Subiendo cambios a GitHub..."
if git push origin main; then
    print_success "Código subido a GitHub exitosamente"
else
    print_error "Error al subir código a GitHub"
    exit 1
fi

# Deploy to GitHub Pages (if gh-pages is available)
if command -v gh-pages &> /dev/null; then
    print_status "Desplegando a GitHub Pages..."
    if npm run deploy; then
        print_success "Sitio desplegado a GitHub Pages"
    else
        print_error "Error al desplegar a GitHub Pages"
    fi
else
    print_status "gh-pages no está instalado. Instalar con: npm install -g gh-pages"
    print_status "GitHub Pages se actualizará automáticamente desde la rama main"
fi

print_success "¡Deployment completado! 🎭"
print_status "El sitio estará disponible en:"
print_status "- GitHub Pages: https://USUARIO.github.io/oz-musical-website/"
print_status "- Dominio personalizado: https://oselmusical.com (cuando esté configurado)"

echo ""
print_status "Para verificar el estado del deployment:"
print_status "1. Ve a https://github.com/USUARIO/oz-musical-website/actions"
print_status "2. Verifica que el deployment de GitHub Pages haya sido exitoso"
print_status "3. Prueba el sitio en el navegador"

echo ""
print_success "🌟 ¡La magia de la Ciudad Esmeralda está en vivo! 🌟"