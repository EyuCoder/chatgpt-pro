import { useEffect, useContext } from "react";
import { ChatContext } from "../context/chatContext";
// import bot from "../assets/logo.png";
// import ToggleTheme from "./ToggleTheme";

/**
 * MUI imports.
 */
import Drawer from "@mui/material/Drawer";
import { Close, Delete, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
{/* <SideBar drawerOpen={drawerOpen} changeDrawer={handleDrawerToggle} /> */}
const SideBar = (props) => {
  const { drawerOpen, changeDrawer, clDrawer, opDrawer } = props;
  console.log("props: ", props);
  const [, , clearChat] = useContext(ChatContext);


  function handleResize() {
    window.innerWidth <= 720 ? clDrawer() : opDrawer();
  }
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  function clear() {
    clearChat();
  }

  const drawerContent = (
    <>
    <Box sx={{ display: "flex", justifyContent: "space-between", }}>
          <Typography variant="h6" noWrap sx={{ ml: 1, mt: 1, mb: 1 }}>
            SciPhi
          </Typography>
          <Button onClick={changeDrawer} sx={{display: { xs: 'block', sm: 'none' }}}>
            <Close size={25} />
          </Button>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={clear}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="Clear chat" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />

        {/* MessageLinks come here */}
        <List>
          {/* For each MessageLink: */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              Conversation about Python
              </ListItemButton>
          </ListItem>
        </List>
        <Divider />

        <ul className="absolute bottom-0 w-full gap-1 menu rounded-box">
          {/* <li>
            <ToggleTheme open={open} />
          </li> */}
        </ul>
    </>
  )

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={changeDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
          open
        >
          {drawerContent}
        </Drawer>
    </>
  );
};

export default SideBar;