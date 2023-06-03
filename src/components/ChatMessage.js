import React from 'react';
import { MdComputer } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import moment from 'moment';
import Image from './Image';
import person from '../assets/person.png';

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const { id, createdAt, text, ai = false, selected } = props.message;

  return (
    <div
      key={id}
      className={`${ai && 'flex-row-reverse bg-light-white'} message`}>
      {selected === 'DALL·E' && ai ? (
        <Image url={text} />
      ) : (
        <div className='message__wrapper'>
          <ReactMarkdown
            className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
            children={text}
            remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || 'language-js');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={oneDark}
                    language={match[1]}
                    PreTag='div'
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}{' '}
                  </code>
                );
              },
            }}
          />

          <div
            className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>
            {moment(createdAt).calendar()}
          </div>
        </div>
      )}

      <div className='message__pic'>
        {ai ? (
          <div className='avatar'>
            <div className='w-8 border rounded-full'>
              <MdComputer className='w-6 h-full mx-auto' />
            </div>
          </div>
        ) : (
          <div className='avatar'>
            <div className='w-8 border rounded-full'>
              <img src={person} alt='profile pic' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
