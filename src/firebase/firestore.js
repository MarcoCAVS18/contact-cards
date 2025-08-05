// src/firebase/firestore.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'contact_cards';
const MAIL_COLLECTION = 'mail';

// Generar código secreto aleatorio
const generateSecretCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Función para generar slug a partir del nombre
const generateSlug = (fullName) => {
  return fullName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '_') // Reemplazar espacios y guiones con underscore
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
};

// Verificar si ya existe una tarjeta con ese slug
const checkSlugExists = async (slug) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error verificando slug:', error);
    throw error;
  }
};

// Función para enviar email de recordatorio de código
const sendCodeReminderEmail = async (slug) => {
  console.log('Enviando recordatorio de código para:', slug);

  try {
    // Obtener la tarjeta para verificar que existe y obtener datos
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Tarjeta no encontrada');
    }

    const cardData = docSnap.data();
    
    // Verificar que tenga email personal
    if (!cardData.contactInfo.personalEmail) {
      throw new Error('Esta tarjeta no tiene email asociado');
    }

    const mailDoc = {
      to: [cardData.contactInfo.personalEmail],
      message: {
        subject: 'Código de acceso para tu Tarjeta Digital',
        html: `
          <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);">
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; font-size: 28px; font-weight: 600; margin: 0;">
                  Código de Acceso Solicitado
                </h1>
                <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">
                  Tu código para gestionar la tarjeta digital
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
              </div>

              <!-- Código de acceso -->
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px; text-align: center;">
                <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">
                  Tu Código de Acceso
                </h3>
                <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 16px; margin: 12px 0;">
                  <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 0.1em;">
                    ${cardData.secretCode}
                  </span>
                </div>
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0;">
                  Usa este código para editar o eliminar tu tarjeta
                </p>
              </div>

              <!-- Enlaces -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${window.location.origin}/manage" 
                   style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 8px;">
                  Gestionar Tarjeta
                </a>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Este email fue enviado porque solicitaste el código de tu tarjeta digital
                </p>
              </div>

            </div>
          </div>
        `,
        text: `
Hola ${cardData.personalInfo.fullName},

Has solicitado el código de acceso para tu tarjeta digital.

DETALLES DE TU TARJETA:
- Nombre: ${cardData.personalInfo.fullName}
- Título: ${cardData.personalInfo.title}

TU CÓDIGO DE ACCESO: ${cardData.secretCode}

Usa este código para gestionar tu tarjeta en: ${window.location.origin}/manage

Si no solicitaste este código, puedes ignorar este email.
        `
      }
    };

    const mailRef = await addDoc(collection(db, MAIL_COLLECTION), mailDoc);
    console.log('Email de recordatorio enviado con ID:', mailRef.id);
    
    return mailRef.id;
  } catch (error) {
    console.error('Error enviando recordatorio de código:', error);
    throw error;
  }
};
const sendWelcomeEmail = async (cardData, slug, secretCode) => {
  console.log('Enviando email de bienvenida a:', cardData.contactInfo.personalEmail);

  try {
    const mailDoc = {
      to: [cardData.contactInfo.personalEmail],
      message: {
        subject: 'Tu Tarjeta Digital ha sido creada exitosamente',
        html: `
          <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);">
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; font-size: 28px; font-weight: 600; margin: 0;">
                  Tarjeta Digital Creada
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
                  Código de Acceso
                </h3>
                <p style="color: white; margin: 0 0 8px 0;">
                  Guarda este código para editar o eliminar tu tarjeta:
                </p>
                <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 16px; margin: 12px 0;">
                  <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 0.1em;">
                    ${secretCode}
                  </span>
                </div>
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0;">
                  Mantén este código en un lugar seguro
                </p>
              </div>

              <!-- Enlaces -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${window.location.origin}/card/${slug}" 
                   style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 8px;">
                  Ver mi Tarjeta
                </a>
                <br>
                <a href="${window.location.origin}/manage" 
                   style="display: inline-block; background: transparent; border: 2px solid #e5e7eb; color: #374151; text-decoration: none; padding: 12px 26px; border-radius: 8px; font-weight: 500; margin: 8px;">
                  Gestionar Tarjeta
                </a>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Creado por Tarjetas Digitales
                </p>
              </div>

            </div>
          </div>
        `,
        text: `
Hola ${cardData.personalInfo.fullName},

Tu tarjeta digital ha sido creada exitosamente.

DETALLES DE TU TARJETA:
- Nombre: ${cardData.personalInfo.fullName}
- Título: ${cardData.personalInfo.title}
- Teléfono: ${cardData.contactInfo.phone}

CÓDIGO DE ACCESO: ${secretCode}
Guarda este código en un lugar seguro para editar o eliminar tu tarjeta.

ENLACES:
- Ver tu tarjeta: ${window.location.origin}/card/${slug}
- Gestionar tarjeta: ${window.location.origin}/manage

Gracias por usar Tarjetas Digitales
        `
      }
    };

    const mailRef = await addDoc(collection(db, MAIL_COLLECTION), mailDoc);
    console.log('Documento de email creado con ID:', mailRef.id);
    
    return mailRef.id;
  } catch (error) {
    console.error('Error enviando email:', error);
    // No lanzar error para que no falle la creación de la tarjeta
  }
};

