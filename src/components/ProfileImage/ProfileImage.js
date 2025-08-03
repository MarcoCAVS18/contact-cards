// src/components/ProfileImage/ProfileImage.js
import React from 'react';
import { Avatar, Box } from '@mui/material';

const ProfileImage = () => {
  return (
    <Box 
      display="flex" 
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      mb={{ xs: 2, md: 0 }}
    >
      <Avatar
        sx={{
          width: { xs: 80, md: 90 },
          height: { xs: 80, md: 90 },
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          fontSize: { xs: '1.5rem', md: '1.75rem' },
          fontWeight: 600,
          color: 'white',
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        PB
      </Avatar>
    </Box>
  );
};

export default ProfileImage;
