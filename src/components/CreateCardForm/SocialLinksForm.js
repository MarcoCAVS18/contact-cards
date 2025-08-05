// src/components/CreateCardForm/SocialLinksForm.js
import React from 'react';
import { Box, TextField, Typography, InputAdornment } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const SocialLinksForm = ({ data, onChange }) => {
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
        Redes Sociales
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          fullWidth
          label="LinkedIn"
          placeholder="https://linkedin.com/in/tu-perfil"
          value={data.linkedin}
          onChange={handleChange('linkedin')}
          type="url"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkedInIcon sx={{ color: '#0077b5' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }
          }}
        />

        <TextField
          fullWidth
          label="Instagram"
          placeholder="https://instagram.com/tu-usuario"
          value={data.instagram}
          onChange={handleChange('instagram')}
          type="url"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <InstagramIcon sx={{ color: '#E4405F' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }
          }}
        />

        <TextField
          fullWidth
          label="Twitter"
          placeholder="https://twitter.com/tu-usuario"
          value={data.twitter}
          onChange={handleChange('twitter')}
          type="url"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TwitterIcon sx={{ color: '#1DA1F2' }} />
              </InputAdornment>
            ),
          }}
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
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Opcional:</strong> Las redes sociales son completamente opcionales. Puedes dejar en blanco las que no uses o agregar solo las que consideres importantes para tu tarjeta profesional.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SocialLinksForm;