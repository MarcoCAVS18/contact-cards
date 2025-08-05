// src/components/Modals/EditCardModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonalInfoForm from '../CreateCardForm/PersonalInfoForm';
import ContactInfoForm from '../CreateCardForm/ContactInfoForm';
import SocialLinksForm from '../CreateCardForm/SocialLinksForm';
import { updateContactCard } from '../../firebase/firestore';

const EditCardModal = ({ open, onClose, cardData, slug, secretCode, onSuccess }) => {
  const [formData, setFormData] = useState(cardData || {});
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Información Personal', 'Datos de Contacto', 'Redes Sociales'];

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.personalInfo?.fullName?.trim() || !formData.personalInfo?.title?.trim()) {
        setError('Por favor completa el nombre completo y el título');
        return;
      }
    }
    
    if (activeStep === 1) {
      if (!formData.contactInfo?.phone?.trim()) {
        setError('Por favor ingresa al menos un número de teléfono');
        return;
      }
    }

    setError('');
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      await updateContactCard(slug, secretCode, {
        personalInfo: formData.personalInfo,
        contactInfo: formData.contactInfo,
        socialLinks: formData.socialLinks
      });
      
      onSuccess('Tarjeta actualizada exitosamente');
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError('');
    setFormData(cardData || {});
    onClose();
  };

  const getStepContent = (step) => {
    if (!formData) return null;
    
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm 
            data={formData.personalInfo || {}}
            onChange={(data) => updateFormData('personalInfo', data)}
          />
        );
      case 1:
        return (
          <ContactInfoForm 
            data={formData.contactInfo || {}}
            onChange={(data) => updateFormData('contactInfo', data)}
          />
        );
      case 2:
        return (
          <SocialLinksForm 
            data={formData.socialLinks || {}}
            onChange={(data) => updateFormData('socialLinks', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" fontWeight={600}>
            Editar Tarjeta
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        {/* Stepper horizontal para desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Stepper vertical para móvil */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical"
            sx={{ 
              '& .MuiStepLabel-label': {
                fontSize: '0.85rem',
                fontWeight: 500
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Content */}
        <Box mb={2}>
          {getStepContent(activeStep)}
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            variant="outlined"
            sx={{
              visibility: activeStep === 0 ? 'hidden' : 'visible'
            }}
          >
            Anterior
          </Button>

          <Box display="flex" gap={1}>
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outlined"
            >
              Cancelar
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSave}
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  }
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  }
                }}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCardModal;