// src/components/CreateCardForm/ContactInfoForm.js
import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const ContactInfoForm = ({ data, onChange }) => {
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
        Información de Contacto
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          fullWidth
          label="Teléfono"
          placeholder="Ej: +54 11 1234 5678"
          value={data.phone}
          onChange={handleChange('phone')}
          required
          type="tel"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }
          }}
        />

        <TextField
          fullWidth
          label="Email Corporativo"
          placeholder="Ej: juan@empresa.com"
          value={data.corporateEmail}
          onChange={handleChange('corporateEmail')}
          type="email"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }
          }}
        />

        <TextField
          fullWidth
          label="Email Personal"
          placeholder="Ej: juan.perez@gmail.com"
          value={data.personalEmail}
          onChange={handleChange('personalEmail')}
          type="email"
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
            <strong>Nota:</strong> Al menos el teléfono es obligatorio. Los emails son opcionales pero recomendados para una tarjeta más completa.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactInfoForm;