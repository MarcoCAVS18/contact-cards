// src/components/CreateCardForm/PersonalInfoForm.js
import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const PersonalInfoForm = ({ data, onChange }) => {
  const handleChange = (field) => (event) => {
    onChange({ [field]: event.target.value });
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
            <strong>Nota:</strong> Las iniciales se generarán automáticamente a partir de tu nombre completo para el avatar de tu tarjeta.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInfoForm;