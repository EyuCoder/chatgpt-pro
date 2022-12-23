import Sidebar from './components/Sidebar'
import Chatview from './components/Chatview'

const App = () => {

  return (
    <div className="flex">
      <Sidebar />
      <Chatview />
    </div>
  );
};
export default App;