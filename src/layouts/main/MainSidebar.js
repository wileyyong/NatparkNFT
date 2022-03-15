
// @mui
import { styled } from '@mui/material/styles';
import { Link } from '@mui/material';
// routes
// import { PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/Logo';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function MainSidebar() {
  return (
    <RootStyle>
      <Logo />
      <Link href="/mynfts">My NFTs</Link>
      <Link href="/leaderboard">Leaderboard</Link>
    </RootStyle>
  );
}
