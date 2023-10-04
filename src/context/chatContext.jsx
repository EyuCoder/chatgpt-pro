import PropTypes from 'prop-types';
import { createContext } from 'react';
import useMessageCollection from '../hooks/useMessageCollection';

/**
 * ChatContext is a context object that is used to share collection of messages
 * between components
 */
const ChatContext = createContext({});

/**
 * ChatContextProvider is a functional component that serves as a provider for the ChatContext.
 * It provides the ChatContext to the components within its subtree.
 *
 * @param {Object} props - The properties passed to the component.
 * @returns {JSX.Element} A ChatContext.Provider element.
 */
const ChatContextProvider = (props) => {
  const { messages, addMessage, clearChat } = useMessageCollection();

  return (
    <ChatContext.Provider value={[messages, addMessage, clearChat]}>
      {props.children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
