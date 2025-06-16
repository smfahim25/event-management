import { useRef, useState, useEffect } from "react";
import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";
import { BLOCKNOTE_ICONS } from "../../utils/icons";
import { BLOCK_TYPES } from "../../utils/constants";

export const LinkPopover = ({
  block,
  editor,
  onClose,
  initialUrl = "",
  initialText = "",
  customSaveLink,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = () => {
    if (customSaveLink) {
      customSaveLink(url, text);
      return;
    }
    if (url) {
      editor.updateBlock(block, {
        props: { url, text: text || url },
        type: BLOCK_TYPES.addLink,
      });
    }
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bn-link-popover" ref={popoverRef}>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        autoFocus={true}
        onKeyDown={handleKeyPress}
      />
      <input
        type="text"
        placeholder="Enter link text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <div className="button-row">
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const LinkButton = ({ block, editor }) => {
  const [showPopover, setShowPopover] = useState(true);

  const handleClick = (e) => {
    e.preventDefault();
    setShowPopover(true);
  };

  return (
    <div style={{ position: "relative" }} className="bn-inline-content">
      {block.props.url ? (
        <a
          className="bn-inline-link"
          href={block.props.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          title="Edit Link"
        >
          {block.props.text || block.props.url}
        </a>
      ) : (
        <AddLinkButton setShowPopover={setShowPopover} />
      )}
      {showPopover && (
        <LinkPopover
          block={block}
          editor={editor}
          onClose={() => setShowPopover(false)}
          initialUrl={block.props.url}
          initialText={block.props.text}
        />
      )}
    </div>
  );
};

const RenderLinkBlock = ({ block, editor }) => {
  return <LinkButton block={block} editor={editor} />;
};

const ParseLinkBlock = (element) => {
  if (element.tagName === "A") {
    return {
      url: element.href,
      text: element.textContent || undefined,
    };
  }
  return undefined;
};

const AddLinkButton = ({ setShowPopover }) => {
  return (
    <button
      className="add-link-button"
      onClick={() => setShowPopover && setShowPopover(true)}
    >
      <BLOCKNOTE_ICONS.link_stroke className="mr-2" />
      Add link
    </button>
  );
};

const LinkBlockToExternalHTML = ({ block }) => {
  // Error checking
  if (!block || typeof block !== "object") {
    console.error("Invalid block passed to LinkBlockToExternalHTML:", block);
    return <p>Invalid Link</p>;
  }

  if (!block.props || !block.props.url) {
    return <p>Add link</p>;
  }

  return (
    <p>
      <a
        href={block.props.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bn-inline-link"
      >
        {block.props.text || block.props.url}
      </a>
    </p>
  );
};

export const LinkBlock = createReactBlockSpec(
  {
    type: BLOCK_TYPES.addLink,
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      backgroundColor: defaultProps.backgroundColor,
      url: {
        default: "",
      },
      text: {
        default: "",
      },
    },
    content: "inline",
  },
  {
    render: RenderLinkBlock,
    parse: ParseLinkBlock,
    toExternalHTML: LinkBlockToExternalHTML,
  }
);
