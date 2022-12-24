import React from 'react'
import { MdComputer, MdPersonOutline } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

const ChatMessage = (props) => {
  const { id, date, text, ai = false } = props.message

  return (
    <div className="p-5 m-5 flex items-start justify-between">
      <div className="h-10 w-10 bg-slate-200 mr-4 rounded-full flex items-center justify-center text-xl">
        {ai ? <MdComputer /> : <MdPersonOutline />}
      </div>
      <ReactMarkdown
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
        }}
        className='flex-1 w-96 flex-wrap overflow-hidden' />
      <div>{date}</div>
    </div>
  )
}

export default ChatMessage