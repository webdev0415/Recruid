import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  getDefaultKeyBinding,
  Modifier,
  CompositeDecorator,
  convertToRaw,
  Entity,
} from "draft-js";
import GlobalContext from "contexts/globalContext/GlobalContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "sharedComponents/Editor/RichEditor.scss";
import { convertToHTML, convertFromHTML } from "draft-convert";
import {
  stylingConversor,
  viewConversor,
} from "sharedComponents/TextEditor/stylingConversor";
import styled from "styled-components";
import {
  EditorRoot,
  EditorContainer,
} from "sharedComponents/TemplateEditor/components";
import ButtonsBar from "sharedComponents/TemplateEditor/ButtonsBar";
import { MOUSTACHE_VARIABLE_REGEX } from "constants/regex";
import { Base64 } from "js-base64";
import rgb2hex from "rgb2hex";
import Controls from "sharedComponents/TextEditor/Controls";
import { EditorControls } from "sharedComponents/TemplateEditor/components";
import { blockStyleFn } from "sharedComponents/TextEditor/blockStylefn";
import ExtendedRichUtils from "sharedComponents/TextEditor/ExtendedRichUtils";
import "sharedComponents/TextEditor/alignment.scss";
import { ALIGNMENT_DATA_KEY } from "sharedComponents/TextEditor/ExtendedRichUtils";
import EditorCustomImage from "sharedComponents/TextEditor/EditorCustomImage";

