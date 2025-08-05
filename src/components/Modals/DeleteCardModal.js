// src/components/Modals/DeleteCardModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { deleteContactCard } from '../../firebase/firestore';

const DeleteCardModal = ({ open, onClose, cardData, slug, secretCode, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás absolutamente seguro de que quieres eliminar la tarjeta de "${cardData?.personalInfo?.fullName}"?\n\nEsta acción NO se puede deshacer.`
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');

    try {
      await deleteContactCard(slug, secretCode);
      onSuccess('Tarjeta eliminada exitosamente');
      onClose();
    } catch (err) {
      setError(err.message || 'Error al eliminar la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon sx={{ color: '#ef4444' }} />
            <Typography variant="h6" component="div" fontWeight={600}>
              Eliminar Tarjeta
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {cardData && (
          <Box mb={3}>
            {/* Información de la tarjeta a eliminar */}
            <Box 
              sx={{
                p: 3,
                backgroundColor: '#fef2f2',
                borderRadius: 2,
                border: '1px solid #fecaca',
                mb: 3
              }}
            >
              <Typography variant="h6" color="text.primary" mb={1}>
                {cardData.personalInfo?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {cardData.personalInfo?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cardData.contactInfo?.phone}
              </Typography>
            </Box>

            {/* Advertencia */}
            <Alert 
              severity="warning" 
              sx={{ mb: 2, borderRadius: 2 }}
            >
              <Typography variant="body2">
                <strong>¡Atención!</strong> Al eliminar esta tarjeta:
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                <li>Se perderá toda la información</li>
                <li>Los enlaces compartidos dejarán de funcionar</li>
                <li>Esta acción no se puede deshacer</li>
              </Box>
            </Alert>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#4b5563',
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
            }
          }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleDelete}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          disabled={loading}
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626',
            }
          }}
        >
          {loading ? 'Eliminando...' : 'Eliminar Tarjeta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCardModal;