/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

import useAuth from './hooks/useAuth';

// ----------------------------------------------------------------------

export default function App() {
  const { user } = useMoralis();
  const { login } = useAuth();

  useEffect(() => {
    console.log(user);
    if(user && user.attributes) {
      login(user.attributes);
    }
  }, [user]);

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <MotionLazyContainer>
                <ProgressBarStyle />
                <ChartStyle />
                <Settings />
                <ScrollToTop />
                <Router />
              </MotionLazyContainer>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
