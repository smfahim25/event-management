import React, { useState } from "react";
import { DragHandleMenu, useComponentsContext } from "@blocknote/react";
import { BLOCKNOTE_ICONS } from "../utils/icons";
import { BLOCK_TYPES } from "../utils/constants";

const blockTypes = [
  {
    type: BLOCK_TYPES.paragraph,
    label: "Paragraph",
    icon: <BLOCKNOTE_ICONS.text_stroke />,
  },
  {
    type: BLOCK_TYPES.heading,
    label: "Big heading",
    icon: <BLOCKNOTE_ICONS.h1_stroke />,
    props: { level: 1 },
  },
  {
    type: BLOCK_TYPES.heading,
    label: "Medium heading",
    icon: <BLOCKNOTE_ICONS.h2_stroke />,
    props: { level: 2 },
  },
  {
    type: BLOCK_TYPES.heading,
    label: "Small heading",
    icon: <BLOCKNOTE_ICONS.h3_stroke />,
    props: { level: 3 },
  },
  {
    type: BLOCK_TYPES.numberedListItem,
    label: "Number list",
    icon: <BLOCKNOTE_ICONS.numbered_points_stroke />,
  },
  {
    type: BLOCK_TYPES.bulletListItem,
    label: "Bullet list",
    icon: <BLOCKNOTE_ICONS.bullet_points_stroke />,
  },
  {
    type: BLOCK_TYPES.codeblock,
    label: "Code block",
    icon: <BLOCKNOTE_ICONS.code_stroke />,
  },
  {
    type: BLOCK_TYPES.blockquote,
    label: "Quotes",
    icon: <BLOCKNOTE_ICONS.quotes_stroke />,
  },
  {
    type: BLOCK_TYPES.addLink,
    label: "Add Link",
    icon: <BLOCKNOTE_ICONS.link_stroke />,
  },
  {
    type: BLOCK_TYPES.divider,
    label: "Divider",
    icon: <BLOCKNOTE_ICONS.divider_stroke />,
  },
];

export function CustomDragMenu(props) {
  return (
    <DragHandleMenu {...props}>
      <ChangeToItem {...props}> Change To </ChangeToItem>
      {/* <ResetBlockTypeItem {...props}>Reset</ResetBlockTypeItem> */}
      <DeleteBlockItem {...props}> Delete </DeleteBlockItem>
    </DragHandleMenu>
  );
}

export function ResetBlockTypeItem(props) {
  const editor = props.editor;

  const Components = useComponentsContext();

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        editor.updateBlock(props.block, { type: BLOCK_TYPES.paragraph });
      }}
    >
      Reset Type
    </Components.Generic.Menu.Item>
  );
}

export function ChangeToItem(props) {
  const editor = props.editor;
  const [open, setOpen] = useState(false);
  const Components = useComponentsContext();

  const handleChangeType = (newType) => {
    const blockUpdate = {
      type: newType.type,
      props: { ...newType.props },
    };

    if (newType.type === BLOCK_TYPES.addLink) {
      const text = props.block.content.reduce(
        (acc, item) => acc + (item.text || ""),
        ""
      );
      blockUpdate.props.text = text;
    }

    editor.updateBlock(props.block, blockUpdate);
    setOpen(false);
  };

  return (
    <Components.Generic.Menu.Item
      icon={<BLOCKNOTE_ICONS.change_to_stroke />}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((prev) => !prev)}
      className="change-to-item"
    >
      <span className="change-to-text">
        Change to
        <BLOCKNOTE_ICONS.carret_right_stroke size={18} />
      </span>
      {open && (
        <div className="change-to-menu">
          {blockTypes.map((type, index) => (
            <div
              key={index}
              className="change-to-option"
              onClick={() => handleChangeType(type)}
            >
              <span className="option-icon">{type.icon}</span>
              <span className="option-label">{type.label}</span>
            </div>
          ))}
        </div>
      )}
    </Components.Generic.Menu.Item>
  );
}

export function DeleteBlockItem(props) {
  const editor = props.editor;
  const Components = useComponentsContext();

  const handleDelete = () => {
    editor.removeBlocks([props.block]);
  };
  return (
    <Components.Generic.Menu.Item
      icon={<BLOCKNOTE_ICONS.delete_stroke />}
      onClick={handleDelete}
    >
      Delete
    </Components.Generic.Menu.Item>
  );
}
