import { ALL_VARIABLES } from "sharedComponents/TemplateEditor/PossibleVariables";
import { MOUSTACHE_VARIABLE_REGEX } from "constants/regex";

export const variableReplacer = (str) => {
  if (typeof str !== "string") return "";
  let modifiedString = str;
  Array.from(str.matchAll(MOUSTACHE_VARIABLE_REGEX), (variable) => {
    let asArray = variable[0].split(/\W/).filter((str) => str !== "");
    if (asArray.length === 2) {
      ALL_VARIABLES.map((obj) => {
        if (obj.source === asArray[0] && obj.prop_value === asArray[1]) {
          modifiedString = modifiedString.replace(
            variable[0],
            ` <span class="variable">${obj.source_title}: ${obj.prop_title}</span> `
          );
        }
        return null;
      });
    }
    return null;
  });
  return modifiedString;
};
