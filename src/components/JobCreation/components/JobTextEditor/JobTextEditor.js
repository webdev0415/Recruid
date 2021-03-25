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
import { EditorContainer } from "sharedComponents/TemplateEditor/components";
import { EditorControls } from "sharedComponents/TemplateEditor/components";
import Controls from "components/JobCreation/components/JobTextEditor/JobTextEditorControls";
import {
  stylingConversor,
  viewConversor,
} from "sharedComponents/TextEditor/stylingConversor";
import rgb2hex from "rgb2hex";
import { blockStyleFn } from "sharedComponents/TextEditor/blockStylefn";
import ExtendedRichUtils from "sharedComponents/TextEditor/ExtendedRichUtils";
import "sharedComponents/TextEditor/alignment.scss";
import { ALIGNMENT_DATA_KEY } from "sharedComponents/TextEditor/ExtendedRichUtils";

const useEditor = (parentEditor, setParentEditor, useParentState) => {
  const [editorState, setEditorState] = useState(undefined);

  return useParentState
    ? { editorState: parentEditor, setEditorState: setParentEditor }
    : { editorState, setEditorState };
};

const JobTextEditor = ({
  returnState,
  placeholder,
  initialBody,
  updateFromParent,
  headerText,
  parentEditor,
  setParentEditor,
  useParentState,
}) => {
  const store = useContext(GlobalContext);
  const { editorState, setEditorState } = useEditor(
    parentEditor,
    setParentEditor,
    useParentState
  );
  const [activeInline, setActiveInline] = useState(undefined);
  const [activeBlock, setActiveBlock] = useState(undefined);
  const [currentAlignment, setCurrentAlignment] = useState("LEFT");
  const node = useRef();
  const [initial, setInitial] = useState(true);
  const [styleMap, setStyleMap] = useState({
    BOLD: { fontWeight: "bold" },
  });
  const [newBlockInserted, setNewBlockInserted] = useState(undefined);
  // const [viewControls, setViewControls] = useState(false);

  //THE COMPOSITE GENERATOR NEEDS TO BE ADDED AS SECOND PARAMETER EVERY TIME THE EDITORSTATE IS CREATED TO EVALUATE VARIABLES
  const compositeDecorator = new CompositeDecorator([
    { strategy: findLinkEntities, component: Link },
    { strategy: findImageEntities, component: CustomImage },
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
    if (editorState && !initial) {
      returnState(
        convertToHTML(stylingConversor)(editorState.getCurrentContent())
      );
    }
  }, [editorState]);

  useEffect(() => {
    if (editorState && initial) {
      setInitial(false);
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

  const createImageEntity = (image) => {
    let contentState = editorState.getCurrentContent();
    let selectionState = editorState.getSelection();
    // //create entity
    contentState = contentState.createEntity("atomic", "MUTABLE", {
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
    <EditorRoot className="leo-relative">
      {editorState && (
        <>
          <EditorControls>
            <div className="leo-flex">
              <HeaderText>{headerText}</HeaderText>
              <Controls
                toggleBlockType={toggleBlockType}
                toggleInlineStyle={toggleInlineStyle}
                activeInline={activeInline}
                activeBlock={activeBlock}
                createLink={createLink}
                createImageEntity={createImageEntity}
                store={store}
              />
            </div>
          </EditorControls>
          <CustomEditorContainer
            onClick={() => node.current.focus()}
            // onFocus={() => setViewControls(true)}
            // onBlur={() => setViewControls(false)}
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
            />
          </CustomEditorContainer>
        </>
      )}
    </EditorRoot>
  );
};

//FIND HYPERLINKS
const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && Entity.get(entityKey).getType() === "LINK";
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

//FIND IMAGE ENTITIES
const findImageEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && Entity.get(entityKey).getType() === "atomic";
  }, callback);
};

const HyperLink = styled.a`
  text-decoration: underline;
`;

export const EditorRoot = styled.div`
  font-size: 12px;
  min-height: 150px;
  text-align: left;

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: #b9b9b9;
    font-size: 12px;
  }
`;

const CustomImage = (props) => {
  const { url, alt } = Entity.get(props.entityKey).getData();
  return <STImage src={url} alt={alt} />;
};

const STImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
  width: 100%;
`;

const HeaderText = styled.h4`
  font-weight: 500;
  font-size: 16px;
  margin-right: 30px;
`;

const CustomEditorContainer = styled(EditorContainer)`
  padding: 0px;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: 150px;
`;
export default JobTextEditor;
