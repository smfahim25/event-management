import { filterSuggestionItems } from "@blocknote/core";

export const getCustomMentionMenuItems = (editor) => {
  const users = ["Steve", "Bob", "Joe", "Mike"];

  return users.map((user) => ({
    title: user,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user,
          },
        },
        " ", // add a space after the mention
      ]);
    },
  }));
};

export const getMentionItems = (editor, query) =>
  filterSuggestionItems(getCustomMentionMenuItems(editor), query);
