import { useMoralis } from 'react-moralis';
import { Button, Modal ,Box, Typography} from '@mui/material'
import { useState } from 'react';
import { SelectOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { connectors } from './config';

const styles = {
  account: {
    height: '42px',
    padding: '0 15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    borderRadius: '12px',
    backgroundColor: 'rgb(244, 244, 244)',
    cursor: 'pointer',
  },
  text: {
    color: '#21BF96',
  },
  connector: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 5px',
    cursor: 'pointer',
  },
  icon: {
    alignSelf: 'center',
    fill: 'rgb(40, 13, 95)',
    flexShrink: '0',
    marginBottom: '8px',
    height: '30px',
  },
  ModalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },  
};


function Account() {
  const { authenticate, isAuthenticated, account, chainId, logout } =
    useMoralis();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  if (!isAuthenticated || !account) {
    return (
      <>
        <Button variant='contained' onClick={() => {setIsAuthModalVisible(true)}}>Connect Wallet</Button>
        <Modal
          open={isAuthModalVisible}
          onClose={() => setIsAuthModalVisible(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"  
        >
        <Box sx={styles.ModalStyle}>
          <div
            style={{
              padding: '10px',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '20px',
            }}
          >
            Connect Wallet
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {connectors.map(({ title, icon, connectorId }, key) => (
              <div
                role = 'button'
                tabIndex={0}
                style={styles.connector}
                key={key}
                onClick={async () => {
                  try {
                    await authenticate({ provider: connectorId });
                    console.log("connectorId before: ", window.localStorage.getItem('connectorId'));
                    window.localStorage.setItem('connectorId', connectorId);
                    console.log("connectorId after: ", window.localStorage.getItem('connectorId'));
                    setIsAuthModalVisible(false);
                  } catch (e) {
                    console.error(e);
                  }
                }              
               }
               onKeyDown={async () => {
                  try {
                    await authenticate({ provider: connectorId });
                    window.localStorage.setItem('connectorId', connectorId);
                    setIsAuthModalVisible(false);
                  } catch (e) {
                    console.error(e);
                  }
                }              
              }
              >
                <img src={icon} alt={title} style={styles.icon} />
                <Text style={{ fontSize: '14px' }}>{title}</Text>
              </div>
            ))}
          </div>
        </Box>
        </Modal>
      </>
    );
  }

  return (
    <>
        <Button 
          variant='contained'
          color='error'
          onClick={async () => {
            await logout();
            console.log("connectorId before: ", window.localStorage.getItem('connectorId'));
            window.localStorage.removeItem("connectorId");
            console.log("connectorId after: ", window.localStorage.getItem('connectorId'));
          }}
        >
          Disconnect Wallet
        </Button>
    </>
  );
}

export default Account;
