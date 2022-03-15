// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Collect',
    items: [
      { title: 'My NFTs', path: PATH_DASHBOARD.mynfts, icon: ICONS.dashboard },
      { title: 'Leaderboard', path: PATH_DASHBOARD.leaderboard, icon: ICONS.ecommerce },
      { title: 'Collector Bonuses', path: '', icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Park Points',
    items: [
      { title: 'Earn Points', path: '', icon: ICONS.dashboard },
      { title: 'My Points', path: '', icon: ICONS.ecommerce },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'Shop',
    items: [
      { title: 'Park Shop', path: '', icon: ICONS.dashboard },
    ],
  },
  {
    subheader: 'Community',
    items: [
      { title: 'Calendar', path: '', icon: ICONS.dashboard },
    ],
  },
];

export default navConfig;
