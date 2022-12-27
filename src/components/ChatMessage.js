import React from 'react'
import { MdComputer, MdPersonOutline } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { format } from 'timeago.js'
import Image from './Image'

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const { id, createdAt, text, ai = false, selected } = props.message

  return (
    <div key={id} className={`${ai && 'flex-row-reverse'} message`}>
      {
        selected === 'DALL·E' && ai ?
          <Image text={text} />
          :
          <div className='message__wrapper'>
            <ReactMarkdown className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
              children={text}
              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || 'language-js')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={atomDark} language={match[1]} PreTag="div" {...props}
                    />
                  ) : (<code className={className} {...props}>{children} </code>)
                }
              }} />


            <div className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>{format(createdAt)}</div>
          </div>}

      <div className="message__pic">
        {ai ? <MdComputer /> : <MdPersonOutline />}
      </div>
    </div>
  )
}

export default ChatMessage