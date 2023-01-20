import SideBar from '../components/SideBar';
import ChatView from '../components/ChatView';
import React from 'react'

const Home = () => {
  return (
    <div className="flex transition duration-500 ease-in-out">
      <SideBar />
      <ChatView />
    </div>
  )
}

export default Home