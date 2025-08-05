// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configurar transporter de Gmail
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Función trigger cuando se crea una nueva tarjeta
exports.sendWelcomeEmail = functions.firestore
  .document('contact_cards/{cardId}')
  .onCreate(async (snap, context) => {
    const cardData = snap.data();
    const cardId = context.params.cardId;

    // Solo enviar si hay email personal
    if (!cardData.contactInfo.personalEmail) {
      return null;
    }

    const mailOptions = {
      from: `"Tarjetas Digitales" <${gmailEmail}>`,
      to: cardData.contactInfo.personalEmail,
      subject: '🎉 Tu Tarjeta Digital ha sido creada exitosamente',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; font-size: 28px; font-weight: 600; margin: 0;">
                ¡Tarjeta Digital Creada!
              </h1>
              <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">
                Tu tarjeta profesional está lista para compartir
              </p>
            </div>

            <!-- Información de la tarjeta -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
                Detalles de tu Tarjeta
              </h2>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Nombre:</strong> ${cardData.personalInfo.fullName}
              </p>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Título:</strong> ${cardData.personalInfo.title}
              </p>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Teléfono:</strong> ${cardData.contactInfo.phone}
              </p>
            </div>

            <!-- Código de acceso -->
            <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px; text-align: center;">
              <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">
                🔐 Código de Acceso
              </h3>
              <p style="color: white; margin: 0 0 8px 0;">
                Guarda este código para editar o eliminar tu tarjeta:
              </p>
              <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 16px; margin: 12px 0;">
                <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 0.1em;">
                  ${cardData.secretCode}
                </span>
              </div>
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0;">
                ⚠️ Mantén este código en un lugar seguro
              </p>
            </div>

            <!-- Enlaces -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://tu-dominio.com/card/${cardId}" 
                 style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 8px;">
                📱 Ver mi Tarjeta
              </a>
              <br>
              <a href="https://tu-dominio.com/manage" 
                 style="display: inline-block; background: transparent; border: 2px solid #e5e7eb; color: #374151; text-decoration: none; padding: 12px 26px; border-radius: 8px; font-weight: 500; margin: 8px;">
                ⚙️ Gestionar Tarjeta
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Creado con <span style="color: #ef4444;">❤️</span> por Tarjetas Digitales
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                Este email fue enviado porque creaste una tarjeta digital en nuestro sitio.
              </p>
            </div>

          </div>
        </div>
      `,
      text: `
¡Hola ${cardData.personalInfo.fullName}!

Tu tarjeta digital ha sido creada exitosamente.

DETALLES DE TU TARJETA:
- Nombre: ${cardData.personalInfo.fullName}
- Título: ${cardData.personalInfo.title}
- Teléfono: ${cardData.contactInfo.phone}

CÓDIGO DE ACCESO: ${cardData.secretCode}
⚠️ Guarda este código en un lugar seguro para editar o eliminar tu tarjeta.

ENLACES:
- Ver tu tarjeta: https://tu-dominio.com/card/${cardId}
- Gestionar tarjeta: https://tu-dominio.com/manage

¡Gracias por usar Tarjetas Digitales!
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email:', error);
    }

    return null;
  });