import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useState } from "react";
import Modal from "./components/Modal";
import Setting from "./components/Setting";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ChatContextProvider>
      <Modal title="Setting" modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
      <div className="flex transition duration-500 ease-in-out">
        <SideBar />
        <ChatView />
      </div>
    </ChatContextProvider>
  );
};

export default App;
