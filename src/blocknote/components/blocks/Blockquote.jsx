import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { formatText } from "../../utils/formatText";
import { BLOCK_TYPES } from "../../utils/constants";

// Renderer function for the Blockquote
// const RenderBlockquote = (props) => {
//   const blockquoteStyle = {
//     // display: "flex",
//     // flexDirection: "column",
//     // justifyContent: "flex-start",
//     // alignItems: "flex-start",
//     // margin: "10px 0",
//     borderLeft: "5px solid #ccc",
//     borderRadius: "4px",
//     backgroundColor: "#f5f5f5",
//     color: "#333",
//     padding: "8px 20px",
//     minHeight: "40px",
//     width: "100%",
//     overflow: "hidden",
//   };
//   const contentStyle = {
//     width: "100%",
//     whiteSpace: "pre-wrap",
//     wordWrap: "break-word",
//   };

//   const text = props.block?.props?.text?.trim() || "";
//   return (
//     <blockquote style={blockquoteStyle}>
//       {text || (
//         <div
//           className={"inline-content"}
//           suppressContentEditableWarning={true}
//           style={contentStyle}
//           contentEditable={true}
//           ref={props.contentRef}
//         ></div>
//       )}
//     </blockquote>
//   );
// };

const RenderBlockquote = (props) => {
  const blockquoteStyle = {
    borderLeft: "5px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: "8px 20px",
    minHeight: "40px",
    width: "100%",
    overflow: "hidden",
  };
  const contentStyle = {
    width: "100%",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  };

  const text = props.block?.props?.text || "";
  const formattedText = formatText(text);

  return (
    <blockquote style={blockquoteStyle}>
      {text ? (
        <div style={contentStyle}>{formattedText}</div>
      ) : (
        <div
          className={"inline-content"}
          suppressContentEditableWarning={true}
          style={contentStyle}
          contentEditable={true}
          ref={props.contentRef}
        ></div>
      )}
    </blockquote>
  );
};

// Parser function for the Blockquote
// const ParseBlockquote = (element) => {
//   if (element.tagName === "BLOCKQUOTE") {
//     return { text: element.textContent || "", };
//   }
//   return undefined;
// };

const ParseBlockquote = (element) => {
  if (element.tagName === "BLOCKQUOTE") {
    return { text: element.firstChild?.innerHTML || element?.innerHTML };
  }
  return undefined;
};

export const Blockquote = createReactBlockSpec(
  {
    type: BLOCK_TYPES.blockquote,
    propSchema: {
      text: {
        default: "",
      },
      textColor: defaultProps.textColor,
      textAlignment: defaultProps.textAlignment,
    },
    content: "inline",
  },
  {
    render: RenderBlockquote,
    parse: ParseBlockquote,
  }
);
