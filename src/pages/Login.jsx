import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Stack, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
import AuthSocial from '../sections/auth/AuthSocial';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: 0,
  padding: 0,
  backgroundImage: "url('/loginbackground2.jpg')",
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundAttachment: 'fixed',
  height: 'calc(100vh - 0px)'
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    // padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  filter: 'brightness(1)',
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  // padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {

  return (
    <Page title="Login">
      <RootStyle>
        <Container>
          <ContentStyle>
            {/* <Box sx={{ width: 500, filter: 'brightness(0.5)', height: 400, objectFit: 'contain', objectFit: 'cover' }} component='img' src='/loginbackground.jpg' /> */}
            <Card sx={{ p: 2, width: 500, minHeight: 400 }}>
              <Stack direction='row'>
                <Stack flexGrow={1}>
                  <Typography variant="h4" gutterBottom>
                    Sign in 
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 2 }}>Enter your details below.</Typography>
                  <LoginForm />
                </Stack>
              </Stack>
            </Card>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
