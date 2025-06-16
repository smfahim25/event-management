import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import { filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import { BLOCK_TYPES } from "./constants";
import { BLOCKNOTE_ICONS } from "./icons";

export const insertDivider = (editor) => ({
  title: "Divider",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: BLOCK_TYPES.divider,
    });
  },
  aliases: ["divider", "line", "separator", "horizontal rule"],
  group: "Formatting",
  icon: BLOCKNOTE_ICONS.divider_stroke,
});

export const insertCodeBlock = (editor) => ({
  title: "Code Block",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: BLOCK_TYPES.codeblock,
    });
  },
  aliases: ["code", "snippet", "code snippet"],
  group: "Formatting",
  icon: BLOCKNOTE_ICONS.code_stroke,
});

export const insertBlockquote = (editor) => ({
  title: "Blockquote",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: BLOCK_TYPES.blockquote,
    });
  },
  aliases: ["quote", "citation"],
  group: "Formatting",
  icon: BLOCKNOTE_ICONS.quotes_stroke,
});

export const insertAddLink = (editor) => ({
  title: "Add Link",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: BLOCK_TYPES.addLink,
    });
  },
  aliases: ["link", "url", "add"],
  group: "Formatting",
  icon: BLOCKNOTE_ICONS.link_stroke,
});

export const getCustomSlashMenuItems = (editor) => [
  ...getDefaultReactSlashMenuItems(editor),
  insertDivider(editor),
  insertCodeBlock(editor),
  insertBlockquote(editor),
  insertAddLink(editor),
  //   insertAlert(editor),
];

export const getMenuItems = (editor, query) => {
  // Merge and filter items based on user query
  const allItems = getCustomSlashMenuItems(editor);
  return filterSuggestionItems(allItems, query);
};

// export const insertAlert = (editor) => ({
//   title: "Alert",
//   onItemClick: () => {
//     insertOrUpdateBlock(editor, {
//       type: "alert",
//     });
//   },
//   aliases: [
//     "alert",
//     "notification",
//     "emphasize",
//     "warning",
//     "error",
//     "info",
//     "success",
//   ],
//   group: "Other",
//   icon: <RiAlertFill />,
// });
