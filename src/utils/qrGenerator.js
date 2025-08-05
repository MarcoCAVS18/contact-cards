// src/utils/qrGenerator.js
import QRCode from 'qrcode';

// Generar vCard string
export const generateVCard = (cardData) => {
  const { personalInfo, contactInfo } = cardData;
  
  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${personalInfo.fullName}
N:${personalInfo.fullName.split(' ').reverse().join(';')};;;
TITLE:${personalInfo.title}
TEL;TYPE=CELL:${contactInfo.phone.replace(/\s/g, '')}
EMAIL;TYPE=WORK:${contactInfo.corporateEmail}
EMAIL;TYPE=HOME:${contactInfo.personalEmail}
URL:${window.location.origin}/card/${cardData.id}
END:VCARD`;

  return vCard;
};

// Generar código QR como Data URL
export const generateQRCode = async (cardData) => {
  try {
    const vCardString = generateVCard(cardData);
    const qrCodeDataURL = await QRCode.toDataURL(vCardString, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};

// Generar URL de descarga de vCard
export const downloadVCard = (cardData) => {
  const vCardString = generateVCard(cardData);
  const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cardData.personalInfo.fullName.replace(/\s/g, '_')}_Contacto.vcf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};