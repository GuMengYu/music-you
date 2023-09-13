import { Link as RouterLink, useLocation } from "react-router-dom";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";

// mui components
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { Button } from "@mui/material";


// icons
import IconButton from "@mui/material/IconButton";
import CategoryIcon from "@mui/icons-material/Category";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import FaceIcon from "@mui/icons-material/Face";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Public";
import RampRightIcon from "@mui/icons-material/RampRight";

// components
import MenuToggle from "@/components/toggle/MenuToggle";
import DarkModeToggle from "@/components/toggle/DarkModeToggle";


// hooks
import { useAppStore } from "@/store/app";
import Account from "@/components/button/Account";

const drawerWidth = 256;
const drawerHeight =   'calc(100% - 74px)'

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  height: drawerHeight,
  transition: theme.transitions.create("width", {
    easing: "cubic-bezier(0.55, -0.01, 0, 1.03)",
    duration: theme.transitions.duration.complex,
  }),
  overflowX: "hidden",
  borderRight: "none",
  background: theme.palette.surfaceVariant.main,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: "cubic-bezier(0.55, -0.01, 0, 1.03)",
    duration: theme.transitions.duration.complex,
  }),
  overflowX: "hidden",
  width: theme.spacing(9),
  height: drawerHeight,
  borderRight: "none",
  background: theme.palette.surface.main,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  height: drawerHeight,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const { rail: open, toggleLogin } = useAppStore();
  const { pathname } = useLocation();
  const list = [
    {
      icon: <SearchIcon sx={{ height: 20, width: 20 }} />,
      val: "search",
      title: "搜索",
      to: "/search",
    },
    {
      icon: <HomeIcon sx={{ height: 20, width: 20 }} />,
      val: "home",
      title: "主页",
      to: "/home",
    },
    {
      icon: <MapIcon sx={{ height: 20, width: 20 }} />,
      val: "explore",
      title: "浏览",
      to: "/explore",
    },
    // {
    //   icon: <PodcastsIcon sx={{ height: 20, width: 20 }} />,
    //   val: "podcast",
    //   title: "播客",
    //   to: "/podcasts",
    // },
    {
      icon: <CategoryIcon sx={{ height: 20, width: 20 }} />,
      val: "library",
      title: "资料库",
      to: "/library",
    },
  ];

  return (
    <Drawer variant="permanent" open={open} className="drag-area">
      <Box sx={{ mt: 2, mx: 1, mb: 1 }}>
        <MenuToggle />
      </Box>
      {open ? (
        ""
      ) : (
        <Box sx={{ mx: 1.5 }}>
          <Button
            variant="contained"
            sx={{
              height: 50,
              width: 50,
              borderRadius: 3.5,
              minWidth: 50,
            }}
          >
            <RampRightIcon />
          </Button>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
        }}
      >
        <List
          sx={{
            mx: 1,
            flex: open ? "" : "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "flex 350ms cubic-bezier(0.55, -0.01, 0, 1.03)",
          }}
        >
          {list.map((item, index) => (
            <ListItem
              key={item.val}
              disablePadding
              sx={{ display: "block", mb: 0.5 }}
              className="no-drag-area"

            >
              <Link component={RouterLink} to={item.to}>
                <ListItemButton
                  selected={pathname === item.to}
                  sx={{
                    borderRadius: 14,
                    minHeight: 56,
                    justifyContent: open ? "initial" : "center",
                    px: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      minHeight: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    secondary={item.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        {open ? (
          ""
        ) : (
          <Box
            className="no-drag-area"
            sx={{
              pb: 2,
              px: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Account />
            <DarkModeToggle />
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
