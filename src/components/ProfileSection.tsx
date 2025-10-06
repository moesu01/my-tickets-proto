import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
} from '@mui/icons-material';
import { Profile } from '../types';

interface ProfileSectionProps {
  profile: Profile;
  onUpdate: (updatedProfile: Profile) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    onUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof Profile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  };

  const isFormValid = () => {
    return (
      editedProfile.firstName.trim() !== '' &&
      editedProfile.lastName.trim() !== '' &&
      validateEmail(editedProfile.email) &&
      validatePhone(editedProfile.phone)
    );
  };

  return (
    <Box 
      component="section"
      id="profile-section"
      className="profile-section"
      sx={{ 
        mb: 4,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        py: 1.5, // 12px vertical padding
        px: 0
      }}
      aria-labelledby="profile-heading"
      role="region"
      aria-label="User profile information"
    >
        {/* Header Section */}
        <Box 
          component="header"
          id="profile-header"
          className="profile-header"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1.5, // 12px bottom padding
            pt: 0,
            px: 1.5, // 12px horizontal padding
            mb: 0,
            cursor: 'default'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
              <Typography variant="h5" sx={{ 
                fontSize: '1.25rem', 
                fontWeight: 400, 
                color: '#4a5568',
                letterSpacing: '-0.6px'
              }}>
                My Profile
              </Typography>
              <PersonIcon 
                id="profile-icon"
                className="profile-icon"
                sx={{ color: '#4a5568', fontSize: '18px' }} 
                aria-hidden="true"
              />
            </Box>
          </Box>
          
          {!isEditing ? (
            <Button
              id="edit-profile-button"
              className="edit-profile-button"
              variant="outlined"
              onClick={handleEdit}
              aria-label="Edit profile information"
              sx={{
                height: '30px',
                px: 1.5,
                py: 1.25,
                borderRadius: '8px',
                borderColor: '#cbd5e0',
                color: '#4a5568',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
                '&:hover': {
                  borderColor: '#a0aec0',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box 
              id="profile-action-buttons"
              className="profile-action-buttons"
              component="div"
              sx={{ display: 'flex', gap: 1 }}
              role="group"
              aria-label="Profile editing actions"
            >
              <Button
                id="cancel-edit-button"
                className="cancel-edit-button"
                variant="outlined"
                onClick={handleCancel}
                aria-label="Cancel editing profile"
                sx={{
                  height: '30px',
                  px: 1.5,
                  py: 1.25,
                  borderRadius: '8px',
                  borderColor: '#cbd5e0',
                  color: '#4a5568',
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#a0aec0',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                id="save-profile-button"
                className="save-profile-button"
                variant="contained"
                onClick={handleSave}
                disabled={!isFormValid()}
                aria-label="Save profile changes"
                sx={{
                  height: '30px',
                  px: 1.5,
                  py: 1.25,
                  borderRadius: '8px',
                  backgroundColor: '#000000',
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                  '&:disabled': {
                    backgroundColor: '#cbd5e0',
                    color: '#718096',
                  },
                }}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>

        {/* Profile Fields Section */}
        <Box 
          component="main"
          id="profile-fields-section"
          className="profile-fields-section"
          sx={{ px: 1.5, py: 0 }} // 12px horizontal padding
          role="main"
          aria-label="Profile information fields"
        >
          {/* First Name / Last Name Row */}
          <Box 
            component="section"
            id="name-fields-section"
            className="name-fields-section"
            sx={{ py: 1 }} // 8px vertical padding only
            aria-labelledby="name-fields-heading"
          >
            <Divider 
              id="name-fields-divider"
              className="name-fields-divider"
              sx={{ mb: 1.5, borderColor: '#e2e8f0' }} 
              role="separator"
              aria-hidden="true"
            />
            
            {/* Labels Row */}
            <Box 
              id="name-fields-labels"
              className="name-fields-labels"
              component="div"
              sx={{ 
                display: 'flex', 
                gap: 3, // 24px spacing
                mb: 0.75,
                px: 1.5 // 12px horizontal padding
              }}
              role="row"
              aria-label="Name field labels"
            >
              <Typography 
                id="first-name-label"
                component="label"
                htmlFor="first-name-field"
                variant="caption" 
                className="first-name-label"
                sx={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#718096',
                  lineHeight: '1.25',
                  flex: 1
                }}
              >
                First Name
              </Typography>
              <Typography 
                id="last-name-label"
                component="label"
                htmlFor="last-name-field"
                variant="caption" 
                className="last-name-label"
                sx={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#718096',
                  lineHeight: '1.25',
                  flex: 1
                }}
              >
                Last Name
              </Typography>
            </Box>

            {/* Values Row */}
            <Box 
              id="name-fields-values"
              className="name-fields-values"
              component="div"
              sx={{ 
                display: 'flex', 
                gap: 3, // 24px spacing
                alignItems: isEditing ? 'flex-start' : 'center',
                px: 1.5 // 12px horizontal padding
              }}
              role="row"
              aria-label="Name field values"
            >
              <Box 
                id="first-name-field-container"
                className="first-name-field-container"
                component="div"
                sx={{ flex: 1 }}
              >
                {isEditing ? (
                  <TextField
                    id="first-name-field"
                    name="firstName"
                    className="first-name-field"
                    value={editedProfile.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={editedProfile.firstName.trim() === ''}
                    helperText={editedProfile.firstName.trim() === '' ? "First name is required" : ""}
                    aria-describedby={editedProfile.firstName.trim() === '' ? "first-name-error" : undefined}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                        height: '40px', // Increased height for better touch targets
                        fontSize: '16px',
                      },
                      '& .MuiFormHelperText-root': {
                        marginTop: 0.5,
                        fontSize: '12px',
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    id="first-name-value"
                    component="span"
                    variant="body1" 
                    className="first-name-value"
                    sx={{ 
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#2d3748',
                      lineHeight: '24px'
                    }}
                  >
                    {profile.firstName}
                  </Typography>
                )}
              </Box>
              
              <Box 
                id="last-name-field-container"
                className="last-name-field-container"
                component="div"
                sx={{ flex: 1 }}
              >
                {isEditing ? (
                  <TextField
                    id="last-name-field"
                    name="lastName"
                    className="last-name-field"
                    value={editedProfile.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={editedProfile.lastName.trim() === ''}
                    helperText={editedProfile.lastName.trim() === '' ? "Last name is required" : ""}
                    aria-describedby={editedProfile.lastName.trim() === '' ? "last-name-error" : undefined}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                        height: '40px', // Increased height for better touch targets
                        fontSize: '16px',
                      },
                      '& .MuiFormHelperText-root': {
                        marginTop: 0.5,
                        fontSize: '12px',
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    id="last-name-value"
                    component="span"
                    variant="body1" 
                    className="last-name-value"
                    sx={{ 
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#2d3748',
                      lineHeight: '24px'
                    }}
                  >
                    {profile.lastName}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Email / Phone Number Row */}
          <Box 
            component="section"
            id="contact-fields-section"
            className="contact-fields-section"
            sx={{ py: 1 }} // 8px vertical padding only
            aria-labelledby="contact-fields-heading"
          >
            <Divider 
              id="contact-fields-divider"
              className="contact-fields-divider"
              sx={{ mb: 1.5, borderColor: '#e2e8f0' }} 
              role="separator"
              aria-hidden="true"
            />
            
            {/* Labels Row */}
            <Box 
              id="contact-fields-labels"
              className="contact-fields-labels"
              component="div"
              sx={{ 
                display: 'flex', 
                gap: 3, // 24px spacing
                mb: 0.75,
                px: 1.5 // 12px horizontal padding
              }}
              role="row"
              aria-label="Contact field labels"
            >
              <Typography 
                id="email-label"
                component="label"
                htmlFor="email-field"
                variant="caption" 
                className="email-label"
                sx={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#718096',
                  lineHeight: '1.25',
                  flex: 1
                }}
              >
                Email
              </Typography>
              <Typography 
                id="phone-label"
                component="label"
                htmlFor="phone-field"
                variant="caption" 
                className="phone-label"
                sx={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#718096',
                  lineHeight: '1.25',
                  flex: 1
                }}
              >
                Phone Number
              </Typography>
            </Box>

            {/* Values Row */}
            <Box 
              id="contact-fields-values"
              className="contact-fields-values"
              component="div"
              sx={{ 
                display: 'flex', 
                gap: 3, // 24px spacing
                alignItems: isEditing ? 'flex-start' : 'center',
                px: 1.5 // 12px horizontal padding
              }}
              role="row"
              aria-label="Contact field values"
            >
              <Box 
                id="email-field-container"
                className="email-field-container"
                component="div"
                sx={{ flex: 1 }}
              >
                {isEditing ? (
                  <TextField
                    id="email-field"
                    name="email"
                    className="email-field"
                    value={editedProfile.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    type="email"
                    error={!validateEmail(editedProfile.email)}
                    helperText={!validateEmail(editedProfile.email) ? "Please enter a valid email address" : ""}
                    aria-describedby={!validateEmail(editedProfile.email) ? "email-error" : undefined}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                        height: '40px', // Increased height for better touch targets
                        fontSize: '16px',
                      },
                      '& .MuiFormHelperText-root': {
                        marginTop: 0.5,
                        fontSize: '12px',
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    id="email-value"
                    component="span"
                    variant="body1" 
                    className="email-value"
                    sx={{ 
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#2d3748',
                      lineHeight: '24px'
                    }}
                  >
                    {profile.email}
                  </Typography>
                )}
              </Box>
              
              <Box 
                id="phone-field-container"
                className="phone-field-container"
                component="div"
                sx={{ flex: 1 }}
              >
                {isEditing ? (
                  <TextField
                    id="phone-field"
                    name="phone"
                    className="phone-field"
                    value={editedProfile.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    type="tel"
                    error={!validatePhone(editedProfile.phone)}
                    helperText={!validatePhone(editedProfile.phone) ? "Please enter a valid phone number" : ""}
                    aria-describedby={!validatePhone(editedProfile.phone) ? "phone-error" : undefined}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                        height: '40px', // Increased height for better touch targets
                        fontSize: '16px',
                      },
                      '& .MuiFormHelperText-root': {
                        marginTop: 0.5,
                        fontSize: '12px',
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    id="phone-value"
                    component="span"
                    variant="body1" 
                    className="phone-value"
                    sx={{ 
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#2d3748',
                      lineHeight: '24px'
                    }}
                  >
                    {profile.phone}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default ProfileSection;
