// src/components/SocialLinks/SocialLinks.js
import React from 'react';
import { Box } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SocialButton from './SocialButton';

const SocialLinks = ({ socialData }) => {
  const socialNetworks = [];

  // Agregar LinkedIn si existe
  if (socialData.linkedin) {
    socialNetworks.push({
      name: 'LinkedIn',
      icon: LinkedInIcon,
      onClick: () => window.open(socialData.linkedin, '_blank')
    });
  }

  // Agregar Instagram si existe
  if (socialData.instagram) {
    socialNetworks.push({
      name: 'Instagram',
      icon: InstagramIcon,
      onClick: () => window.open(socialData.instagram, '_blank')
    });
  }

  // Agregar Twitter si existe
  if (socialData.twitter) {
    socialNetworks.push({
      name: 'Twitter',
      icon: TwitterIcon,
      onClick: () => window.open(socialData.twitter, '_blank')
    });
  }

  // No mostrar la sección si no hay redes sociales
  if (socialNetworks.length === 0) {
    return null;
  }

  return (
    <Box 
      display="flex" 
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      gap={1}
      mt={2}
    >
      {socialNetworks.map((social, index) => (
        <SocialButton key={index} {...social} />
      ))}
    </Box>
  );
};

export default SocialLinks;