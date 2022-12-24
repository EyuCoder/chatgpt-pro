import SideBar from './components/SideBar'
import ChatView from './components/ChatView'

const App = () => {

  return (
    <div className="flex transition duration-500 ease-in-out">
      <SideBar />
      <ChatView />
    </div>
  );
};
export default App;