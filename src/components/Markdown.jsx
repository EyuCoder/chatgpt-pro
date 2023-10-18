import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

const Markdown = ({ markdownText }) => {
  return (
    <ReactMarkdown
      className={"markdown"}
      remarkPlugins={[[remarkGfm], [remarkMath]]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "language-js");
          return !inline ? (
            <SyntaxHighlighter
              {...props}
              style={atomDark}
              language={match[1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdownText}
    </ReactMarkdown>
  );
};

export default Markdown;

Markdown.propTypes = {
  markdownText: PropTypes.string,
};
