import { useState, useEffect, useContext } from 'react';
import { MdClose, MdMenu, MdDelete, MdAdd, MdChat } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { ChatContext } from '../context/chatContext';
import bot from '../assets/logo.svg';
import ToggleTheme from './ToggleTheme';
import Modal from './Modal';
import Setting from './Setting';

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
const SideBar = () => {
  const [open, setOpen] = useState(true);
  const {
    clearChat,
    chats,
    currentChatId,
    selectChat,
    createNewChat,
    deleteChat,
  } = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);

  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }

  useEffect(() => {
    handleResize();
  }, []);

  function clear() {
    clearChat();
  }

  return (
    <section
      className={`${
        open ? 'w-72' : 'w-16'
      } bg-neutral flex flex-col items-center gap-y-4 h-screen pt-4 relative duration-100 shadow-md`}>
      <div className='flex items-center justify-between w-full px-2 mx-auto'>
        <div
          className={` ${
            !open && 'scale-0 hidden'
          } flex flex-row items-center gap-2 mx-auto w-full`}>
          <img src={bot} alt='logo' className='w-6 h-6' />
          <h1 className={` ${!open && 'scale-0 hidden'}`}>ChatGPT</h1>
        </div>
        <div
          className='mx-auto btn btn-square btn-ghost'
          onClick={() => setOpen(!open)}>
          {open ? <MdClose size={15} /> : <MdMenu size={15} />}
        </div>
      </div>

      <div className='w-full px-2'>
        <button
          type='button'
          className='btn btn-outline btn-sm w-full'
          onClick={createNewChat}>
          <MdAdd size={16} />
          <span className={`${!open && 'hidden'}`}>New chat</span>
        </button>
      </div>

      <div className='w-full px-2 flex-1 overflow-hidden'>
        <p
          className={`text-xs uppercase text-slate-500 px-2 mb-2 ${
            !open && 'hidden'
          }`}>
          Chats
        </p>
        <ul className='w-full menu rounded-box overflow-y-auto max-h-full'>
          {chats.map((chat) => {
            const active = String(chat.id) === String(currentChatId);
            return (
              <li key={chat.id}>
                <a
                  className={active ? 'active' : undefined}
                  onClick={() => selectChat(chat.id)}>
                  <MdChat size={15} />
                  <span className={`${!open && 'hidden'}`}>
                    {chat.title || 'New chat'}
                  </span>
                  {open && (
                    <button
                      type='button'
                      className='btn btn-ghost btn-xs ml-auto'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      aria-label='Delete chat'>
                      <MdDelete size={14} />
                    </button>
                  )}
                </a>
              </li>
            );
          })}
          {!chats.length && (
            <li>
              <span className='text-xs text-slate-500 px-2'>
                No chats yet
              </span>
            </li>
          )}
        </ul>
      </div>

      <ul className='absolute bottom-0 w-full gap-1 menu rounded-box'>
        <li>
          <a className='border border-slate-500' onClick={clear}>
            <MdDelete size={15} />
            <p className={`${!open && 'hidden'}`}>Clear chat</p>
          </a>
        </li>
        <li>
          <ToggleTheme open={open} />
        </li>
        <li>
          <a onClick={() => setModalOpen(true)}>
            <MdSettings size={15} />
            <p className={`${!open && 'hidden'}`}>Ollama Settings</p>
          </a>
        </li>
      </ul>
      <Modal
        title='Ollama Settings'
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </section>
  );
};

export default SideBar;
