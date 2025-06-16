import { useEffect } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "../styles.css";
import "@blocknote/react/style.css";

import { useEditor } from "../utils/editor";
import {
  SideMenu,
  SideMenuController,
  SuggestionMenuController,
} from "@blocknote/react";
import { getMenuItems } from "../utils/customMenuItems";
import CustomFormattingToolbar from "./CustomToolbar";
import { CustomSlashMenu } from "./CustomSlashMenu";
import { CustomDragMenu } from "./CustomDragMenu";

export default function BlocknoteEditor({
  onChange,
  onChangeHtml,
  onChangeText,
  showToolbar,
  onSave,
}) {
  const editor = useEditor();

  useEffect(() => {
    editor._tiptapEditor.on("destroy", (data) => {
      console.log("Deleting", data);
    });
    editor._tiptapEditor.on("transaction", (data) => {
      console.log("Update", data);
    });
  }, [editor]);

  return (
    <div className="w-full border-2">
      {showToolbar && (
        <CustomFormattingToolbar editor={editor} onSave={onSave} />
      )}
      <BlockNoteView
        editor={editor}
        onChange={async () => {
          try {
            const blocks = editor.document;

            if (onChange) {
              onChange(blocks);
            }

            if (onChangeHtml) {
              const html = await editor.blocksToHTMLLossy(blocks);
              onChangeHtml(html);
            }

            if (onChangeText) {
              const text = editor._tiptapEditor?._state?.doc?.textContent;
              onChangeText(text);
            }
          } catch (error) {
            console.error("Error in handleChange:", error);
          }
        }}
        slashMenu={false}
        sideMenu={false}
        className="min-h-[50vh]"
        data-theming-css-variables-demo
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) => getMenuItems(editor, query)}
          suggestionMenuComponent={CustomSlashMenu}
        />
        <SideMenuController
          sideMenu={(props) => (
            <SideMenu
              {...props}
              dragHandleMenu={(props) => (
                <CustomDragMenu editor={editor} {...props} />
              )}
            />
          )}
        />
      </BlockNoteView>
    </div>
  );
}
