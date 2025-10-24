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
import { Profile, Ticket } from '../types';
import { COLORS, COLORS_DARK } from '../theme';
import { transitions } from '../utils/transitions';
import PastEventsSection from './PastEventsSection';

interface ProfileSectionProps {
  profile: Profile;
  onUpdate: (updatedProfile: Profile) => void;
  isDarkMode?: boolean;
  pastTickets?: Ticket[];
  onReceipt?: (ticketId: string) => void;
  onViewTicket?: (ticketId: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdate,
  isDarkMode = false,
  pastTickets = [],
  onReceipt = () => {},
  onViewTicket = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [orderHistoryExpanded, setOrderHistoryExpanded] = useState(false);

  // Use appropriate color constants based on theme mode
  const colors = isDarkMode ? COLORS_DARK : COLORS;

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
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '16px',
        py: 1,
        px: { xs: 0, md: 0 },
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, md: 1 },
        position: 'relative',
        boxShadow: '0px 4px 12px 0px rgba(0,0,0,.05), 0px 2px 4px 0px rgba(0,0,0,0.025)',
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
            alignItems: { xs: 'center', md: 'center' }, 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            mb: 0,
            px: 3,
            pt: 2,
            gap: 2,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 1,
              flex: 1
            }}
          >
            {/* Subhead */}
            <Typography 
              variant="sectionHeader" 
              component="h1" 
              sx={{ 
                color: colors.primaryText,
                pt: { xs: 0, md: 0 },
                mb: 0,
                textAlign: 'left',
                ...transitions.A(true),
              }}
            >
              Account
            </Typography>
            
            {/* Main Headline */}
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '32px',
                color: colors.primaryText,
                letterSpacing: '-.0325em',
                lineHeight: '1.1',
                textTransform: 'capitalize',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Profile
            </Typography>
          </Box>
          
          {!isEditing ? (
            <Button
              id="edit-profile-button"
              className="edit-profile-button"
              variant="outlined"
              onClick={handleEdit}
              aria-label="Edit profile information"
              sx={{
                height: '40px',
                px: 2,
                py: 1.5,
                borderRadius: '8px',
                borderColor: colors.borderLight,
                color: colors.primaryText,
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08)',
                ...transitions.A(true),
                '&:hover': {
                  borderColor: colors.borderLight,
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
              sx={{ 
                display: 'flex', 
                gap: 1,
                ...transitions.A(true),
              }}
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
                  height: '40px',
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  borderColor: colors.borderLight,
                  color: colors.primaryText,
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: colors.borderLight,
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
                  height: '40px',
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  backgroundColor: '#000000',
                  fontSize: '14px',
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
          sx={{ px: 3, py: 0 }} // Match header padding
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
              sx={{ mb: 1.5, borderColor: colors.borderLight }} 
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
                  color: colors.iconColor,
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
                  color: colors.iconColor,
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
                      color: colors.primaryText,
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
                      color: colors.primaryText,
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
              sx={{ mb: 1.5, borderColor: colors.borderLight }} 
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
                  color: colors.iconColor,
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
                  color: colors.iconColor,
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
                      color: colors.primaryText,
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
                      color: colors.primaryText,
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

        {/* Order History Section */}
        {pastTickets.length > 0 && (
          <PastEventsSection 
            tickets={pastTickets}
            expanded={orderHistoryExpanded}
            onToggleExpanded={() => setOrderHistoryExpanded(!orderHistoryExpanded)}
            onReceipt={onReceipt}
            onViewTicket={onViewTicket}
            isDarkMode={isDarkMode}
          />
        )}
    </Box>
  );
};

export default ProfileSection;
