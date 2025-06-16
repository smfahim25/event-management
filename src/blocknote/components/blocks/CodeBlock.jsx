import { createReactBlockSpec } from "@blocknote/react";
import { formatText } from "../../utils/formatText";
import { BLOCK_TYPES } from "../../utils/constants";

// Renderer function for the CodeBlock
const RenderCodeBlock = (props) => {
  const codeStyle = {
    fontFamily: '"Consolas", "Andale Mono", "Courier New", Courier, monospace',
    fontSize: "12px",
    backgroundColor: "#282c34",
    color: "#abb2bf",
    padding: "10px",
    borderRadius: "4px",
    overflowX: "auto",
    whiteSpace: "pre",
    minHeight: "140px",
    width: "100%",
    overflow: "hidden",
  };
  const text = props.block?.props?.text?.trim();

  const formattedText = formatText(text);

  return (
    <pre style={codeStyle}>
      <code>
        {text ? (
          <div>{formattedText}</div>
        ) : (
          <div
            className={"inline-content"}
            contentEditable={true}
            suppressContentEditableWarning={true}
            ref={props.contentRef}
          ></div>
        )}
      </code>
    </pre>
  );
};

// Parser function for the CodeBlock
const ParseCodeBlock = (element) => {
  if (element.tagName === "PRE") {
    return { text: element.querySelector("code")?.firstChild?.innerHTML || "" };
  }
  return undefined;
};

export const CodeBlock = createReactBlockSpec(
  {
    type: BLOCK_TYPES.codeblock,
    propSchema: {
      language: {
        default: "",
      },
      text: {
        default: "",
      },
    },
    content: "inline",
  },
  {
    render: RenderCodeBlock,
    parse: ParseCodeBlock,
  }
);
