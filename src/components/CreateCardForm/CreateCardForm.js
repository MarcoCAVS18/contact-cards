// src/components/CreateCardForm/CreateCardForm.js
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import PersonalInfoForm from './PersonalInfoForm';
import ContactInfoForm from './ContactInfoForm';
import SocialLinksForm from './SocialLinksForm';
import { createContactCard } from '../../firebase/firestore';

const CreateCardForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Información Personal', 'Datos de Contacto', 'Redes Sociales'];

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      title: '',
      initials: ''
    },
    contactInfo: {
      phone: '',
      corporateEmail: '',
      personalEmail: ''
    },
    socialLinks: {
      linkedin: '',
      instagram: '',
      twitter: ''
    }
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const generateInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validar información personal
      if (!formData.personalInfo.fullName.trim() || !formData.personalInfo.title.trim()) {
        setError('Por favor completa el nombre completo y el título');
        return;
      }
      // Generar iniciales automáticamente
      const initials = generateInitials(formData.personalInfo.fullName);
      updateFormData('personalInfo', { initials });
    }
    
    if (activeStep === 1) {
      // Validar información de contacto
      if (!formData.contactInfo.phone.trim()) {
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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const slug = await createContactCard(formData);
      navigate(`/card/${slug}`);
    } catch (err) {
      setError(err.message || 'Error al crear la tarjeta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm 
            data={formData.personalInfo}
            onChange={(data) => updateFormData('personalInfo', data)}
          />
        );
      case 1:
        return (
          <ContactInfoForm 
            data={formData.contactInfo}
            onChange={(data) => updateFormData('contactInfo', data)}
          />
        );
      case 2:
        return (
          <SocialLinksForm 
            data={formData.socialLinks}
            onChange={(data) => updateFormData('socialLinks', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{
        borderRadius: 3,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 12px 25px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '600px'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h4" 
            component="h1" 
            color="text.primary"
            mb={1}
            sx={{ fontWeight: 600 }}
          >
            Crear Nueva Tarjeta
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            Completa la información para crear tu tarjeta digital profesional
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Content */}
        <Box mb={4}>
          {getStepContent(activeStep)}
        </Box>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
            sx={{
              visibility: activeStep === 0 ? 'hidden' : 'visible'
            }}
          >
            Anterior
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
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
              {loading ? 'Creando...' : 'Crear Tarjeta'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
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
      </CardContent>
    </Card>
  );
};

export default CreateCardForm;