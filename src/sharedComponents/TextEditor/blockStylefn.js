import { ALIGNMENT_DATA_KEY } from "sharedComponents/TextEditor/ExtendedRichUtils";
export const blockStyleFn = (contentBlock) => {
  const textAlignStyle = contentBlock.getData().get(ALIGNMENT_DATA_KEY);
  switch (textAlignStyle) {
    case "RIGHT":
      return `align-right`;
    case "CENTER":
      return `align-center`;
    case "LEFT":
      return `align-left`;
    case "JUSTIFY":
      return `align-justify`;
    default:
      return "";
  }
};
