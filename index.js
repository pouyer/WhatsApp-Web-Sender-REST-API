const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const multer = require('multer');
const winston = require('winston');
const fs = require('fs');
const config = require('./config.json');

const app = express();
app.use(express.json());

// Configuración de Winston con timestamps
const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: config.errorLogFilePath, level: 'error' }),
    new winston.transports.File({ filename: config.logFilePath }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Añadir timestamp al nombre del archivo
  },
});

const upload = multer({ storage: storage });

// Configura el cliente de WhatsApp con el navegador Chromium instalado
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/chromium-browser', // Ruta del navegador Chromium instalado
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Argumentos necesarios para Alpine Linux
  },
});

client.on('qr', (qr) => {
  console.log('QR Code:', qr);
  logger.info('QR Code generado. Escanea el código con tu teléfono.');
});

client.on('ready', () => {
  logger.info('Cliente logueado!!!');
});

client.initialize();

// Ruta para enviar mensajes
app.post('/send-message', async (req, res) => {
  const { phoneNumber, message } = req.body;
  if (!phoneNumber || !message) {
    logger.error('Número de teléfono y mensaje son requeridos');
    return res.status(400).json({ error: 'Número de teléfono y mensaje son requeridos' });
  }

  try {
    const chatId = `${phoneNumber}@c.us`;
    await client.sendMessage(chatId, message);
    logger.info(`Mensaje enviado a ${phoneNumber}`);
    res.json({ success: true, message: 'Mensaje enviado' });
  } catch (error) {
    logger.error(`Error al enviar mensaje a ${phoneNumber}: ${error.message}`);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// Ruta para enviar archivos
app.post('/send-file', upload.single('file'), async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !req.file) {
    logger.error('Número de teléfono y archivo son requeridos');
    return res.status(400).json({ error: 'Número de teléfono y archivo son requeridos' });
  }

  try {
    const chatId = `${phoneNumber}@c.us`;
    const media = MessageMedia.fromFilePath(req.file.path);
    await client.sendMessage(chatId, media);
    fs.unlinkSync(req.file.path); // Eliminar el archivo después de enviarlo
    logger.info(`Archivo enviado a ${phoneNumber}`);
    res.json({ success: true, message: 'Archivo enviado' });
  } catch (error) {
    logger.error(`Error al enviar archivo a ${phoneNumber}: ${error.message}`);
    res.status(500).json({ error: 'Error al enviar archivo' });
  }
});

const PORTDEFOL = config.port;
const PORT = process.env.PORT || PORTDEFOL; // Usa el puerto de la variable de entorno o 3000 por defecto
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});
