import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useState } from "react";
import Modal from "./components/Modal";
import Setting from "./components/Setting";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

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
          <SideBar />
          <ChatView />
        </Box>
      </ChatContextProvider>
    </ThemeProvider>
  );
};

export default App;
