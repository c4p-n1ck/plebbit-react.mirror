import React, { useContext } from 'react';
import { ProfileContext } from '../../store/profileContext';
import { useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/layout';
import { useColorModeValue, Image } from '@chakra-ui/react';
import NavBar from './NavBar';
import plebbitDarkLogo from '../../assets/svgs/plebbitDarkLogo.svg';

export default function Layout({ children }) {
  const { showSplashcreen } = useContext(ProfileContext);
  const location = useLocation();
  const bg = useColorModeValue('lightLayoutBg', 'darkLayoutBg');
  const postDetailBg = useColorModeValue('postDetailLightBg', 'postDetailDarkBg');

  if (showSplashcreen) {
    return (
      <Box width="100%" height="100vh" display="flex" justifyContent="center" alignItems="center">
        <Image
          width="200px"
          rounded="full"
          sx={{
            transform: 'scale(1)',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                boxShadow: '0 0 0 0 rgba(204,169,44, 0.4)',
              },
              '50%': {
                transform: 'scale(1.2)',
                boxShadow: '0 0 0 30px rgba(204,169,44, 0)',
              },
              '100%': {
                transform: 'scale(0.95)',
                boxShadow: '0 0 0 0 rgba(204,169,44, 0)',
              },
            },
          }}
          height="200xp"
          src={plebbitDarkLogo}
        />
      </Box>
    );
  }

  return (
    <Box
      align="center"
      textAlign="left"
      minH="calc(100vh)"
      bg={location?.pathname === '/postId' ? postDetailBg : bg}
    >
      <NavBar />

      {children}
    </Box>
  );
}
