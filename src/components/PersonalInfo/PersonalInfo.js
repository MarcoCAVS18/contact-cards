// src/components/CreateCardForm/PersonalInfoForm.js
import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Avatar, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const PersonalInfoForm = ({ data, onChange }) => {
  const [imageError, setImageError] = useState('');

  const handleChange = (field) => (event) => {
    onChange({ [field]: event.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageError('');

    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setImageError('Por favor selecciona solo archivos de imagen');
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('La imagen debe ser menor a 2MB');
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({ profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange({ profileImage: '' });
    setImageError('');
  };

  const generateInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Box>
      <Typography 
        variant="h6" 
        color="text.primary" 
        mb={3}
        sx={{ fontWeight: 600 }}
      >
        Información Personal
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Sección de imagen de perfil */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            src={data.profileImage}
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'white',
              border: '3px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            {!data.profileImage && generateInitials(data.fullName)}
          </Avatar>

          <Box display="flex" gap={1}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="small"
              sx={{ fontSize: '0.75rem' }}
            >
              {data.profileImage ? 'Cambiar' : 'Subir Foto'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            {data.profileImage && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                size="small"
                onClick={handleRemoveImage}
                sx={{ fontSize: '0.75rem' }}
              >
                Quitar
              </Button>
            )}
          </Box>

          {imageError && (
            <Alert severity="error" sx={{ width: '100%', fontSize: '0.8rem' }}>
              {imageError}
            </Alert>
          )}
        </Box>

        <TextField
          fullWidth
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez"
          value={data.fullName}
          onChange={handleChange('fullName')}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }
          }}
        />

        <TextField
          fullWidth
          label="Título Profesional"
          placeholder="Ej: Desarrollador Frontend, Gerente de Ventas"
          value={data.title}
          onChange={handleChange('title')}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }
          }}
        />

        <Box 
          sx={{
            p: 2,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(37, 99, 235, 0.2)'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Nota:</strong> Puedes subir una foto personal o usar las iniciales automáticas. La imagen debe ser menor a 2MB.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInfoForm;