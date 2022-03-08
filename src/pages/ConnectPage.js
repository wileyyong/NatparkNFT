import { styled } from '@mui/material/styles';
import { Grid, Box } from '@mui/material';
import Account from '../components/Account/Account';

const BackgroundStyle = styled('div')(({ theme }) => ({
  color: 'darkslategray',
  backgroundColor: 'lightblue',
  padding: '50, 100',
  height: '100vh',
}));

export default function Login() {
  return (
    <BackgroundStyle>
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Account />
      </Box>
    </BackgroundStyle>
  );
}
