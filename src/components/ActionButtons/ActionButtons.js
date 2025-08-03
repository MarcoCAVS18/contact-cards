// src/components/ActionButtons/ActionButtons.js
import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ActionButton from './ActionButton';

const ActionButtons = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleShare = async () => {
    const contactText = `
Tec. Pablo Bruna
Técnico Especializado

Teléfono: +54 341 591 3543
Email: pablo@acopiadorescoop.com.ar
Email Personal: pablobruna0809@gmail.com
Ubicación: Argentina
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Contacto - Tec. Pablo Bruna',
          text: contactText
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
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Tec. Pablo Bruna
N:Bruna;Pablo;Tec.;;
TITLE:Técnico Especializado
TEL;TYPE=CELL:+543415913543
EMAIL;TYPE=WORK:pablo@acopiadorescoop.com.ar
EMAIL;TYPE=HOME:pablobruna0809@gmail.com
ADR;TYPE=WORK:;;;;;;Argentina
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Pablo_Bruna_Contacto.vcf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setAlertMessage('Contacto descargado');
    setShowAlert(true);
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
