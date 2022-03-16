/* eslint-disable react-hooks/exhaustive-deps */
import { useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Box, Grid, Link, CardMedia } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// import useLocalStorage from '../hooks/useLocalStorage';
import useAuth from '../hooks/useAuth';

import Page from '../components/Page';
import Image from '../components/Image';
// ----------------------------------------------------------------------

const LeftStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#1D252F',
  padding: '3rem 3rem',
  [theme.breakpoints.down('sm')]: {
    padding: '1rem 1rem'
  },
  margin: '1rem',
  height: 'calc(100vh - 2rem)',
  borderRadius: '10px',
  flexDirection: 'column'
}));

const RightStyle = styled('div')(() => ({
  display: 'flex',
  backgroundColor: '#161c24',
  padding: '0rem 1rem',
  height: '100vh',
  flexDirection: 'column',
  alignItems: 'center'
}));

const wallets = ['Metamask', 'Wallet Connect'];

function WalletDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select Wallet</DialogTitle>
      <List sx={{ p: 3 }}>
        {wallets.map((item) => (
          <ListItem button onClick={() => handleListItemClick(item)} key={item}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

WalletDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

// ----------------------------------------------------------------------

function App() {

  const navigate = useNavigate();
  const { isWeb3Enabled, isAuthenticated, enableWeb3, authenticate } = useMoralis();
  const { login } = useAuth();
  
  useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) {
      enableWeb3({provider: "walletconnect", chainId: 56});
      console.log("web3 activated");
    }
  }, [isWeb3Enabled, isAuthenticated, enableWeb3]);

  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [metaUser, setMetaUser] = useState(null);
  const [walletUser, setWalletUser] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedWallet(value);
  };

  useEffect(() => {
    const authCoinbaseWallet = async () => {
      try {
        const user = await authenticate({
          provider: "coinbase",
          chainId: 3,
          signingMessage: "Hello Coinbase"
        })
        console.log(user);
      } catch(err) {
        console.log(err);
      }
    }
    const authWalletConnect = async () => {
      try {
        const user = await authenticate({
          provider: "walletconnect",
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
          chainId: 56,
          signingMessage: "Hello wallet"
        });
        if(user) {
          login(user);
          setWalletUser(user);
        }
      } catch(err) {
        console.log(err);
      }
    }
  
    const authMetamask = async () => {
      try {
        const user = await authenticate({
          signingMessage: "Hello metamask"
        });
        if(user) {
          if(user.attributes && user.attributes.email) {
            login(user);
            setMetaUser(user)
          } else {
            navigate('/auth/register');
          }
        }
      } catch(err) {
        console.log(err);
      }
    }

    switch (selectedWallet) {
      case "Metamask":
        authMetamask();
        break;
      case "Wallet Connect":
        authWalletConnect();
        break;
      case "Coinbase Wallet":
        authCoinbaseWallet();
        break;
      default:
        break;
    }
  }, [selectedWallet, authenticate]);

  useEffect(() => {
    if(walletUser || metaUser) {
      navigate('/mynfts');
    }
  }, [walletUser, metaUser]);

  return (
    <Page title="Connect" sx={{backgroundColor: '#161c24'}}>
      <Grid container sx={{ flexWrap: 'wrap-reverse' }}>
        <Grid item lg={4}>
          <LeftStyle>
            <Typography component="p" variant="h6" sx={{ mt: '2rem', color: '#FFFFFF' }}>
              Imagine gettting rewarded for loving the outdoors and being passionate about national parks.
            </Typography>
            <Typography component="p" variant="h6" sx={{ mt: '2rem', color: '#919EAB' }}>
              HOW IT WORKS:
            </Typography>
            <Box sx={{mt: '2rem', display: 'flex'}}>
              <Typography sx={{ color: '#FFFFFF', mr: '2rem'}}>1.</Typography>
              <Typography sx={{ color: '#FFFFFF',}}>
                Collect NFTs of your favorite parks on 
                <Link href="#">
                  <Typography sx={{ color: '#5BE584',}}>OpenSea</Typography>
                </Link>
              </Typography>
            </Box>
            <Box sx={{mt: '2rem', display: 'flex'}}>
              <Typography sx={{ color: '#FFFFFF', mr: '2rem'}}>2.</Typography>
              <Typography sx={{ color: '#FFFFFF',}}>
                Earn Points for living your outdoor life and participating in our community 
                <Link href="#">
                  <Typography sx={{ color: '#5BE584',}}>like this</Typography>
                </Link>
              </Typography>
            </Box>
            <Box sx={{mt: '2rem', display: 'flex'}}>
              <Typography sx={{ color: '#FFFFFF', mr: '2rem'}}>3.</Typography>
              <Typography sx={{ color: '#FFFFFF',}}>
                Use your points on discounts, gear, and experiences from
                <Link href="#">
                  <Typography sx={{ color: '#5BE584',}}>our online shop</Typography>
                </Link>
              </Typography>
            </Box>
          </LeftStyle>
        </Grid>
        <Grid item lg={8}>
          <RightStyle>
            <Box sx={{mt: '17vh', height: '25vh'}}> 
            <Image
              src={'images/shield-logo.svg'}
              sx={{borderRadius: 1}}
            />
            </Box>
            <Box padding={{ xs: '1rem 1rem', sm: '1rem 3rem' }} width={{ sm: '50%' }}>
              <Typography component="p" variant="h4" sx={{ color: '#FFFFFF'}}>The clearest way into the Universe is through a forest wilderness.</Typography>
              <Typography sx={{ mt: '1rem', color: '#919EAB'}}>— John Muir</Typography>
            </Box>
            <Box sx={{mt: '2rem', mb:'2rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {!metaUser && !walletUser && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleClickOpen}
                  sx={{minWidth: '25vw'}}
                >
                  Connect Wallet
                </Button>
              )}
              {(walletUser || metaUser) && (
                <Typography variant="h5">Connected with {selectedWallet}</Typography>
              )}
              <WalletDialog
                open={open}
                onClose={handleClose}
              />
            </Box>
            <CardMedia
              component="img"
              height="100%"
              image="images/connect-background.png"
              alt="background"
              sx={{minHeight: '25vh', objectFit: 'fill'}}
            />
          </RightStyle>          
        </Grid>
      </Grid>
    </Page>
  );
}

export default App;

