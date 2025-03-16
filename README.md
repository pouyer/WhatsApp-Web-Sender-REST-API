# WhatsApp-Web-Sender-REST-API

![License-MIT](https://img.shields.io/badge/license-MIT-blue.svg?download=true)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-green.svg?download=true)

Esta es una API RESTful diseñada para automatizar el envío de mensajes y archivos a través de WhatsApp Web utilizando whatsapp-web.js y Puppeteer. La aplicación está optimizada para ejecutarse en contenedores Docker, lo que facilita su implementación en entornos de producción.

## Características
- **Enviar mensajes de texto :** Envía mensajes personalizados a números de teléfono específicos.
- **Enviar archivos :** Adjunta y envía archivos (imágenes, documentos, etc.) a contactos de WhatsApp.
- **Autenticación persistente :** Guarda las sesiones de WhatsApp Web para evitar volver a escanear el código QR después de reiniciar la aplicación.
- **Logs detallados :** Registra todas las acciones importantes utilizando Winston para un seguimiento eficiente.
- **Despliegue con Docker :** Fácil de implementar y escalar usando contenedores Docker.
## Requisitos previos
Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/es?spm=a2ty_o01.29997173.0.0.6e645171Uwss5n) (versión 18 o superior)
- [Docker](https://www.docker.com/?spm=a2ty_o01.29997173.0.0.6e645171Uwss5n) y [Docker Compose](https://docs.docker.com/compose/?spm=a2ty_o01.29997173.0.0.6e645171Uwss5n)
- Una cuenta de WhatsApp activa para autenticarte mediante el código QR.
## Instalación local
### Clonar el repositorio

 ```
git clone https://github.com/pouyer/WhatsApp-Web-Sender-REST-API.git
 cd whatsapp-web-api
```

### Instalar dependencias

``` npm install ```

### Configurar variables de entorno
Crea un archivo ` .env ` en la raíz del proyecto con las siguientes variables:
```
 PORT=3000
 NODE_ENV=development
 LOG_LEVEL=info
 ERROR_LOG_FILE_PATH=./logs/error.log
 LOG_FILE_PATH=./logs/app.log
```

### Ejecutar la aplicación
```
npm start
```

Escanea el código QR que aparece en la consola para iniciar sesión en WhatsApp Web. Una vez autenticado, la API estará lista para recibir solicitudes.

## Uso de la API
### Enviar un mensaje
Envía una solicitud POST al endpoint **` /send-message `**:
```
 curl -X POST http://localhost:3000/send-message \
 -H "Content-Type: application/json" \
 -d '{"phoneNumber": "573001234567", "message": "Hola desde la API"}'
```
### Enviar un archivo
Envía una solicitud POST al endpoint **` /send-file `**:
```
 curl -X POST http://localhost:3000/send-file \
 -H "Content-Type: multipart/form-data" \
 -F "phoneNumber=573001234567" \
 -F "file=@/ruta/al/archivo.jpg"
```
## Implementación con Docker
### Construir y ejecutar el contenedor
1. Construye la imagen Docker:
```
 docker-compose up --build
```
2. Verifica que el contenedor esté en ejecución:
```
 docker ps
```
3. Accede a los logs del contenedor:
```
docker logs api_whats_envio-app
```
## Persistencia de datos
Los siguientes directorios se montan como volúmenes en el contenedor para persistir datos importantes:

- ` logs/ `: Almacena los logs generados por la aplicación.
- ` .wwebjs_auth/ `: Guarda las credenciales de autenticación de WhatsApp Web.
- ` .wwebjs_cache/ `: Almacena cachés internas de whatsapp-web.js.
- ` uploads/ `: Guarda archivos subidos temporalmente.
## Variables de entorno
| VARIABLE  | DESCRIPCION |
  | ------------ | ------------ |
  | PORT | Puerto en el que la API escuchará las solicitudes (por defecto: 3000 ). |
  | NODE_ENV | Entorno de ejecución (developmento production ).|
  | LOG_LEVEL | Nivel de logs (info,debug,warn,error).|
  | ERROR_LOG_FILE_PATH | Ruta del archivo de logs de errores.|
  | LOG_FILE_PATH | Ruta del archivo de logs generales. |

## Solución de problemas
Si encuentras errores relacionados con Chromium o Puppeteer, sigue estos pasos:

1. Asegúrate de que Chromium esté instalado correctamente en el contenedor.
2. Verifica que la ruta del navegador en index.js coincida con la ruta real de Chromium (/usr/bin/chromium-browser).
3. Consulta la guía de solución de problemas de Puppeteer .

## Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (` git checkout -b feature/nueva-funcionalidad `).
3. Realiza tus cambios y haz commit (` git commit -m "Añadir nueva funcionalidad" `).
4. Sube los cambios (` git push origin feature/nueva-funcionalidad `).
5. Abre un pull request.

## Licencia
Este proyecto está bajo la licencia MIT . Consulta el archivo LICENSE para más detalles.

## Autor
- Nombre : Carlos Mejia
- GitHub : @pouyer
- Correo electrónico : pouyer01@gmail.com
