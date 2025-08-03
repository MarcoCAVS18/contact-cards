// src/components/ContactCard/ContactCard.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Box 
} from '@mui/material';
import ProfileImage from '../ProfileImage/ProfileImage';
import PersonalInfo from '../PersonalInfo/PersonalInfo';
import ContactInfo from '../ContactInfo/ContactInfo';
import SocialLinks from '../SocialLinks/SocialLinks';
import ActionButtons from '../ActionButtons/ActionButtons';
import CardFooter from '../CardFooter/CardFooter';

const ContactCard = () => {
  return (
    <Container maxWidth="sm">
      <Card 
        elevation={1}
        sx={{
          borderRadius: 2,
          background: 'white',
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
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
          
          <CardFooter />
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactCard;