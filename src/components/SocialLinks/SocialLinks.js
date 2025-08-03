// src/components/SocialLinks/SocialLinks.js
import React from 'react';
import { Box } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SocialButton from './SocialButton';

const SocialLinks = () => {
  const socialData = [
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      onClick: () => window.open('https://linkedin.com', '_blank')
    },
    {
      name: 'Instagram',
      icon: InstagramIcon,
      onClick: () => window.open('https://instagram.com', '_blank')
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      onClick: () => window.open('https://twitter.com', '_blank')
    }
  ];

  return (
    <Box 
      display="flex" 
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      gap={1}
      mt={2}
    >
      {socialData.map((social, index) => (
        <SocialButton key={index} {...social} />
      ))}
    </Box>
  );
};

export default SocialLinks;
