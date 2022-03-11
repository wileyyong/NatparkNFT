// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
// sections
import { RegisterForm } from '../../sections/auth/register';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {

  return (
    <Page title="Register">
      <RootStyle>
        <Container>
          <ContentStyle>
            <Box margin="0 auto 30px">
              <Logo sx={{ width: 80, height: 80 }} />
            </Box>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Let's set you up with a profile
                </Typography>
              </Box>
            </Box>

            <RegisterForm />

          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