// Buscar tarjeta por nombre
const searchCardByName = async (fullName) => {
  try {
    const slug = generateSlug(fullName);
    const card = await getContactCard(slug);
    return card;
  } catch (error) {
    console.error('Error buscando tarjeta:', error);
    return null;
  }
};

// Crear nueva tarjeta de contacto
const createContactCard = async (cardData) => {
  console.log('Creando nueva tarjeta para:', cardData.personalInfo.fullName);

  try {
    const slug = generateSlug(cardData.personalInfo.fullName);
    
    // Verificar si ya existe
    const exists = await checkSlugExists(slug);
    if (exists) {
      throw new Error('Ya existe una tarjeta con ese nombre. Intenta con un nombre diferente.');
    }

    const secretCode = generateSecretCode();
    
    const docData = {
      id: slug,
      secretCode: secretCode,
      ...cardData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, COLLECTION_NAME, slug), docData);
    console.log('Tarjeta guardada exitosamente');
    
    // Enviar email de bienvenida si hay email personal
    if (cardData.contactInfo.personalEmail) {
      await sendWelcomeEmail(cardData, slug, secretCode);
    }
    
    return { slug, secretCode };
  } catch (error) {
    console.error('Error creando tarjeta:', error);
    throw error;
  }
};

// Obtener tarjeta por slug (sin código secreto para vista pública)
const getContactCard = async (slug) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remover código secreto de la respuesta pública
      const { secretCode, ...publicData } = data;
      return { id: docSnap.id, ...publicData };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo tarjeta:', error);
    throw error;
  }
};

// Verificar código secreto y obtener tarjeta completa para edición
const getCardForEditing = async (slug, secretCode) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.secretCode === secretCode) {
        return { id: docSnap.id, ...data };
      } else {
        throw new Error('Código de acceso incorrecto');
      }
    } else {
      throw new Error('Tarjeta no encontrada');
    }
  } catch (error) {
    console.error('Error verificando acceso:', error);
    throw error;
  }
};

// Actualizar tarjeta existente
const updateContactCard = async (slug, secretCode, updatedData) => {
  try {
    // Verificar código secreto primero
    await getCardForEditing(slug, secretCode);
    
    const docRef = doc(db, COLLECTION_NAME, slug);
    const updatePayload = {
      ...updatedData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updatePayload);
    return true;
  } catch (error) {
    console.error('Error actualizando tarjeta:', error);
    throw error;
  }
};

// Eliminar tarjeta
const deleteContactCard = async (slug, secretCode) => {
  try {
    // Verificar código secreto primero
    await getCardForEditing(slug, secretCode);
    
    const docRef = doc(db, COLLECTION_NAME, slug);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error eliminando tarjeta:', error);
    throw error;
  }
};

// Exportar todas las funciones
export { 
  generateSlug, 
  generateSecretCode,
  checkSlugExists, 
  createContactCard, 
  getContactCard, 
  getCardForEditing,
  updateContactCard,
  deleteContactCard,
  searchCardByName,
  sendCodeReminderEmail
};