import Home from './pages/Home'
import { ChatContextProvider } from './context/chatContext'

const App = () => {
  return (
    <ChatContextProvider>
      <div>
        <Home />
      </div>
    </ChatContextProvider >
  )
}


export default App