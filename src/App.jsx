import SideBar from './components/SideBar'
import ChatView from './components/ChatView'
import { ChatContextProvider } from './context/chatContext';

const App = () => {
  return (
    <ChatContextProvider>
      <div className="flex transition duration-500 ease-in-out">
        <SideBar />
        <ChatView />
      </div>
    </ChatContextProvider>
  );
};
export default App;