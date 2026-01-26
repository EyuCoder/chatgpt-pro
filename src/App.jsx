import { ChatContextProvider } from './context/chatContext';
import { SettingsContextProvider } from './context/settingsContext';
import SideBar from './components/SideBar';
import ChatView from './components/ChatView';

const App = () => {
  return (
    <SettingsContextProvider>
      <ChatContextProvider>
        <div className='flex transition duration-500 ease-in-out'>
          <SideBar />
          <ChatView />
        </div>
      </ChatContextProvider>
    </SettingsContextProvider>
  );
};

export default App;
