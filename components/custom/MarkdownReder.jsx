import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 text-white">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside ml-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside ml-4">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        a: ({ href, children }) => (
          <a href={href} className="text-white hover:underline">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-white">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
            {children}
          </pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
