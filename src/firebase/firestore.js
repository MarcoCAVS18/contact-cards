// src/firebase/firestore.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'contact_cards';

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

    const docData = {
      id: slug,
      ...cardData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, COLLECTION_NAME, slug), docData);
    return slug;
  } catch (error) {
    console.error('Error creando tarjeta:', error);
    throw error;
  }
};

// Obtener tarjeta por slug
export const getContactCard = async (slug) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo tarjeta:', error);
    throw error;
  }
};

// Buscar tarjeta por nombre (para el input de búsqueda)
export const searchCardByName = async (searchTerm) => {
  try {
    const slug = generateSlug(searchTerm);
    return await getContactCard(slug);
  } catch (error) {
    console.error('Error buscando tarjeta:', error);
    throw error;
  }
};