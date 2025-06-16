import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@blocknote/react/style.css";
import { useEffect } from "react";
import { useEditor } from "../utils/editor";
import "../styles.css";
import CustomFormattingToolbar from "./CustomToolbar";

export default function BlockNoteViewer({ html, onHtmlChange, onChangeText }) {
  const editor = useEditor();

  // Load initial content or updated content
  useEffect(() => {
    async function loadHTMLContent() {
      const defaultBlocks = await editor.tryParseHTMLToBlocks(html);
      editor.replaceBlocks(editor.document, defaultBlocks);
    }

    loadHTMLContent();
  }, [editor]);

  useEffect(() => {
    const handleEditorChange = async () => {
      const currentBlocks = editor.document;
      if (onHtmlChange) {
        const updatedHtml = await editor.blocksToHTMLLossy(currentBlocks);
        onHtmlChange(updatedHtml);
      }
      if (onChangeText) {
        const text = editor._tiptapEditor?._state?.doc?.textContent;
        onChangeText(text);
      }
    };

    editor._tiptapEditor.on("transaction", handleEditorChange);

    return () => {
      editor._tiptapEditor.off("transaction", handleEditorChange);
    };
  }, [editor, onHtmlChange, onChangeText]);

  return (
    <div className="w-full border-2">
      <CustomFormattingToolbar editor={editor} />
      <BlockNoteView editor={editor} editable={true} />
    </div>
  );
}
