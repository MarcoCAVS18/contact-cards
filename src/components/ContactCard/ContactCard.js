// src/components/ContactCard/ContactCard.js
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Box,
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProfileImage from '../ProfileImage/ProfileImage';
import PersonalInfo from '../PersonalInfo/PersonalInfo';
import ContactInfo from '../ContactInfo/ContactInfo';
import SocialLinks from '../SocialLinks/SocialLinks';
import ActionButtons from '../ActionButtons/ActionButtons';
import CardFooter from '../CardFooter/CardFooter';
import qrImage from '../../assets/qr.jpg';

const ContactCard = () => {
  const [showQR, setShowQR] = useState(false);

  const handleToggleQR = () => {
    setShowQR(!showQR);
  };
  return (
    <Container maxWidth="sm">
      <Card 
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 12px 25px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'visible',
          // Elemento decorativo inspirado en Indicius
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '50%',
            opacity: 0.8,
          }
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative' }}>
          {/* Círculo decorativo interno */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              opacity: 0.6,
            }}
          />
          
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <ProfileImage />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="column">
                <PersonalInfo />
                <ContactInfo />
                <SocialLinks />
                <ActionButtons />
              </Box>
            </Grid>
          </Grid>
          
          <CardFooter onToggleQR={handleToggleQR} showQR={showQR} />
          
          {/* Sección del QR expandible */}
          <Collapse in={showQR}>
            <Box 
              mt={3}
              pt={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                borderTop: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              {/* Botón cerrar */}
              <Box 
                display="flex" 
                justifyContent="flex-end" 
                width="100%"
                mb={2}
              >
                <IconButton
                  onClick={handleToggleQR}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    }
                  }}
                >
                  <CloseIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Box>
              
              {/* QR Code imagen */}
              <Box
                sx={{
                  width: '200px',
                  height: '200px',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={qrImage}
                  alt="QR Code para contacto"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                textAlign="center"
              >
                Escanea con tu teléfono para guardar el contacto
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactCard;