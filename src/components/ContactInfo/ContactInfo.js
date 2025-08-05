// src/components/ContactInfo/ContactInfo.js
import React from 'react';
import { Box } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContactItem from './ContactItem';

const ContactInfo = ({ contactData }) => {
  const contacts = [];

  // Agregar teléfono si existe
  if (contactData.phone) {
    contacts.push({
      label: 'Teléfono',
      value: contactData.phone,
      href: `tel:${contactData.phone.replace(/\s/g, '')}`,
      icon: PhoneOutlinedIcon
    });
  }

  // Agregar email corporativo si existe
  if (contactData.corporateEmail) {
    contacts.push({
      label: 'Email Corporativo',
      value: contactData.corporateEmail,
      href: `mailto:${contactData.corporateEmail}`,
      icon: EmailOutlinedIcon
    });
  }

  // Agregar email personal si existe
  if (contactData.personalEmail) {
    contacts.push({
      label: 'Email Personal',
      value: contactData.personalEmail,
      href: `mailto:${contactData.personalEmail}`,
      icon: EmailOutlinedIcon
    });
  }

  return (
    <Box>
      {contacts.map((contact, index) => (
        <ContactItem key={index} {...contact} />
      ))}
    </Box>
  );
};

export default ContactInfo;