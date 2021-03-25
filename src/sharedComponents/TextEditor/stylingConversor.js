import React from "react";
import rgb2hex from "rgb2hex";
import {
  ALL_VARIABLES,
  PROTO_VARIABLES,
  job_protoype,
} from "sharedComponents/TemplateEditor/PossibleVariables";
import { MOUSTACHE_VARIABLE_REGEX, HEX_REGEX } from "constants/regex";
import {
  ALIGNMENTS,
  REVERSE_ALIGNMENTS,
} from "sharedComponents/TextEditor/ExtendedRichUtils";

export const stylingConversor = {
  styleToHTML: (style) => {
    if (style === "BOLD") {
      return <strong style={{ fontWeight: "bold" }} />;
    }
    if (style === "ITALIC") {
      return <i style={{ fontStyle: "italic" }} />;
    }
    if (style === "UNDERLINE") {
      return <u />;
    }
    if (HEX_REGEX.test(style) && style !== "#ffffff") {
      return <span style={{ color: style }} />;
    }
  },
  blockToHTML: (block) => {
    if (block.type === "PARAGRAPH") {
      return (
        <p
          style={{
            marginTop: "0px",
            marginLeft: "0px",
            marginRight: "0px",
            marginBottom: "5px",
            minHeight: block.text === "" ? "22px" : "inherit",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "unstyled") {
      return (
        <p
          style={{
            marginTop: "0px",
            marginLeft: "0px",
            marginRight: "0px",
            marginBottom: "5px",
            minHeight: block.text === "" ? "22px" : "inherit",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "header-one") {
      return (
        <h1
          style={{
            display: "block",
            fontSize: "2em",
            marginTop: "0.67em",
            marginBottom: "0.67em",
            marginLeft: "0",
            marginRight: "0",
            fontWeight: "bold",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "header-two") {
      return (
        <h2
          style={{
            display: "block",
            fontSize: "1.5em",
            marginTop: "0.83em",
            marginBottom: "0.83em",
            marginLeft: "0",
            marginRight: "0",
            fontWeight: "bold",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "header-three") {
      return (
        <h3
          style={{
            display: "block",
            fontSize: "1.17em",
            marginTop: "1em",
            marginBottom: "1em",
            marginLeft: "0",
            marginRight: "0",
            fontWeight: "bold",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "header-four") {
      return (
        <h4
          style={{
            display: "block",
            marginTop: "1.33em",
            marginBottom: "1.33em",
            marginLeft: "0",
            marginRight: "0",
            fontWeight: "bold",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "header-five") {
      return (
        <h5
          style={{
            display: "block",
            fontSize: "0.83em",
            marginTop: "1.67em",
            marginBottom: "1.67em",
            marginLeft: "0",
            marginRight: "0",
            fontWeight: "bold",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "header-six") {
      return (
        <h6
          style={{
            display: "block",
            fontSize: "0.67em",
            marginTop: "2.33em",
            marginBottom: "2.33em",
            marginLeft: "0",
            marginRight: "0",
            fontWeight: "bold",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "blockquote") {
      return (
        <blockquote
          style={{
            display: "block",
            marginTop: "1em",
            marginBottom: "1em",
            marginLeft: "40px",
            marginRight: "40px",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "unordered-list-item") {
      return (
        <li
          style={{
            lineHeight: "30px",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "ordered-list-item") {
      return (
        <li
          style={{
            lineHeight: "30px",
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    if (block.type === "code-block") {
      return (
        <code
          style={{
            textAlign: ALIGNMENTS[block.data.textAlignment] || "initial",
          }}
        />
      );
    }
    return <div />;
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === "LINK") {
      return (
        <a
          href={entity.data.href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            entity.data.special_case && entity.data.source === "JobPost"
              ? "job-link"
              : ""
          }
          style={
            entity.data.special_case && entity.data.source === "JobPost"
              ? {
                  width: "55px",
                  //eslint-disable-next-line
                  width: "max-content",
                  backgroundColor: "#00b292",
                  color: "#ffffff",
                  fontSize: "14px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  borderRadius: "4px",
                  boxShadow:
                    "0 1px 4px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  display: "block",
                  //eslint-disable-next-line
                  display: "inline-block !important",
                  fontWeight: "500",
                  lineHeight: "normal",
                  marginBottom: "0px",
                  textAlign: "center",
                  touchAction: "manipulation",
                  transition: "all 0.2s ease-in-out",
                  userSelect: "none",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                }
              : {}
          }
        >
          {originalText}
        </a>
      );
    }
    if (entity.type === "atomic") {
      let imageClasses = "";
      let imageStyle = {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "500px",
        width: "auto",
        objectFit: "contain",
      };
      if (entity.data.custom) {
        imageStyle = { ...imageStyle, ...entity.data.custom };
      }
      if (entity.data.size) {
        imageClasses += `${entity.data.size} `;
        imageStyle = {
          ...imageStyle,
          ...imageClassesExchanger[entity.data.size],
        };
      }
      if (entity.data.alignment) {
        imageClasses += `${entity.data.alignment} `;
        imageStyle = {
          ...imageStyle,
          ...imageAlignmentExpchanger[entity.data.alignment],
        };
      }
      return (
        <img
          src={entity.data.url}
          alt={entity.data.alt}
          className={imageClasses}
          style={imageStyle}
        />
      );
    }
    return originalText;
  },
};

export const viewConversor = {
  htmlToStyle: (nodeName, node, currentStyle) => {
    if (node.style.color) {
      return currentStyle.add(rgb2hex(node.style.color).hex);
    } else {
      return currentStyle;
    }
  },
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === "a") {
      if (!node.classList.contains("job-link")) {
        return createEntity("LINK", "IMMUTABLE", { href: node.href });
      } else {
        return createEntity("LINK", "IMMUTABLE", {
          href: node.getAttribute("href"),
          text: node.innerText,
          // second_variable: `{{${job_protoype.source}.${PROTO_VARIABLES.job_title.prop_value}}}`,
          ...PROTO_VARIABLES.job_link,
          ...job_protoype,
        });
      }
    }
    if (nodeName === "img") {
      let imageInstance = {
        url: node.getAttribute("src") || node.getAttribute("href"),
        alt: node.alt,
      };
      Object.keys(imageClassesExchanger).map((className) => {
        if (node.classList.contains(className)) {
          imageInstance.size = className;
        }
      });
      Object.keys(imageAlignmentExpchanger).map((className) => {
        if (node.classList.contains(className)) {
          imageInstance.alignment = className;
        }
      });
      if (imageInstance.size === "leo-custom-size") {
        if (node.style.width !== "auto" || node.style.height !== "auto") {
          imageInstance.custom = {};
          if (node.style.width !== "auto") {
            imageInstance.custom.width = node.style.width;
          }
          if (node.style.height !== "auto") {
            imageInstance.custom.height = node.style.height;
          }
        }
      }
      return createEntity("atomic", "MUTABLE", imageInstance);
    }
  },
  textToEntity: (text, createEntity) => {
    const result = [];
    text.replace(MOUSTACHE_VARIABLE_REGEX, (varMatch, offset) => {
      let matchFormat = varMatch.split(/\W/g).filter((val) => val !== "");
      let foundOption = undefined;
      ALL_VARIABLES.map((variable) => {
        if (
          variable.prop_value === matchFormat[1] &&
          variable.source === matchFormat[0]
        ) {
          foundOption = variable;
        }
        return null;
      });
      if (foundOption) {
        const entityKey = createEntity("TOKEN", "IMMUTABLE", foundOption);
        result.push({
          entity: entityKey,
          offset,
          length: varMatch.length,
          result: varMatch,
        });
      }
    });
    return result;
  },
  htmlToBlock: (nodeName, node) => {
    const alignment = node.style["text-align"];
    if (nodeName === "img") {
      let src = node.getAttribute("src") || node.getAttribute("href");
      return {
        type: "atomic",
        text: `<img src=${src} alt=${node.alt} />`,
      };
    }
    if (nodeName === "p") {
      return {
        type: "PARAGRAPH",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "div") {
      return {
        type: "unstyled",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "h1") {
      return {
        type: "header-one",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "h2") {
      return {
        type: "header-two",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "h3") {
      return {
        type: "header-three",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "h4") {
      return {
        type: "header-four",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "h5") {
      return {
        type: "header-five",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "h6") {
      return {
        type: "header-six",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "li") {
      return {
        type: "unordered-list-item",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "blockquote") {
      return {
        type: "blockquote",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
    if (nodeName === "code") {
      return {
        type: "code-block",
        data: {
          textAlignment: REVERSE_ALIGNMENTS[alignment],
        },
      };
    }
  },
};

const imageClassesExchanger = {
  "leo-full-size": {
    maxWidth: "500px",
  },
  "leo-med-size": {
    width: "250px",
    maxWidth: "100%",
  },
  "leo-small-size": {
    width: "100px",
    maxWidth: "100%",
  },
  "leo-custom-size": {},
};

const imageAlignmentExpchanger = {
  "leo-image-center": {
    margin: "auto",
  },
  "leo-image-left": {
    marginLeft: "0px",
  },
  "leo-image-right": {
    marginRight: "0px",
  },
  "leo-image-float-right": {
    float: "right",
    marginLeft: "10px",
  },
  "leo-image-float-left": {
    float: "left",
    marginRight: "10px",
  },
};
