# XelleSystem — Documentos y LIMS (README)

**Descripción corta:** XelleSystem proporciona la interfaz y recursos (frontend) para generación y gestión de formatos y documentos para laboratorios (LIMS/CRM). Este repositorio contiene los archivos estáticos del frontend, plantillas de formatos (FO-*), y utilidades para mantener la estructura y detectar cambios mediante hashes MD5.

---

## 📋 Contenido (resumen)
- Frontend: archivos HTML, CSS, JS, formats (online + offline), assets e imágenes.
- Documentación: `estructura_completa.txt`, `hashes.md` (manifiesto MD5 generado), y archivos PDF/DOCX de referencia.
- Backend: carpeta preparada (actualmente vacía) para integración futura.

---

## 🚀 Características principales
- Plantillas de formato (FO-*) para generar documentos de laboratorio (online y offline).
- Sistema modular (carpeta `modules/`) para funcionalidades (admin, almacen, banco-celulas, etc.).
- Manifiesto de integridad: `frontend/hashes.md` con MD5 de todos los archivos para detectar cambios.
- Archivo `estructura_completa.txt` con árbol actualizado de la estructura de `frontend`.

---

## 🛠️ Requisitos
- Windows / Linux / macOS
- Python 3 (opcional, para servir archivos estáticos localmente)
- PowerShell (para generar hashes; disponible en Windows y PS Core en otros sistemas)
- Node.js (opcional, para utilidades como `http-server`)

---

## 📥 Instalación y uso local
1. Clona el repositorio:

```bash
git clone <repo-url>
cd XelleSystem
```

2. Servir el frontend (opciones):
- Con Python 3:

```bash
cd frontend
python -m http.server 8000
# Abrir http://localhost:8000
```

- Con Node (http-server):

```bash
npx http-server ./frontend -p 8000
```

3. Abrir `index.html` o `login.html` en el navegador.

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