const TemplateEditor = ({
  returnState,
  placeholder,
  initialBody,
  returnVariables,
  setActiveTemplate,
  activeTemplate,
  type,
  source,
  addFilesToTemplate,
  participants,
}) => {
  const store = useContext(GlobalContext);
  const [editorState, setEditorState] = useState(undefined);
  const [activeInline, setActiveInline] = useState(undefined);
  const [activeBlock, setActiveBlock] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#000000");
  const node = useRef();
  const [styleMap, setStyleMap] = useState({
    BOLD: { fontWeight: "bold" },
    "#000000": { color: "#000000" },
    "#ff6900": { color: "#ff6900" },
    "#fcb900": { color: "#fcb900" },
    "#7bdcb5": { color: "#7bdcb5" },
    "#00d084": { color: "#00d084" },
    "#8ed1fc": { color: "#8ed1fc" },
    "#0693e3": { color: "#0693e3" },
    "#abb8c3": { color: "#abb8c3" },
    "#eb144c": { color: "#eb144c" },
    "#f78da7": { color: "#f78da7" },
    "#9900ef": { color: "#9900ef" },
  });
  const [currentAlignment, setCurrentAlignment] = useState("LEFT");
  const [newBlockInserted, setNewBlockInserted] = useState(undefined);
  const [imageToDelete, setImageToDelete] = useState(undefined);
  const [newImageProps, setNewImageProps] = useState(undefined);
  //THE COMPOSITE GENERATOR NEEDS TO BE ADDED AS SECOND PARAMETER EVERY TIME THE EDITORSTATE IS CREATED TO EVALUATE VARIABLES
  const compositeDecorator = new CompositeDecorator([
    { strategy: findLinkEntities, component: Link },
    {
      strategy: findVariables,
      component: HandleVar,
    },
    {
      strategy: findImageEntities,
      component: EditorCustomImage,
      props: { setImageToDelete, setNewImageProps },
    },
  ]);

  //GENERATES THE EDITORSTATE BASED ON PREEXISTING BODY, TEMPLATE OR GENERATES A NEW ONE
  useEffect(() => {
    if (initialBody && !editorState) {
      generateEntitiesFromString(initialBody || "");
    } else if (!editorState) {
      setEditorState(EditorState.createEmpty(compositeDecorator));
    }
  }, [initialBody, editorState]);

  //GENERATES THE EDITORSTATE BASED ON PREEXISTING BODY, TEMPLATE OR GENERATES A NEW ONE
  useEffect(() => {
    if (activeTemplate) {
      generateEntitiesFromString(Base64.decode(activeTemplate.body) || "");
      if (setActiveTemplate) {
        setActiveTemplate(undefined);
      }
    }
  }, [activeTemplate]);

  //ON EVERY EDITORSTATE UPDATE IT RETURNS A STRING CONTENT WITH THE VALUE OF THE STATE TO THE PARENT COMPONENT
  useEffect(() => {
    if (editorState) {
      let contentState = editorState.getCurrentContent();
      returnState(
        convertToHTML(stylingConversor)(
          editorState.getCurrentContent()
        ).replace(/<figure>/g, `<figure style="margin: 0">`)
      );
      let entityValues = Object.values(convertToRaw(contentState).entityMap);
      let entitiesVariables = [];
      entityValues
        .filter((entity) => entity.type === "TOKEN")
        .map((entity) => {
          entitiesVariables.push({
            model: entity.data.source,
            key: entity.data.prop_value,
            default_value: entity.data.default_value,
          });
          return null;
        });
      entityValues
        .filter((entity) => entity.type === "LINK" && entity.data.special_case)
        .map((entity) => {
          entitiesVariables.push({
            model: entity.data.source,
            key: entity.data.prop_value,
            default_value: entity.data.default_value,
          });
          // entitiesVariables.push({
          //   model: "JobPost",
          //   key: "title",
          //   default_value: "Job Title",
          // });
          return null;
        });
      returnVariables(entitiesVariables);
    }
  }, [editorState]);

  // SETS STATES TO DISPLAY WHAT BLOCK STYLE AND INLINE STYLE ARE CURRENTLY IN USE
  useEffect(() => {
    if (editorState) {
      let selection = editorState.getSelection();
      let blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      let blockAlignment = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getData()
        .get(ALIGNMENT_DATA_KEY);
      let currentStyle = editorState.getCurrentInlineStyle();
      setActiveInline(currentStyle);
      setActiveBlock(blockType);
      setCurrentAlignment(blockAlignment || "LEFT");
    }
  }, [editorState]);

  useEffect(() => {
    if (newBlockInserted) {
      toggleTextAlignemnt(newBlockInserted.currentAlignment);
    }
  }, [newBlockInserted]);

  //================KEYBOARD INPUTS==============================================
  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    // node.current.focus();
    if (
      document.activeElement.classList.contains("public-DraftEditor-content")
    ) {
      setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    } else {
      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.moveFocusToEnd(editorState),
          inlineStyle
        )
      );
    }
  };

  const toggleColor = (toggledColor) => {
    // node.current.focus();
    setCurrentColor(toggledColor);
    if (!styleMap[toggleColor]) {
      setStyleMap({ ...styleMap, [toggledColor]: { color: toggledColor } });
    }
    if (
      document.activeElement.classList.contains("public-DraftEditor-content")
    ) {
      setEditorState(RichUtils.toggleInlineStyle(editorState, toggledColor));
    } else {
      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.moveFocusToEnd(editorState),
          toggledColor
        )
      );
    }
  };

  // HANDLES KEYBOARD KEY COMMANDS
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (
      command === "split-block" &&
      currentAlignment !== undefined &&
      currentAlignment !== "LEFT"
    ) {
      setNewBlockInserted({ currentAlignment });
    }
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  // HANDLES THE KEYBOARD TAB INPUT
  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const createLink = (link) => {
    let contentState = editorState.getCurrentContent();
    let selectionState = editorState.getSelection();
    contentState = contentState.createEntity("LINK", "IMMUTABLE", link);

    let entityKey = contentState.getLastCreatedEntityKey();

    contentState = Modifier.insertText(
      contentState,
      selectionState,
      " ",
      undefined,
      undefined
    );

    contentState = Modifier.insertText(
      contentState,
      selectionState,
      link.text,
      undefined,
      entityKey
    );
    //apply the entity to the state
    contentState = Modifier.applyEntity(
      contentState,
      selectionState,
      entityKey
    );

    contentState = Modifier.insertText(
      contentState,
      selectionState,
      " ",
      undefined,
      undefined
    );

    const newEditorState = EditorState.createWithContent(
      contentState,
      compositeDecorator
    );
    setEditorState(
      RichUtils.toggleLink(newEditorState, selectionState, entityKey)
    );
  };

  //================HANDLE VARIABLE ADDITION FUNCTIONS==========================

  //ADDS A STRING VARIABLE TO THE TEXT
  const addVariable = (variableString, data) => {
    let contentState = editorState.getCurrentContent();
    let selectionState = editorState.getSelection();
    //create entity
    contentState = contentState.createEntity("TOKEN", "IMMUTABLE", data);
    //get unique entity key to differentiate it from other variables
    let entityKey = contentState.getLastCreatedEntityKey();
    //insert the text string with a reference to the entity key
    contentState = Modifier.insertText(
      contentState,
      selectionState,
      variableString,
      undefined,
      entityKey
    );
    //apply the entity to the state
    contentState = Modifier.applyEntity(
      contentState,
      selectionState,
      entityKey
    );
    //set editor state with all the new info
    setEditorState(
      EditorState.createWithContent(contentState, compositeDecorator)
    );
  };

  const createImageEntity = (image) => {
    let contentState = editorState.getCurrentContent();
    let selectionState = editorState.getSelection();
    // //create entity
    contentState = contentState.createEntity("atomic", "IMMUTABLE", {
      url: image.url,
      alt: image.title,
    });
    // //get unique entity key to differentiate it from other variables
    let entityKey = contentState.getLastCreatedEntityKey();
    // //insert the text string with a reference to the entity key
    // contentState = Modifier.insertText(
    //   contentState,
    //   selectionState,
    //   `<img src=${image.url} alt=${image.alt} />`,
    //   undefined,
    //   entityKey
    // );
    // // //apply the entity to the state
    // contentState = Modifier.applyEntity(
    //   contentState,
    //   selectionState,
    //   entityKey
    // );
    // //set editor state with all the new info
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(
        EditorState.forceSelection(
          EditorState.createWithContent(contentState, compositeDecorator),
          selectionState
        ),
        entityKey,
        `<img src=${image.url} alt=${image.alt} />`
      )
    );
  };

  const generateEntitiesFromString = (bodyString) => {
    let editorState = EditorState.createWithContent(
      convertFromHTML({ ...viewConversor, htmlToStyle })(bodyString),
      compositeDecorator
    );
    let contentState = editorState.getCurrentContent();
    setEditorState(
      EditorState.createWithContent(contentState, compositeDecorator)
    );
  };

  const htmlToStyle = (nodeName, node, currentStyle) => {
    if (node?.style.color) {
      let hex = rgb2hex(node?.style.color).hex;
      if (!styleMap[hex]) {
        setStyleMap({ ...styleMap, [hex]: { color: hex } });
      }
      return currentStyle.add(hex);
    } else {
      return currentStyle;
    }
  };

  const toggleTextAlignemnt = (textAlignment) => {
    setCurrentAlignment(textAlignment);
    setEditorState(
      ExtendedRichUtils.toggleAlignment(editorState, textAlignment)
    );
  };

  useEffect(() => {
    if (imageToDelete) {
      const contentState = editorState.getCurrentContent();
      const newBlockMap = contentState.blockMap.delete(imageToDelete.blockKey);
      const newContentState = contentState.set("blockMap", newBlockMap);
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-block"
      );
      setEditorState(newEditorState);
      setImageToDelete(undefined);
    }
  }, [imageToDelete]);

  useEffect(() => {
    if (newImageProps) {
      const contentState = editorState.getCurrentContent();
      const newContentState = contentState.mergeEntityData(
        newImageProps.entityKey,
        { ...newImageProps.newProps }
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "apply-entity"
      );
      setEditorState(newEditorState);
      setNewImageProps(undefined);
    }
  }, [newImageProps]);

  return (
    <EditorRoot>
      {editorState && (
        <>
          <EditorControls className="top-row">
            <div className="cont">
              <Controls
                activeBlock={activeBlock}
                activeInline={activeInline}
                toggleBlockType={toggleBlockType}
                toggleInlineStyle={toggleInlineStyle}
                createLink={createLink}
                currentColor={currentColor}
                toggleColor={toggleColor}
                toggleTextAlignemnt={toggleTextAlignemnt}
                currentAlignment={currentAlignment}
                createImageEntity={createImageEntity}
                store={store}
                addImageOption={true}
              />
            </div>
          </EditorControls>
          <EditorContainer onClick={() => node?.current?.focus()}>
            <Editor
              customStyleMap={styleMap}
              editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={mapKeyToEditorCommand}
              placeholder={placeholder || "Enter your text..."}
              ref={node}
              spellCheck={true}
              blockStyleFn={blockStyleFn}
            />
          </EditorContainer>
          <ButtonsBar
            addVariable={addVariable}
            store={store}
            setActiveTemplate={setActiveTemplate}
            type={type}
            source={source}
            addFilesToTemplate={addFilesToTemplate}
            createLink={createLink}
            createImageEntity={createImageEntity}
            participants={participants}
          />
        </>
      )}
    </EditorRoot>
  );
};

