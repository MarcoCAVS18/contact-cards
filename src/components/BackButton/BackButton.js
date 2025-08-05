// src/components/BackButton/BackButton.js
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ text = 'Volver', to = '/' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <Button
      onClick={handleBack}
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      sx={{
        color: 'white',
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.5)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
        }
      }}
    >
      {text}
    </Button>
  );
};

export default BackButton;