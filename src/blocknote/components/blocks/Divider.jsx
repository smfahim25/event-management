import { createReactBlockSpec } from "@blocknote/react";
import { BLOCK_TYPES } from "../../utils/constants";

const RenderDivider = (props) => {
  return (
    <section style={{ width: "100%", padding: "8px 0", outline: "none" }}>
      <hr style={{ borderTop: "2px solid #ddd" }} />
    </section>
  );
};

const ParseDivider = (element) => {
  if (element.tagName === "SECTION") {
    return {};
  }
  return undefined;
};

export const Divider = createReactBlockSpec(
  {
    type: BLOCK_TYPES.divider,
    propSchema: {},
    content: "none",
  },
  {
    render: RenderDivider,
    parse: ParseDivider,
  }
);
