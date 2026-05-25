import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import { signOut } from '../services/auth';
import { ROUTES } from '../utils/constants';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Stores', icon: <StorefrontIcon />, path: ROUTES.MERCHANTS },
];

export default function ProtectedLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    if (!isDesktop) setMobileOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isSelected = (path) =>
    path === ROUTES.MERCHANTS
      ? location.pathname.startsWith('/stores')
      : location.pathname === path;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"DM Serif Display", serif',
              fontSize: '1.25rem',
              lineHeight: 1,
            }}
          >
            J
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"DM Serif Display", serif',
                fontSize: '1.15rem',
                lineHeight: 1.1,
              }}
            >
              Jeeth Apparels
            </Typography>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ lineHeight: 1.4 }}
            >
              Admin
            </Typography>
          </Box>
        </Stack>
      </Box>

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isSelected(item.path)}
            onClick={() => handleNav(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        ))}
      </List>

      <List sx={{ pb: 1 }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen((v) => !v)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: '"DM Serif Display", serif',
              fontSize: '1.1rem',
            }}
          >
            Jeeth Apparels
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
