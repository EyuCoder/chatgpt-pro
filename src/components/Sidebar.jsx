import React, { useState } from 'react'
import useDarkMode from '../hooks/useDarkMode'
import { FaRobot } from 'react-icons/fa'
import {
  MdClose, MdMenu, MdAdd, MdOutlineNightlight,
  MdOutlineWbSunny, MdOutlineLogout, MdOutlineQuestionAnswer
} from 'react-icons/md'

const SideBar = () => {
  const [open, setOpen] = useState(true);

  return (
    <section className={` ${open ? "w-72" : "w-20 "} flex flex-col gap-y-4 h-screen bg-dark-purple p-5 pt-8 relative duration-300`}>
      <div className="app-bar">
        <div className={`app-logo ${!open && "scale-0 hidden"} duration-200`}>
          <FaRobot className='w-8 h-8' />
        </div>
        <h1 className={`app-title ${!open && "scale-0 hidden"}`}>
          ChatGPT
        </h1>
        <div className='close-btn' onClick={() => setOpen(!open)}>
          {open ? <MdClose className='w-8 h-8' /> : <MdMenu className='w-8 h-8' />}

        </div>
      </div>
      <div className="nav-item-wrapper">
        <span className='nav-item bg-light-white'>
          <div className='nav-icons'>
            <MdAdd />
          </div>
          <h1 className={`${!open && "hidden"}`}>New chat</h1>
        </span>
      </div>

      <div className="flex flex-col justify-end h-screen">
        <DarkMode open={open} />
        <div className="nav-item-wrapper">
          <span className="nav-item">
            <div className="nav-icons">
              <MdOutlineQuestionAnswer />
            </div>
            <h1 className={`${!open && "hidden"}`}>Update & FAQ</h1>
          </span>
        </div>
        <div className="nav-item-wrapper">
          <span className="nav-item">
            <div className="nav-icons">
              <MdOutlineLogout />
            </div>
            <h1 className={`${!open && "hidden"}`}>Log out</h1>
          </span>
        </div>
      </div>
    </section >
  )
}

const DarkMode = (props) => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <div className="nav-item-wrapper">
      <span className="nav-item" onClick={handleMode}>
        {darkTheme ? (
          <>
            <div className="nav-icons">
              <MdOutlineWbSunny />
            </div>
            <h1 className={`${!props.open && "hidden"}`}>Light mode</h1>
          </>
        ) : (
          <>
            <div className="nav-icons">
              <MdOutlineNightlight />
            </div>
            <h1 className={`${!props.open && "hidden"}`}>Night mode</h1>
          </>
        )}

      </span>
    </div>
  )
}

export default SideBar