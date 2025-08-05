// src/firebase/firestore.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'contact_cards';

// Generar código secreto aleatorio
export const generateSecretCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Función para generar slug a partir del nombre
export const generateSlug = (fullName) => {
  return fullName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '_') // Reemplazar espacios y guiones con underscore
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
};

// Verificar si ya existe una tarjeta con ese slug
export const checkSlugExists = async (slug) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error verificando slug:', error);
    throw error;
  }
};

// Crear nueva tarjeta de contacto
export const createContactCard = async (cardData) => {
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
      secretCode: secretCode, // Código secreto para editar/eliminar
      ...cardData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, COLLECTION_NAME, slug), docData);
    
    // Si hay email personal, preparar datos para envío de email
    if (cardData.contactInfo.personalEmail) {
      // Crear documento en colección para trigger de Cloud Function
      await setDoc(doc(db, 'email_queue', `${slug}_welcome`), {
        to: cardData.contactInfo.personalEmail,
        template: 'welcome_card',
        data: {
          fullName: cardData.personalInfo.fullName,
          secretCode: secretCode,
          cardUrl: `${window.location.origin}/card/${slug}`,
          editUrl: `${window.location.origin}/edit/${slug}`
        },
        status: 'pending',
        createdAt: serverTimestamp()
      });
    }
    
    // Retornar tanto el slug como el código secreto
    return { slug, secretCode };
  } catch (error) {
    console.error('Error creando tarjeta:', error);
    throw error;
  }
};

// Obtener tarjeta por slug (sin código secreto para vista pública)
export const getContactCard = async (slug) => {
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
export const getCardForEditing = async (slug, secretCode) => {
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
export const updateContactCard = async (slug, secretCode, updatedData) => {
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
export const deleteContactCard = async (slug, secretCode) => {
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
  searchCardByName 
};