# 🧪 XelleSystem — LIMS/CRM para Gestión de Laboratorios

**Descripción:** XelleSystem es un sistema integral de Laboratorio LIMS (Laboratory Information Management System) y CRM integrado, diseñado para laboratorios y centros de análisis. Proporciona una interfaz web moderna (frontend), gestión de formatos de documentos (plantillas FO-*), módulos especializados, backend escalable y capacidades de deployement containerizado. El sistema permite generar, gestionar y auditar documentos de laboratorio con integridad verificable mediante hashes MD5.

**Tecnologías principales:**
- **Frontend:** HTML5, CSS3, JavaScript vanilla (módulos)
- **Backend:** Java (Spring Boot, en preparación)
- **Contenedores:** Docker + Docker Compose
- **Base de datos:** Preparada para integración (PostgreSQL/MySQL recomendado)
- **Seguridad:** Autenticación, manifiesto de integridad MD5/SHA256, auditoría

---

## 📋 Tabla de Contenidos
1. [Estructura del Proyecto](#-estructura-del-repositorio-detallada)
2. [Instalación](#-instalación-y-configuración)
3. [Uso Local](#-ejecución-local)
4. [Módulos y Características](#-módulos-y-características)
5. [Backend (Java/Spring)](#-backend-javasspring-boot)
6. [Docker y Containerización](#-docker-y-containerización)
7. [Seguridad y Auditoría](#-seguridad-y-auditoría)
8. [Desarrollo y Extensión](#-desarrollo-y-extensión)
9. [Deployment](#-deployment-a-producción)
10. [Troubleshooting](#-troubleshooting)
11. [Contribuir](#-contribuir)
12. [FAQ](#-faq)

---

## 📦 Contenido (detallado)
- **Frontend:** Archivos HTML/CSS/JS, plantillas de formatos (FO-*) online y offline, módulos especializados, sistema de autenticación, dashboard, assets e imágenes.
- **Backend:** Carpeta Java con Maven (`pom.xml`), controladores, servicios, repositorios, y modelos de datos.
- **Documentación:** Estructura completa, hashes MD5 para auditoría, documentos de referencia (PDF/DOCX).
- **DevOps:** `docker-compose.yml` para orquestación de servicios, configuración de entornos.

---

## 🚀 Características Principales

### 🎯 Núcleo LIMS
- **Gestión de Formatos:** Plantillas especializadas (FO-*) para documentos de laboratorio
  - Formatos de Laboratorio (FO-LC-16 a FO-LC-45): análisis químicos, calibración, pruebas
  - Formatos de Operación (FO-OP-*): procedimientos, calibración de equipos
  - Versiones Online y Offline para acceso sin conectividad
- **Módulos Especializados:**
  - 🔐 **Admin:** Gestión de usuarios, roles y permisos
  - 📦 **Almacén:** Control de inventario, materiales, reactivos
  - 🧬 **Banco de Células:** Líneas celulares, cultivos, almacenamiento
  - 💄 **Cosméticos:** Análisis de ingredientes, pruebas de seguridad
  - 🧪 **Lab Calidad:** Control de calidad, métodos analíticos, validación
  - 📊 **Comercial:** Gestión de clientes, órdenes, facturación
  - ⚙️ **Configuración:** Parámetros globales, integraciones
  - 🏢 **SGC:** Sistema de Gestión de Calidad, documentación

### 🔒 Seguridad
- **Sistema de Autenticación:** Login con validación, gestión de sesiones
- **Control de Integridad:** Manifiesto MD5/SHA256 para detectar cambios no autorizados
- **Auditoría:** Trazabilidad de cambios, registros de acceso, fecha/hora de modificaciones
- **Autorización Basada en Roles:** Módulos y funciones restringidas por rol de usuario

### 📱 Interfaz y UX
- Dashboard intuitivo con resumen de actividades
- Tema oscuro/claro (LIMS-theme.css)
- Diseño responsivo (compatible con desktop, tablet, móvil)
- Offline-first: modo offline con sincronización cuando se recupere conexión
- Acceso rápido a formatos y módulos frecuentes

### 📊 Reportes y Exportación
- Generación dinámica de reportes desde datos del laboratorio
- Exportación a PDF, Excel (utilizando librerías JavaScript)
- Trazabilidad completa de análisis y resultados
- Historial de cambios para auditoría regulatoria

---

## 🛠️ Requisitos del Sistema

### Desarrollo Local
| Componente | Versión | Notas |
|-----------|---------|-------|
| **Node.js** | 16+ | Para servir archivos estáticos, opcional |
| **Python** | 3.8+ | Para servir frontend localmente, opcional |
| **PowerShell** | 5.1+ | Para scripts de auditoría (Windows) |
| **Git** | 2.30+ | Control de versiones |
| **Docker** | 20.10+ | Para containerización y ejecución |
| **Docker Compose** | 1.29+ | Para orquestación multi-contenedor |
| **Java/JDK** | 11+ | Backend (cuando se implemente) |
| **Maven** | 3.6+ | Build tool del backend Java |

### Base de Datos
- **PostgreSQL 12+** (recomendado) o **MySQL 8.0+**
- Para desarrollo: SQLite como alternativa lightweight
- Scripts de inicialización en `backend/resources/db/`

### Navegadores Soportados
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Navegadores con soporte ES6 (ECMAScript 2015+)

---

## 📥 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/xelle/xellesystem.git
cd XelleSystem
```

### 2. Estructura de Directorios (crear si es necesario)
```
XelleSystem/
├── frontend/                 # Frontend (HTML, CSS, JS)
│   ├── modules/             # Módulos especializados
│   ├── formats/             # Plantillas de documentos
│   ├── js/                  # Scripts y lógica
│   └── css/                 # Estilos
├── backend/                 # Backend Java/Spring
│   ├── src/
│   ├── pom.xml             # Maven configuration
│   └── mvnw/mvnw.cmd       # Maven wrapper
├── docker-compose.yml       # Orquestación de contenedores
└── README.md               # Este archivo
```

### 3. Configuración de Variables de Entorno

Crear `.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=xellesystem
DB_USER=xelle
DB_PASSWORD=tu_contraseña_segura

# Backend (Java/Spring)
SPRING_PROFILE=development
JAVA_OPTS=-Xmx512m

# Frontend
FRONTEND_PORT=8000
API_BASE_URL=http://localhost:8080/api

# Docker
DOCKER_REGISTRY=docker.io
IMAGE_VERSION=latest

# Seguridad
JWT_SECRET=tu_jwt_secret_super_largo_y_aleatorio
ENCRYPTION_KEY=tu_clave_encriptacion

# Logging
LOG_LEVEL=INFO
```

### 4. Setup Inicial

#### Opción A: Desarrollo Local (sin Docker)

**Frontend:**
```bash
cd frontend
# Opción 1: Python 3
python -m http.server 8000
# Opción 2: Node.js (http-server)
npx http-server . -p 8000
# Luego abrir: http://localhost:8000/index.html o http://localhost:8000/login.html
```

**Backend (cuando esté disponible):**
```bash
cd backend
mvnw.cmd clean install          # Windows
./mvnw clean install            # Linux/macOS
mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run          # Linux/macOS
# API disponible en: http://localhost:8080
```

#### Opción B: Con Docker Compose (Recomendado)

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Servicios disponibles después de `up`:**
- Frontend: http://localhost:8000
- Backend API: http://localhost:8080
- Base de datos: localhost:5432 (PostgreSQL)
- Adminer (DB UI): http://localhost:8081

---

## 🔧 Cómo generar/actualizar hashes MD5 (manifiesto)
Generar hashes permite detectar cambios accidentales o no autorizados en archivos.

Ejemplo (PowerShell):

```powershell
$root='C:\Path\To\XelleSystem\'; $out="${root}frontend/hashes.md";
"# MD5 hashes for frontend" | Out-File -Encoding utf8 $out;
"Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -Encoding utf8 -Append $out;
"Hash  File" | Out-File -Encoding utf8 -Append $out;
"----  ----" | Out-File -Encoding utf8 -Append $out;
Get-ChildItem -Path "${root}frontend" -Recurse -File | Sort-Object FullName | ForEach-Object {
  $h=Get-FileHash -Algorithm MD5 -Path $_.FullName;
  $rel=$_.FullName.Substring($root.Length).Replace('\','/');
  '{0}  {1}' -f $h.Hash, $rel | Out-File -Encoding utf8 -Append $out
}
```

- Resultado: `frontend/hashes.md` con lista de pares (MD5, ruta relativa).
- Recomendación: regenerar antes de cada release o incluir en CI para vigilancia.

---

## 📚 Documentación y archivos importantes (nuevos añadidos)
He añadido y verificado varios archivos de documentación y soporte en la carpeta `frontend/`. A continuación se describen con su ruta, propósito y recomendaciones de uso:

- `frontend/hashes.md` — Manifiesto MD5 generado automáticamente. Uso: archivo principal para verificar integridad de archivos estáticos antes y después de cambios importantes o releases.
- `frontend/estructura_completa.txt` — Árbol del directorio `frontend`, útil para auditoría y revisión rápida de estructura.
- `frontend/Dirección IP Config.docx` — Documento de configuración de red y direcciones IP (ruta literal con espacios y acentos). Abrir con MS Word, LibreOffice o Google Docs según preferencia. Ruta completa: `frontend/Dirección IP Config.docx`.
- `frontend/LIMS y CRM para Laboratorios.pdf` — Documento de referencia funcional y de requerimientos.
- `frontend/Figure_1.png` — Imagen utilizada en documentación o presentaciones.

> Nota: los nombres con espacios o caracteres especiales (como `Dirección IP Config.docx`) deben manejarse entre comillas en comandos de terminal: `"frontend/Directión IP Config.docx"`.

### Propósito y recomendaciones
- Mantener `hashes.md` bajo control de versiones y regenerarlo cuando se cambien archivos estáticos.
- Mantener `estructura_completa.txt` actualizado en commits significativos (nuevos formatos, assets, módulos).
- Archivar los documentos oficiales (`.docx`, `.pdf`) en la carpeta `frontend/docs/` si deseas separarlos del contenido operativo.

---

## 🧾 Procedimientos detallados y ejemplos (verificación y flujo)
A continuación se muestran comandos precisos y ejemplos para verificar integridad, comparar manifestos y comprobar un archivo puntual.

1) Verificar el hash de un archivo concreto (PowerShell):

```powershell
# Calcular hash MD5 de un archivo puntual
Get-FileHash -Algorithm MD5 -Path "frontend/index.html"
```

2) Regenerar un manifiesto temporal y comparar con el `hashes.md` existente:

```powershell
$root='C:\Users\WINDOWS\Desktop\XelleSystem\'; $tmp="${root}frontend/hashes-new.md";
Get-ChildItem -Path "${root}frontend" -Recurse -File | Sort-Object FullName | ForEach-Object {
  $h=Get-FileHash -Algorithm MD5 -Path $_.FullName; $rel=$_.FullName.Substring($root.Length).Replace('\','/'); '{0}  {1}' -f $h.Hash, $rel
} | Out-File -Encoding utf8 $tmp

# Comparar ambos manifestos
Compare-Object (Get-Content "${root}frontend/hashes.md") (Get-Content $tmp)
```

3) Comprobar diferencias en contenido (si hay cambios detectados):

```powershell
# Mostrar solo diferencias (salida humana)
Compare-Object (Get-Content "${root}frontend/hashes.md") (Get-Content $tmp) | Where-Object { $_.SideIndicator -ne '==' }
```

4) Flujo de commit recomendado al introducir cambios en frontend:
- Regenerar `hashes.md` y `estructura_completa.txt`.
- Verificar los cambios con `Compare-Object`.
- Git: `git add frontend/hashes.md frontend/estructura_completa.txt <otros archivos>`
- Commit: `git commit -m "chore(frontend): regenerar hashes y estructura tras cambios"`

---

## 🔐 Buenas prácticas de seguridad y auditoría
- Mantener `hashes.md` en la rama de release o firmada por el equipo de release para evitar modificaciones no autorizadas.
- Considerar uso de checksums más fuertes (SHA256) en entornos de mayor seguridad.
- Registrar fecha y autor del manifiesto cada vez que se regenere.

---

¿Deseas que genere un workflow de GitHub Actions para regenerar y validar `frontend/hashes.md` automáticamente en cada push/PR? (puedo crearlo y añadirlo al repositorio si confirmas).

## 🧭 Actualizar `estructura_completa.txt`
Para regenerar el árbol de archivos del frontend puedes usar:

- En PowerShell (Windows):

```powershell
cd frontend
tree /F /A > estructura_completa.txt
```

- Método alternativo (PowerShell más controlado):

```powershell
Get-ChildItem -Recurse | Sort-Object FullName | Format-List FullName > estructura_completa.txt
```

Incluye `estructura_completa.txt` en commits para reflejar la estructura actual cuando se requiera.

---

## 🧩 Estructura del repositorio (resumen)
- `frontend/` — archivos estáticos (HTML, CSS, JS, formats, assets)
  - `assets/` — iconos, logos, imágenes
  - `css/` — hojas de estilo
  - `formats/` — plantillas FO-*
  - `js/` — scripts y `core/`
  - `modules/` — código por módulo (admin, almacen, banco-celulas, ...)
- `backend/` — (vacío, por implementar)
- `README.md`, `frontend/estructura_completa.txt`, `frontend/hashes.md`

---

## ✅ Buenas prácticas y flujo recomendado
- Añadir y commitear `frontend/hashes.md` en cada release o mantener en branch de release para auditoría.
- Antes de enviar PRs que modifican archivos estáticos, regenerar `hashes.md` y `estructura_completa.txt` y añadirlos al PR para facilitar revisión.
- Usar mensajes de commit descriptivos: `feat(frontend): añadir formato FO-LC-50` o `chore(build): regenerar hashes`.

---

## 🧪 Pruebas y validación
- Actualmente no hay suite de tests automatizados. Recomendación:
  - Añadir validación estática: lint para JS/CSS/HTML.
  - Añadir job en CI que regenere `hashes.md` y falle si difiere (detección de cambios no aprobados).

---

## 🤝 Contribuir
1. Fork y crea una rama con un nombre descriptivo: `feature/<tema>` o `fix/<tema>`.
2. Asegúrate de actualizar `hashes.md` y `estructura_completa.txt` si añades/eliminas/actualizas archivos.
3. Abre un PR describiendo los cambios y su propósito.

---

## 📄 Licencia
- (Por defecto) **MIT** — Cambia según la política de tu organización.

---

## 📬 Contacto
- Autor / Mantenedor: equipo Xelle
- Correo: soporte@xelle.local (ajusta según corresponda)

---

> Nota: este README está generado y ampliado para proporcionar contexto de uso y mantenimiento; dime si quieres que añada:
> - Ejemplos de uso detallados por módulo ✅
> - Scripts de automatización para CI/CD (GitHub Actions) ⚙️
> - Plantilla de issue/PR y checklist de revisión ✅
