import { useCreateBlockNote } from "@blocknote/react";

import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import { uploadFile } from "./uploadFile";
import { Divider } from "../components/blocks/Divider";
import { CodeBlock } from "../components/blocks/CodeBlock";
import { Blockquote } from "../components/blocks/Blockquote";
import { Mention } from "../components/blocks/Mention";
import { LinkBlock } from "../components/blocks/LinkBlock";
import { BLOCK_TYPES } from "./constants";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    [BLOCK_TYPES.divider]: Divider,
    [BLOCK_TYPES.codeblock]: CodeBlock,
    [BLOCK_TYPES.blockquote]: Blockquote,
    [BLOCK_TYPES.addLink]: LinkBlock,
    // alert: Alert,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
});

export const useEditor = (props) =>
  useCreateBlockNote({
    schema,
    uploadFile: uploadFile,
    initialContent: props?.initialContent
      ? props?.initialContent
      : [{ type: "paragraph" }],
    // _tiptapOptions: {
    //   parseOptions: {
    //     preserveWhitespace: true,
    //   },
    // },
  });
