import React from 'react'

const Code = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || 'language-js')
  return !inline && match ? (
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, '')}
      style={atomDark}
      language={match[1]}
      PreTag="div" {...props}
    />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export default Code