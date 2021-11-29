import React from 'react';

import ReactMarkdown from 'react-markdown';

import classes from './Markdown.module.css';

type TProps = NoChildren

const appStyles: React.CSSProperties = {
  display: "flex",
}

const textAreaStyles: React.CSSProperties = {
  width: "50%",
  height: "100vh",
  padding: "20px",
  fontSize: "1rem",
  outline: "none",
}

// const markdownStyles: React.CSSProperties = {
//   width: "50%",
//   height: "100vh",
//   padding: "20px",
//   // fontSize: "2rem",
//   outline: "none",
// }

export const MarkdownEditor: React.FC<TProps> = () => {
  const [input, setInput] = React.useState("")
  console.log("input: ", input)
  return (
    <div style={appStyles}>
      <textarea
        autoFocus
        style={textAreaStyles}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div style={{ display: "flex", flexDirection: "column", width: "700px" }}>
        <ReactMarkdown className={classes.markdown}>{input}</ReactMarkdown>
        <pre className={classes.markdown}>{input}</pre>
      </div>
    </div>
  )
}
