// src/components/ActionButtons/ActionButton.js
import React from 'react';
import { Button } from '@mui/material';

const ActionButton = ({ onClick, variant, children, startIcon, color = 'primary' }) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      size="small"
      startIcon={startIcon}
      sx={{
        borderRadius: 1.5,
        padding: '8px 16px',
        fontWeight: 500,
        fontSize: '0.8rem',
        textTransform: 'none',
        minWidth: 'auto',
        '&.MuiButton-outlined': {
          borderColor: 'grey.300',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'grey.400',
            backgroundColor: 'grey.50',
          }
        }
      }}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
