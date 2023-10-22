import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useState } from "react";
import Modal from "./components/Modal";
import Setting from "./components/Setting";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const App = () => {
  // const [modalOpen, setModalOpen] = useState(false);

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
          <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${280}px)` }, ml: { sm: `${280}px` }, }}>
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
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${280}px)` } }}>
            <Toolbar />
            <ChatView />
          </Box>
        </Box>

      </ChatContextProvider>
    </ThemeProvider>
  );
};

export default App;
