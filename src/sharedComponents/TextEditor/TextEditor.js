import React, { useEffect, useRef, useState, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  getDefaultKeyBinding,
  Modifier,
  CompositeDecorator,
  Entity,
  // SelectionState,
} from "draft-js";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "sharedComponents/Editor/RichEditor.scss";
import { convertToHTML, convertFromHTML } from "draft-convert";
import styled from "styled-components";
import {
  EditorRoot,
  EditorContainer,
} from "sharedComponents/TemplateEditor/components";
import { EditorControls } from "sharedComponents/TemplateEditor/components";
import Controls from "sharedComponents/TextEditor/Controls";
import {
  stylingConversor,
  viewConversor,
} from "sharedComponents/TextEditor/stylingConversor";
import rgb2hex from "rgb2hex";
import { blockStyleFn } from "sharedComponents/TextEditor/blockStylefn";
import ExtendedRichUtils from "sharedComponents/TextEditor/ExtendedRichUtils";
import "sharedComponents/TextEditor/alignment.scss";
import { ALIGNMENT_DATA_KEY } from "sharedComponents/TextEditor/ExtendedRichUtils";
import EditorCustomImage from "sharedComponents/TextEditor/EditorCustomImage";
const TextEditor = ({
  returnState,
  placeholder,
  initialBody,
  updateFromParent,
  maxHeight,
  readOnly,
  addImageOption,
}) => {
  const store = useContext(GlobalContext);
  const [editorState, setEditorState] = useState(undefined);
  const [activeInline, setActiveInline] = useState(undefined);
  const [activeBlock, setActiveBlock] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentAlignment, setCurrentAlignment] = useState("LEFT");
  const [imageToDelete, setImageToDelete] = useState(undefined);
  const [newImageProps, setNewImageProps] = useState(undefined);
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
  const [newBlockInserted, setNewBlockInserted] = useState(undefined);

  //THE COMPOSITE GENERATOR NEEDS TO BE ADDED AS SECOND PARAMETER EVERY TIME THE EDITORSTATE IS CREATED TO EVALUATE VARIABLES
  const compositeDecorator = new CompositeDecorator([
    { strategy: findLinkEntities, component: Link },
    {
      strategy: findImageEntities,
      component: EditorCustomImage,
      props: { setImageToDelete, setNewImageProps },
    },
  ]);

  //GENERATES THE EDITORSTATE BASED ON PREEXISTING BODY, TEMPLATE OR GENERATES A NEW ONE
  useEffect(() => {
    if (initialBody?.length && !editorState) {
      let editorState = EditorState.createWithContent(
        convertFromHTML({ ...viewConversor, htmlToStyle })(initialBody || ""),
        compositeDecorator
      );
      let contentState = editorState.getCurrentContent();
      setEditorState(
        EditorState.createWithContent(contentState, compositeDecorator)
      );
    } else if (!editorState) {
      setEditorState(EditorState.createEmpty(compositeDecorator));
    }
  }, [initialBody, editorState]);

  useEffect(() => {
    if (updateFromParent && initialBody !== undefined) {
      let editorState = EditorState.createWithContent(
        convertFromHTML({ ...viewConversor, htmlToStyle })(initialBody || ""),
        compositeDecorator
      );
      let contentState = editorState.getCurrentContent();
      setEditorState(
        EditorState.createWithContent(contentState, compositeDecorator)
      );
    }
  }, [updateFromParent, initialBody]);

  const htmlToStyle = (nodeName, node, currentStyle) => {
    if (node.style.color) {
      let hex = rgb2hex(node.style.color).hex;
      if (!styleMap[hex]) {
        setStyleMap({ ...styleMap, [hex]: { color: hex } });
      }
      return currentStyle.add(hex);
    } else {
      return currentStyle;
    }
  };

  //ON EVERY EDITORSTATE UPDATE IT RETURNS A STRING CONTENT WITH THE VALUE OF THE STATE TO THE PARENT COMPONENT
  useEffect(() => {
    if (editorState) {
      returnState(
        convertToHTML(stylingConversor)(editorState.getCurrentContent())
      );
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

  useEffect(() => {
    if (newBlockInserted) {
      toggleTextAlignemnt(newBlockInserted.currentAlignment);
    }
  }, [newBlockInserted]);

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

    const newEditorState = EditorState.createWithContent(
      contentState,
      compositeDecorator
    );
    setEditorState(
      RichUtils.toggleLink(newEditorState, selectionState, entityKey)
    );
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

  return (
    <TextEditorWrapper>
      <EditorRoot>
        {editorState && (
          <>
            {!readOnly && (
              <EditorControls className="top-row">
                <ControlsWrapper className="leo-flex">
                  <Controls
                    toggleBlockType={toggleBlockType}
                    toggleInlineStyle={toggleInlineStyle}
                    activeInline={activeInline}
                    activeBlock={activeBlock}
                    toggleColor={toggleColor}
                    currentColor={currentColor}
                    createLink={createLink}
                    toggleTextAlignemnt={toggleTextAlignemnt}
                    currentAlignment={currentAlignment}
                    store={store}
                    addImageOption={addImageOption}
                    createImageEntity={createImageEntity}
                  />
                </ControlsWrapper>
              </EditorControls>
            )}
            <EditorContainer
              onClick={() => node.current.focus()}
              maxHeight={maxHeight}
            >
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
                readOnly={readOnly}
              />
            </EditorContainer>
          </>
        )}
      </EditorRoot>
    </TextEditorWrapper>
  );
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

const Link = (props) => {
  const { href } = Entity.get(props.entityKey).getData();
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
};

const HyperLink = styled.a`
  text-decoration: underline;
`;

const ControlsWrapper = styled.div`
  padding: 15px;
`;

const TextEditorWrapper = styled.div`
  border-radius: 4px;
  border: solid 1px #eee;
  max-width: 800px;
`;

export default TextEditor;
