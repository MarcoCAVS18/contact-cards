// src/pages/ManageCard.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  TextField,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import BackButton from '../components/BackButton/BackButton';
import EditCardModal from '../components/Modals/EditCardModal';
import DeleteCardModal from '../components/Modals/DeleteCardModal';
import { getCardForEditing, sendCodeReminderEmail } from '../firebase/firestore';

const ManageCard = () => {
  const navigate = useNavigate();
  const { slug: urlSlug } = useParams();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    cardName: '',
    secretCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estados para modales
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [currentSlug, setCurrentSlug] = useState('');
  const [currentCode, setCurrentCode] = useState('');

  // Auto-cargar si viene de URL directa
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (urlSlug && codeFromUrl) {
      const displayName = urlSlug.replace(/_/g, ' ');
      setFormData({
        cardName: displayName,
        secretCode: codeFromUrl
      });
      // Auto-abrir modal de edición
      loadCardAndEdit(urlSlug, codeFromUrl);
    }
  }, [urlSlug, searchParams]);

  const loadCardAndEdit = async (slug, code) => {
    try {
      setLoading(true);
      const card = await getCardForEditing(slug, code);
      setCardData(card);
      setCurrentSlug(slug);
      setCurrentCode(code);
      setEditModalOpen(true);
    } catch (err) {
      setError(err.message || 'Error al verificar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleEdit = async () => {
    if (!formData.cardName.trim() || !formData.secretCode.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    const slug = formData.cardName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^-+|-+$/g, '');

    await loadCardAndEdit(slug, formData.secretCode.toUpperCase());
  };

  const handleDelete = async () => {
    if (!formData.cardName.trim() || !formData.secretCode.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const slug = formData.cardName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_')
        .replace(/^-+|-+$/g, '');

      const card = await getCardForEditing(slug, formData.secretCode.toUpperCase());
      setCardData(card);
      setCurrentSlug(slug);
      setCurrentCode(formData.secretCode.toUpperCase());
      setDeleteModalOpen(true);
    } catch (err) {
      setError(err.message || 'Error al verificar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.cardName.trim()) {
      setError('Por favor ingresa el nombre de tu tarjeta para reenviar el código');
      return;
    }

    setLoadingResend(true);
    setError('');
    setSuccessMessage('');

    try {
      const slug = formData.cardName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_')
        .replace(/^-+|-+$/g, '');

      await sendCodeReminderEmail(slug);
      setSuccessMessage('Si existe una tarjeta con ese nombre, hemos enviado el código a tu email');
    } catch (err) {
      setError('Error al enviar el código. Verifica que el nombre sea correcto.');
    } finally {
      setLoadingResend(false);
    }
  };

  const handleModalSuccess = (message) => {
    setSuccessMessage(message);
    setError('');
    // Si es eliminación, limpiar formulario y redirigir
    if (message.includes('eliminada')) {
      setFormData({ cardName: '', secretCode: '' });
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        py={4}
      >
        {/* Botón volver */}
        <Box mb={3}>
          <BackButton />
        </Box>

        {/* Header */}
        <Box 
          textAlign="center" 
          mb={4}
          pt={{ xs: 2, md: 4 }}
          sx={{ minHeight: { xs: '140px', md: '160px' } }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <SecurityIcon 
            sx={{ 
              fontSize: '3rem', 
              color: 'white',
              mb: 1,
              filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 1,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            Gestionar Tarjeta
          </Typography>
          <Typography 
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Edita o elimina tu tarjeta digital
          </Typography>
        </Box>

        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          {/* Main Card */}
          <Card 
            elevation={0}
            sx={{
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 12px 25px rgba(0,0,0,0.15)',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                color="text.primary"
                mb={3}
                textAlign="center"
                sx={{ fontWeight: 600 }}
              >
                Verificar Identidad
              </Typography>

              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  fullWidth
                  label="Nombre de tu tarjeta"
                  placeholder="Ej: Juan Pérez"
                  value={formData.cardName}
                  onChange={handleChange('cardName')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Código de acceso"
                  placeholder="Ej: ABC12345"
                  value={formData.secretCode}
                  onChange={handleChange('secretCode')}
                  inputProps={{ 
                    style: { 
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      letterSpacing: '0.1em'
                    } 
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                    }
                  }}
                />

                {/* Enlace para reenviar código */}
                <Box textAlign="center" mt={1}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleResendCode}
                    disabled={loadingResend}
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5
                    }}
                  >
                    {loadingResend ? (
                      <CircularProgress size={16} />
                    ) : (
                      <EmailIcon sx={{ fontSize: '1rem' }} />
                    )}
                    {loadingResend ? 'Enviando...' : 'No recuerdas tu código? No drama, haz click'}
                  </Link>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {successMessage && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {successMessage}
                  </Alert>
                )}

                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
                    disabled={loading}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                      }
                    }}
                  >
                    {loading ? 'Verificando...' : 'Editar Tarjeta'}
                  </Button>

                  <Button
                    onClick={handleDelete}
                    variant="outlined"
                    size="large"
                    startIcon={<DeleteIcon />}
                    disabled={loading}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      '&:hover': {
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        color: '#dc2626',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    Eliminar Tarjeta
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Modales */}
      <EditCardModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        cardData={cardData}
        slug={currentSlug}
        secretCode={currentCode}
        onSuccess={handleModalSuccess}
      />

      <DeleteCardModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        cardData={cardData}
        slug={currentSlug}
        secretCode={currentCode}
        onSuccess={handleModalSuccess}
      />
    </Container>
  );
};

export default ManageCard;