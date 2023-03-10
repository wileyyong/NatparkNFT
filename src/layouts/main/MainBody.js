/* eslint-disable react/prop-types */
// import { useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// import { Box, Button, AppBar, Toolbar, Container } from '@mui/material';

import MainSidebar from './MainSidebar';

// ----------------------------------------------------------------------

const BodyDiv = styled('div')(() => ({
  display: 'flex',
  flex: 1,
  marginTop: '88px',
  padding: '20px',
}));

const ContentDiv = styled('div')(() => ({
  flex: 1,
}));

// ----------------------------------------------------------------------

export default function MainBody({children}) {
  return (
    <BodyDiv>
      <MainSidebar />
      <ContentDiv>
        { children }
      </ContentDiv>
    </BodyDiv>
  );
}
