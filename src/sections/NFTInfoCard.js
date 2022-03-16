import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';
// utils
import { fNumber } from '../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.darker,
  flex: 1,
  color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

NFTIntoCard.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  logoText: PropTypes.string,
  address: PropTypes.string,
  firstTitle: PropTypes.string.isRequired,
  firstTotal: PropTypes.number.isRequired,
  secondTitle: PropTypes.string.isRequired,
  secondTotal: PropTypes.number.isRequired
};

export default function NFTIntoCard({ 
  logoText, 
  address, 
  firstTitle,
  firstTotal,
  secondTitle,
  secondTotal, 
  color = 'primary' 
}) {
  const theme = useTheme();
  const getWallet = (str) => {
    if (!str || str.length < 20) return "";
    return (
      `${str.substring(0, 15)  }...${  str.substring(str.length - 4, str.length)}`
    );
  }
  return (
    <RootStyle
      sx={{
        bgcolor: theme.palette[color].darker,
      }}
    >
      <Box sx={{ mr: 3, color: 'common.white' }}>
        {
          logoText && (
            <Typography variant="h4">{ logoText }</Typography>
          )
        }
        {
          address && <Typography variant="body2" sx={{ opacity: 0.72 }}>{getWallet(address)}</Typography>
        }
      </Box>
      <Box sx={{ mr: 3, color: 'common.white' }}>
        <Typography variant="h4"> {fNumber(firstTotal)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {firstTitle}
        </Typography>
      </Box>
      <Box sx={{ mr: 3, color: 'common.white' }}>
        <Typography variant="h4"> {fNumber(secondTotal)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {secondTitle}
        </Typography>
      </Box>
    </RootStyle>
  );
}
