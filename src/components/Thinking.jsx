import Logo from "../assets/logo2.png";

const Thinking = () => {
  return (
    <div className="flex items-end mt-4">
      <div className="avatar">
        <div className="w-16  rounded-full">
          {/* <MdComputer className='w-6 h-full m-auto' /> */}
          <img src={Logo} className="w-6 h-full m-auto" />
        </div>
      </div>
      <div className="chat chat-start ">
        <div className="chat-bubble animate-pulse">Thinking...</div>
      </div>
    </div>
  );
};

export default Thinking;
