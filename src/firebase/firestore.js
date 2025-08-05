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

// Función para obtener la URL base
const getBaseUrl = () => {
  // En desarrollo
  if (window.location.hostname === 'localhost') {
    return window.location.origin;
  }
  // En producción
  return 'https://contact-cardss.netlify.app';
};

// Generar código secreto aleatorio
const generateSecretCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Función para normalizar texto (quitar tildes, espacios extra, puntos, etc.)
const normalizeText = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Reemplazar caracteres con tildes/acentos
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    // Quitar puntos, comas y otros caracteres especiales
    .replace(/[.,;:'"()[\]{}¿?¡!@#$%^&*+=|\\/<>~`]/g, '')
    // Reemplazar múltiples espacios con uno solo
    .replace(/\s+/g, ' ')
    .trim();
};

// Función para verificar si un texto contiene las palabras buscadas
const containsSearchTerms = (fullText, searchText) => {
  const normalizedFullText = normalizeText(fullText);
  const searchTerms = normalizeText(searchText).split(' ').filter(term => term.length > 0);
  
  // Si no hay términos de búsqueda, no hay coincidencia
  if (searchTerms.length === 0) return false;
  
  // Verificar que todos los términos estén presentes en el texto completo
  return searchTerms.every(term => {
    // Buscar coincidencia exacta del término
    if (normalizedFullText.includes(term)) return true;
    
    // Buscar coincidencia parcial (para casos como "Belen" en "Maria Belen")
    const words = normalizedFullText.split(' ');
    return words.some(word => word.includes(term) || term.includes(word));
  });
};

// Función para generar variaciones del slug para búsqueda
const generateSearchSlugs = (searchName) => {
  const normalized = normalizeText(searchName);
  const slugs = [];
  
  // Slug principal
  const mainSlug = normalized.replace(/\s+/g, '_');
  slugs.push(mainSlug);
  
  // Variaciones sin palabras cortas (Tec, Dr, etc.)
  const withoutShortWords = normalized
    .split(' ')
    .filter(word => word.length > 2) // Filtrar palabras de 2 caracteres o menos
    .join(' ')
    .replace(/\s+/g, '_');
  
  if (withoutShortWords && withoutShortWords !== mainSlug) {
    slugs.push(withoutShortWords);
  }
  
  // Solo nombre (primera palabra)
  const firstName = normalized.split(' ')[0];
  if (firstName && firstName.length > 2) {
    slugs.push(firstName);
  }
  
  // Solo apellido (última palabra)
  const words = normalized.split(' ');
  const lastName = words[words.length - 1];
  if (lastName && lastName.length > 2 && lastName !== firstName) {
    slugs.push(lastName);
  }
  
  return [...new Set(slugs)]; // Remover duplicados
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

// Función para enviar email de recordatorio de código con búsqueda flexible
const sendCodeReminderEmail = async (searchName) => {

  try {
    // Usar la misma lógica de búsqueda flexible
    const searchSlugs = generateSearchSlugs(searchName);
    let cardData = null;
    let foundSlug = null;
    
    // Buscar la tarjeta con cualquiera de los slugs
    for (const slug of searchSlugs) {
      try {
        const docRef = doc(db, COLLECTION_NAME, slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Verificar que el nombre coincida usando la función de búsqueda
          if (containsSearchTerms(data.personalInfo.fullName, searchName)) {
            cardData = data;
            foundSlug = slug;
            break;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!cardData) {
      throw new Error('Tarjeta no encontrada');
    }

    // Verificar que tenga email personal
    if (!cardData.contactInfo.personalEmail) {
      throw new Error('Esta tarjeta no tiene email asociado');
    }

    const baseUrl = getBaseUrl();

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
                <a href="${baseUrl}/manage/${foundSlug}?code=${cardData.secretCode}" 
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

Usa este código para gestionar tu tarjeta en: ${baseUrl}/manage/${foundSlug}?code=${cardData.secretCode}

Si no solicitaste este código, puedes ignorar este email.
        `
      }
    };

    const mailRef = await addDoc(collection(db, MAIL_COLLECTION), mailDoc);
    
    return mailRef.id;
  } catch (error) {
    console.error('Error enviando recordatorio de código:', error);
    throw error;
  }
};
const sendWelcomeEmail = async (cardData, slug, secretCode) => {

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
    
    return mailRef.id;
  } catch (error) {
    console.error('Error enviando email:', error);
    // No lanzar error para que no falle la creación de la tarjeta
  }
};

// Función para generar slug a partir del nombre (mantener la original para crear tarjetas)
const generateSlug = (fullName) => {
  return normalizeText(fullName).replace(/\s+/g, '_');
};

// Buscar tarjeta por nombre con lógica flexible
const searchCardByName = async (fullName) => {
  try {
    
    // Generar múltiples slugs para probar
    const searchSlugs = generateSearchSlugs(fullName);    
    // Intentar con cada slug generado
    for (const slug of searchSlugs) {
      try {
        const card = await getContactCard(slug);
        if (card) {          
          // Verificar que el nombre coincida usando la función de búsqueda
          if (containsSearchTerms(card.personalInfo.fullName, fullName)) {
            return card;
          }
        }
      } catch (error) {
        // Continuar con el siguiente slug si este falla
        continue;
      }
    }
    
    return null;
    
  } catch (error) {
    console.error('Error en búsqueda flexible:', error);
    return null;
  }
};

// Crear nueva tarjeta de contacto
const createContactCard = async (cardData) => {

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