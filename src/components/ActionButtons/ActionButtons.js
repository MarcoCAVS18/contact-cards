// src/components/ActionButtons/ActionButtons.js
import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ActionButton from './ActionButton';
import { downloadVCard } from '../../utils/qrGenerator';

const ActionButtons = ({ cardData }) => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleShare = async () => {
    const contactText = `
${cardData.personalInfo.fullName}
${cardData.personalInfo.title}

${cardData.contactInfo.phone ? `Teléfono: ${cardData.contactInfo.phone}` : ''}
${cardData.contactInfo.corporateEmail ? `Email Corporativo: ${cardData.contactInfo.corporateEmail}` : ''}
${cardData.contactInfo.personalEmail ? `Email Personal: ${cardData.contactInfo.personalEmail}` : ''}

Ver tarjeta completa: ${window.location.href}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contacto - ${cardData.personalInfo.fullName}`,
          text: contactText,
          url: window.location.href
        });
      } catch (error) {
        fallbackShare(contactText);
      }
    } else {
      fallbackShare(contactText);
    }
  };

  const fallbackShare = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setAlertMessage('Contacto copiado');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error al copiar');
      setShowAlert(true);
    }
  };

  const handleSaveContact = () => {
    try {
      downloadVCard(cardData);
      setAlertMessage('Contacto descargado');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error al descargar el contacto');
      setShowAlert(true);
    }
  };

  return (
    <>
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        gap={1.5}
        mt={3}
      >
        <ActionButton
          onClick={handleShare}
          variant="outlined"
          startIcon={<ShareOutlinedIcon />}
        >
          Compartir
        </ActionButton>
        
        <ActionButton
          onClick={handleSaveContact}
          variant="contained"
          color="primary"
          startIcon={<FileDownloadOutlinedIcon />}
        >
          Guardar
        </ActionButton>
      </Box>

      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="success"
          variant="standard"
          sx={{ fontSize: '0.8rem' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ActionButtons;