//MATCH MOUSTACHE OR HANDLEBARS PACKAGES VARIABLE FORMAT TO RENDER HANDLEVAR COMPONENT
const findVariables = (contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = MOUSTACHE_VARIABLE_REGEX.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

//FIND HYPERLINKS
const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && Entity.get(entityKey).getType() === "LINK";
  }, callback);
};

//FIND IMAGE ENTITIES
const findImageEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && Entity.get(entityKey).getType() === "atomic";
  }, callback);
};

//COMPONENT TO RENDER WHEN A VARIABLE IS INTRODUCED INTO THE TEXT
const HandleVar = (props) => {
  let entity, data;
  if (props.entityKey) {
    entity = props.contentState.getEntity(props.entityKey);
    if (entity) {
      data = entity.getData();
    }
  }
  if (entity && data) {
    return (
      <STVariable>
        {data.source_title}: {data.prop_title}
      </STVariable>
    );
  } else {
    return <>{props.children}</>;
  }
};

const Link = (props) => {
  const { href } = Entity.get(props.entityKey).getData();
  if (MOUSTACHE_VARIABLE_REGEX.test(href)) {
    return (
      <OverlayTrigger
        key={`top-0`}
        placement={"top"}
        overlay={
          <Tooltip id={`tooltip-top`}>
            <strong>Job : Job Link</strong>
          </Tooltip>
        }
      >
        <LinkButton href={href}>{props.children}</LinkButton>
      </OverlayTrigger>
    );
  } else {
    return (
      <OverlayTrigger
        key={`top-0`}
        placement={"top"}
        overlay={
          <Tooltip id={`tooltip-top`}>
            <strong>{href}</strong>
          </Tooltip>
        }
      >
        <HyperLink href={href}>{props.children}</HyperLink>
      </OverlayTrigger>
    );
  }
};

const LinkButton = styled.span`
  width: max-content;
  background-color: #00b292;
  color: #ffffff;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: inline-block !important;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 0;
  text-align: center;
  touch-action: manipulation;
  transition: all 0.2s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
`;

const STVariable = styled.span`
  background: #dfe9f4;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0;
  padding: 2px 5px;
`;

const HyperLink = styled.a`
  text-decoration: underline;
  color: black !important;
`;

export default TemplateEditor;
