import { Modifier, EditorState, RichUtils } from "draft-js";
import getCurrentlySelectedBlock from "sharedComponents/TextEditor/getCurrentlySelectedBlock";

export const ALIGNMENTS = {
  CENTER: "center",
  JUSTIFY: "justify",
  LEFT: "left",
  RIGHT: "right",
};
export const REVERSE_ALIGNMENTS = {
  center: "CENTER",
  justify: "JUSTIFY",
  left: "LEFT",
  right: "RIGHT",
};

export const ALIGNMENT_DATA_KEY = "textAlignment";

const ExtendedRichUtils = Object.assign({}, RichUtils, {
  // Largely copied from RichUtils' `toggleBlockType`
  toggleAlignment(editorState, alignment) {
    const {
      content,
      currentBlock,
      hasAtomicBlock,
      target,
    } = getCurrentlySelectedBlock(editorState);

    if (hasAtomicBlock) {
      return editorState;
    }

    const blockData = currentBlock.getData();
    const alignmentToSet =
      blockData && blockData.get(ALIGNMENT_DATA_KEY) === alignment
        ? undefined
        : alignment;
    return EditorState.push(
      editorState,
      Modifier.mergeBlockData(content, target, {
        [ALIGNMENT_DATA_KEY]: alignmentToSet,
      }),
      "change-block-data"
    );
  },
});

export default ExtendedRichUtils;
