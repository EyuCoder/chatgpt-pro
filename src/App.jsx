import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useState } from "react";
// import Modal from "./components/Modal";
// import Setting from "./components/Setting";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

const App = () => {
  // const [modalOpen, setModalOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  }

  const closeDrawer = () => {
    setDrawerOpen(false);
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // useEffect(() => {
  //   const apiKey = window.localStorage.getItem("api-key");
  //   if (!apiKey) {
  //     // setModalOpen(true);
  //   }
  // }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <ChatContextProvider>
        {/**
         * The settings modal is commented out for now because it's an empty component.
         */}
        {/*<Modal
          title="Setting"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        >
          <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </Modal> */}
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${280}px)` }, ml: { sm: `${280}px` } }}>
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
                <Menu />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Message title here
              </Typography>
            </Toolbar>
          </AppBar>
          <Box component="nav" sx={{ width: { sm: 280 }, flexShrink: { sm: 0 } }} aria-label="Sidebar">
            <SideBar drawerOpen={drawerOpen} changeDrawer={() => handleDrawerToggle()} opDrawer={() => openDrawer()} clDrawer={() => closeDrawer()} />
          </Box>
          <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${280}px)` } }}>
            <Toolbar />
            <ChatView />
          </Box>
        </Box>

      </ChatContextProvider>
    </ThemeProvider>
  );
};

export default App;
