import { MdComputer } from 'react-icons/md';

const Thinking = () => {
  return (
    <div className='flex items-end mt-4'>
      <div className='avatar'>
        <div className='w-8 border rounded-full'>
          <MdComputer className='w-6 h-full m-auto' />
        </div>
      </div>
      <div className='chat chat-start '>
        <div className='chat-bubble animate-pulse'>thinking...</div>
      </div>
    </div>
  );
};

export default Thinking;
