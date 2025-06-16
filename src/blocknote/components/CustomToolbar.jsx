import { useEditorContentOrSelectionChange } from "@blocknote/react";
import { useCallback, useEffect, useState } from "react";

import { checkBlockHasDefaultProp } from "@blocknote/core";
import { BLOCKNOTE_ICONS } from "../utils/icons";
import { LinkPopover } from "./blocks/LinkBlock";
import { BLOCK_TYPES } from "../utils/constants";
// import ColorMenu from "./ColorMenu";
// import LinkMenu from "./LinkMenu";

const Separator = () => {
  return (
    <div
      className="separator"
      style={{ width: "1px", height: "24px", backgroundColor: "#e0e0e0" }}
    />
  );
};

// Custom component to replace the default Formatting Toolbar.
export default function CustomFormattingToolbar({ editor, onSave }) {
  // Function to get the state of toolbar buttons (active/inactive).
  const getState = () => {
    const block = editor.getTextCursorPosition().block;
    const activeStyles = editor.getActiveStyles();

    return {
      bold: activeStyles.bold || false,
      italic: activeStyles.italic || false,
      underline: activeStyles.underline || false,
      heading: block.type === BLOCK_TYPES.heading ? block.props.level : null,
      textAlignment: checkBlockHasDefaultProp("textAlignment", block, editor)
        ? block.props.textAlignment
        : undefined,
      textColor: activeStyles.textColor || "default",
      backgroundColor: activeStyles.backgroundColor || "default",
      list:
        block.type === BLOCK_TYPES.bulletListItem
          ? "bulleted"
          : block.type === BLOCK_TYPES.numberedListItem
          ? "numbered"
          : null,
      code: block.type === BLOCK_TYPES.codeblock,
      quote: block.type === BLOCK_TYPES.blockquote,
    };
  };

  // Keeps track of the state of toolbar buttons.
  const [state, setState] = useState(getState());
  const [openAddLink, setOpenAddLink] = useState(false);

  // Keeps track of if the color and link sub menus are open.
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [linkMenuOpen, setLinkMenuOpen] = useState(false);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Updating the undo, redo stack
  useEffect(() => {
    const updateStacks = () => {
      setUndoStack(
        editor._tiptapEditor._state?.history$?.done?.items?.values || []
      );
      setRedoStack(
        editor._tiptapEditor._state?.history$?.undone?.items?.values || []
      );
    };

    editor._tiptapEditor.on("transaction", updateStacks);

    // Initial update
    updateStacks();

    return () => {
      editor._tiptapEditor.off("transaction", updateStacks);
    };
  }, [editor._tiptapEditor?._state?.history$]);

  // Updates toolbar state when the editor content or selection changes.
  useEditorContentOrSelectionChange(() => {
    const newState = getState();
    setState(newState);
  }, editor);

  // Callback to set text alignment.
  const setTextAlignment = (textAlignment) => {
    const selection = editor.getSelection();

    if (selection) {
      selection.blocks.forEach((block) => {
        editor.updateBlock(block, {
          props: { textAlignment: textAlignment },
        });
      });
    } else {
      const block = editor.getTextCursorPosition().block;

      editor.updateBlock(block, {
        props: { textAlignment: textAlignment },
      });
    }
  };

  // Callback to set text alignment.
  const setTextLevel = useCallback(
    (level) => {
      const selection = editor.getSelection();

      if (selection) {
        selection.blocks.forEach((block) => {
          if (
            block.type === BLOCK_TYPES.heading &&
            block.props.level === level
          ) {
            // If it's already the desired heading level, change it back to paragraph
            editor.updateBlock(block, {
              type: BLOCK_TYPES.paragraph,
            });
          } else {
            editor.updateBlock(block, {
              type: BLOCK_TYPES.heading,
              props: { level: level },
            });
          }
        });
      } else {
        const block = editor.getTextCursorPosition().block;
        if (block.type === BLOCK_TYPES.heading && block.props.level === level) {
          // If it's already the desired heading level, change it back to paragraph
          editor.updateBlock(block, {
            type: BLOCK_TYPES.paragraph,
          });
        } else {
          editor.updateBlock(block, {
            type: BLOCK_TYPES.heading,
            props: { level: level },
          });
        }
      }
    },
    [editor]
  );

  // Callback to set the list type
  const toggleList = useCallback(
    (listType) => {
      const currentBlock = editor.getTextCursorPosition().block;
      if (currentBlock.type === `${listType}ListItem`) {
        editor.updateBlock(currentBlock, { type: BLOCK_TYPES.paragraph });
      } else {
        editor.updateBlock(currentBlock, { type: `${listType}ListItem` });
      }
    },
    [editor]
  );

  // Callback to toggle block for code, blockquote
  const toggleBlock = useCallback(
    (blockType) => {
      const currentBlock = editor.getTextCursorPosition().block;
      if (currentBlock.type === blockType) {
        editor.updateBlock(currentBlock, { type: BLOCK_TYPES.paragraph });
      } else {
        editor.updateBlock(currentBlock, { type: blockType });
      }
    },
    [editor]
  );

  // Callback to insert or create link
  const insertLink = useCallback(() => {
    const referenceBlock = editor?.getTextCursorPosition()?.block;
    const text = editor.getSelectedText();

    if (
      text &&
      [BLOCK_TYPES.paragraph, BLOCK_TYPES.heading].includes(
        referenceBlock?.type
      )
    ) {
      const addLinkBlock = {
        block: referenceBlock,
        text: text,
      };
      const url = referenceBlock?.content[0]?.href;
      if (url) {
        addLinkBlock["url"] = url;
      }
      setOpenAddLink(addLinkBlock);
    } else {
      editor.insertBlocks(
        [{ type: BLOCK_TYPES.addLink }],
        referenceBlock,
        "after"
      );
    }
  }, [editor]);

  // Callback to insert a divider
  const insertDivider = useCallback(() => {
    const referenceBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [{ type: BLOCK_TYPES.divider }],
      referenceBlock,
      "after"
    );
  }, [editor]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const handleUndo = () => {
    editor._tiptapEditor.commands.undo();
  };

  const handleRedo = () => {
    editor._tiptapEditor.commands.redo();
  };

  return (
    <div className="formatting-toolbar">
      {/* ------------------ Undo / Redo -------------- */}
      <button
        className="formatting-toolbar-button"
        onClick={handleUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <BLOCKNOTE_ICONS.undo_stroke />
      </button>
      <button
        className="formatting-toolbar-button"
        onClick={handleRedo}
        disabled={!canRedo}
        title="Redo"
      >
        <BLOCKNOTE_ICONS.redo_stroke />
      </button>

      <Separator />

      {/* ------------------ Bold, Italic, underline -------------- */}
      <button
        className={`formatting-toolbar-button${state.bold ? " active" : ""}`}
        onClick={() => editor.toggleStyles({ bold: true })}
        title="Bold"
      >
        <BLOCKNOTE_ICONS.bold_stroke />
      </button>
      <button
        className={`formatting-toolbar-button${state.italic ? " active" : ""}`}
        onClick={() => editor.toggleStyles({ italic: true })}
        title="Italic"
      >
        <BLOCKNOTE_ICONS.italics_stroke />
      </button>
      <button
        className={`formatting-toolbar-button${
          state.underline ? " active" : ""
        }`}
        onClick={() => editor.toggleStyles({ underline: true })}
        title="Underline"
      >
        <BLOCKNOTE_ICONS.underlined_stroke />
      </button>

      <Separator />

      {/* ------------------ H1, H2, H3 ------------------ */}
      <button
        className={`formatting-toolbar-button${
          state.heading === 1 ? " active" : ""
        }`}
        onClick={() => setTextLevel(1)}
        title="Heading 1"
      >
        <BLOCKNOTE_ICONS.h1_stroke />
      </button>
      <button
        className={`formatting-toolbar-button${
          state.heading === 2 ? " active" : ""
        }`}
        onClick={() => setTextLevel(2)}
        title="Heading 2"
      >
        <BLOCKNOTE_ICONS.h2_stroke />
      </button>
      <button
        className={`formatting-toolbar-button${
          state.heading === 3 ? " active" : ""
        }`}
        onClick={() => setTextLevel(3)}
        title="Heading 3"
      >
        <BLOCKNOTE_ICONS.h3_stroke />
      </button>

      <Separator />

      {/* ------------------ Alignments ------------------- */}
      {/* {state.textAlignment && (
        <>
          <button
            className={`formatting-toolbar-button${
              state.textAlignment === "left" ? " active" : ""
            }`}
            onClick={() => setTextAlignment("left")}
            title="Align Left"
          >
            <BLOCKNOTE_ICONS.left_align_stroke />
          </button>
          <button
            className={`formatting-toolbar-button${
              state.textAlignment === "center" ? " active" : ""
            }`}
            onClick={() => setTextAlignment("center")}
            title="Align Center"
          >
            <BLOCKNOTE_ICONS.center_align_stroke />
          </button>
          <button
            className={`formatting-toolbar-button${
              state.textAlignment === "right" ? " active" : ""
            }`}
            onClick={() => setTextAlignment("right")}
            title="Align Right"
          >
            <BLOCKNOTE_ICONS.right_align_stroke />
          </button>
          <button
            className={`formatting-toolbar-button${
              state.textAlignment === "justify" ? " active" : ""
            }`}
            onClick={() => setTextAlignment("justify")}
            title="Justify"
          >
            <BLOCKNOTE_ICONS.justify_align_stroke />
          </button>
        </>
      )}

      {!state.code && <Separator />} */}

      {/* ------------------ Lists ------------------- */}
      <button
        className={`formatting-toolbar-button${
          state?.list === "bulleted" ? " active" : ""
        }`}
        onClick={() => toggleList("bullet")}
        title="Bulleted List"
      >
        <BLOCKNOTE_ICONS.bullet_points_stroke />
      </button>
      <button
        className={`formatting-toolbar-button${
          state?.list === "numbered" ? " active" : ""
        }`}
        onClick={() => toggleList("numbered")}
        title="Numbered List"
      >
        <BLOCKNOTE_ICONS.numbered_points_stroke />
      </button>

      <Separator />

      {/* ------------------ Code, Quote, Link, Divider ------------------- */}
      <button
        className={`formatting-toolbar-button${state?.code ? " active" : ""}`}
        onClick={() => toggleBlock(BLOCK_TYPES.codeblock)}
        title="Code Block"
      >
        <BLOCKNOTE_ICONS.code_stroke />
      </button>
      <button
        className={`formatting-toolbar-button${state?.quote ? " active" : ""}`}
        onClick={() => toggleBlock(BLOCK_TYPES.blockquote)}
        title="Quote"
      >
        <BLOCKNOTE_ICONS.quotes_stroke />
      </button>

      <div style={{ position: "relative" }}>
        <button
          className="formatting-toolbar-button"
          onClick={insertLink}
          title="Insert Link"
        >
          <BLOCKNOTE_ICONS.link_stroke />
        </button>
        {openAddLink && (
          <LinkPopover
            block={openAddLink?.block}
            editor={editor}
            initialText={openAddLink?.text}
            initialUrl={openAddLink?.url || ""}
            customSaveLink={(url, text) => {
              editor.createLink(url, text);
              setOpenAddLink(null);
            }}
            onClose={() => setOpenAddLink(false)}
          />
        )}
      </div>
      <button
        className="formatting-toolbar-button"
        onClick={insertDivider}
        title="Insert Divider"
      >
        <BLOCKNOTE_ICONS.divider_stroke />
      </button>

      {/* ------------------ Save button ------------------- */}
      <button
        className="formatting-toolbar-button"
        style={{ marginLeft: "auto" }}
        onClick={() => {
          if (onSave) {
            onSave();
          }
        }}
        title="Save"
      >
        Save
      </button>
    </div>
  );
}
