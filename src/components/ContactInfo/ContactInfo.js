// src/components/ContactInfo/ContactInfo.js
import React from 'react';
import { Box } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContactItem from './ContactItem';

const ContactInfo = () => {
  const contactData = [
    {
      label: 'Teléfono',
      value: '+54 341 591 3543',
      href: 'tel:+543415913543',
      icon: PhoneOutlinedIcon
    },
    {
      label: 'Email Corporativo',
      value: 'pablo@acopiadorescoop.com.ar',
      href: 'mailto:pablo@acopiadorescoop.com.ar',
      icon: EmailOutlinedIcon
    },
    {
      label: 'Email Personal',
      value: 'pablobruna0809@gmail.com',
      href: 'mailto:pablobruna0809@gmail.com',
      icon: EmailOutlinedIcon
    }
  ];

  return (
    <Box>
      {contactData.map((contact, index) => (
        <ContactItem key={index} {...contact} />
      ))}
    </Box>
  );
};

export default ContactInfo;