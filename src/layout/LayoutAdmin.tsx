import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { Button } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { RoleUser } from 'constant/head-table';
import { ApiContext } from 'contexts/apiProviderContext';
import withUser from 'HOCs/withUser';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GET_PROFILE } from 'service/auth';
import { useQuery } from 'urql';

export interface ILayoutAdminProps {
  children: any;
  role?: string;
  profileUser?: any;
}

const MENU_LINK = [
  {
    url: '/',
    label: 'Users',
    role: ['user', 'organization', 'sysman', 'superAdmin'],
  },
  {
    url: '/organizations',
    label: 'Organizations',
    role: ['organization', 'sysman', 'superAdmin'],
  },
  {
    url: '/sysman',
    label: 'Sysman',
    role: ['sysman', 'superAdmin'],
  },
];
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

function LayoutAdmin(props: ILayoutAdminProps) {
  const theme = useTheme();
  const { userDetail, setUserDetail } = React.useContext(ApiContext);
  console.log('saddfasfas', userDetail);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const token = localStorage.getItem('token');

  // React.useEffect(() => {
  //   console.log('🚀 ~ file: LayoutAdmin.tsx ~ line 136 ~ React.useEffect ~ userDetail', userDetail);
  //   switch (userDetail?.roleObj?.code?.toLowerCase()) {
  //     case 'organization':
  //       navigate('/organizations');
  //       break;
  //     case 'sysman':
  //       navigate('/sysman');
  //       break;
  //     default:
  //       navigate('/');
  //       break;
  //   }
  // }, [props]);

  React.useEffect(() => {
    setUserDetail(props.profileUser);
  }, [props.profileUser]);

  React.useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    }
  }, [token, navigate]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/sign-in');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            color="info"
            sx={{ backgroundColor: '#fff', float: 'right' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List>
          {MENU_LINK.map(
            (menu, index) =>
              menu.role.some((item) => item.toLocaleLowerCase() == props.role?.toLowerCase()) && (
                <ListItem key={Math.random()} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => navigate(menu.url)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {index === 0 ? (
                        <PeopleAltIcon color={pathname === menu.url ? 'primary' : 'action'} />
                      ) : index === 1 ? (
                        <SupervisedUserCircleIcon
                          color={pathname === menu.url ? 'primary' : 'action'}
                        />
                      ) : (
                        <PermContactCalendarIcon
                          color={pathname === menu.url ? 'primary' : 'action'}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={menu.label} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              )
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {props.children}
      </Box>
    </Box>
  );
}
export default withUser(LayoutAdmin);
