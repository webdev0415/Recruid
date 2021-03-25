import { MENTION_REGEX } from "constants/regex";
export const prepareMentions = (note) => {
  let matches = note.match(MENTION_REGEX);
  let mentionTags = [];
  let notifyAll = false;
  if (matches && matches.length > 0) {
    matches.map((match) => {
      let mentionTagArr = match.match(/[(][^)]*[)]/);
      let mentionTag = mentionTagArr[0].substring(
        1,
        mentionTagArr[0].length - 1
      );
      if (mentionTag !== "ALL") {
        mentionTags.push(mentionTag);
      } else {
        notifyAll = true;
      }

      return null;
    });
  }
  return { notifyAll, mentionTags };
};

export const generateBody = (noteText) => {
  let matches = noteText.match(MENTION_REGEX);
  // let mentionTags = [];
  let names = [];
  if (matches && matches.length > 0) {
    matches.map((match) => {
      let nameArr = match.match(/[[][^\]]*[\]]/);

      let name = nameArr[0].substring(1, nameArr[0].length - 1);
      names.push(name);
      return null;
    });
    matches.map(
      (match, index) =>
        (noteText = noteText.replace(
          match,
          `<span style="background:#E6E9EC;padding:2px;">@${names[index]}</span>`
        ))
    );
    return noteText;
  } else {
    return noteText;
  }
};
