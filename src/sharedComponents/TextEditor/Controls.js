import React from "react";
import { StylingButton } from "sharedComponents/TemplateEditor/components";
import ColorPicker from "sharedComponents/TemplateEditor/ColorPicker";
import LinkInserter from "sharedComponents/TemplateEditor/LinkInserter";
import ImageInserter from "sharedComponents/TemplateEditor/ImageInserter";

const Controls = ({
  activeBlock,
  activeInline,
  toggleBlockType,
  toggleInlineStyle,
  createLink,
  currentColor,
  toggleColor,
  toggleTextAlignemnt,
  currentAlignment,
  store,
  createImageEntity,
  addImageOption,
}) => (
  <>
    <div className="leo-flex-center">
      <StylingButton
        className={`${"header-one" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("header-one");
        }}
      >
        H1
      </StylingButton>
      <StylingButton
        className={`${"header-two" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("header-two");
        }}
      >
        H2
      </StylingButton>
      <StylingButton
        className={`${
          "header-three" === activeBlock ? "active" : ""
        } header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("header-three");
        }}
      >
        H3
      </StylingButton>
      <StylingButton
        className={`${"header-four" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("header-four");
        }}
      >
        H4
      </StylingButton>
      <StylingButton
        className={`${"header-five" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("header-five");
        }}
      >
        H5
      </StylingButton>
      <StylingButton
        className={`${"header-six" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("header-six");
        }}
      >
        H6
      </StylingButton>
      <LinkInserter createLink={createLink} />
      {addImageOption && (
        <ImageInserter store={store} createImageEntity={createImageEntity} />
      )}
      <StylingButton
        className={`${
          activeInline && activeInline.has("BOLD") ? "active" : ""
        } bold`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("BOLD");
        }}
      >
        B
      </StylingButton>
      <StylingButton
        className={`${
          activeInline && activeInline.has("ITALIC") ? "active" : ""
        } italic`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("ITALIC");
        }}
      >
        I
      </StylingButton>
      <StylingButton
        className={`${
          activeInline && activeInline.has("UNDERLINE") ? "active" : ""
        } underline`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("UNDERLINE");
        }}
      >
        U
      </StylingButton>
      <StylingButton
        className={`${"blockquote" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("blockquote");
        }}
      >
        <i className="fas fa-quote-right"></i>
      </StylingButton>
      <StylingButton
        className={`${
          "unordered-list-item" === activeBlock ? "active" : ""
        } header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("unordered-list-item");
        }}
      >
        <i className="fas fa-list-ul"></i>
      </StylingButton>
      <StylingButton
        className={`${"code-block" === activeBlock ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("code-block");
        }}
      >
        <i className="fas fa-code"></i>
      </StylingButton>
      <StylingButton
        className={`${
          !currentAlignment || currentAlignment === "LEFT" ? "active" : ""
        } header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleTextAlignemnt("LEFT");
        }}
      >
        <i className="fas fa-align-left"></i>
      </StylingButton>
      <StylingButton
        className={`${currentAlignment === "CENTER" ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleTextAlignemnt("CENTER");
        }}
      >
        <i className="fas fa-align-center"></i>
      </StylingButton>
      <StylingButton
        className={`${currentAlignment === "RIGHT" ? "active" : ""} header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleTextAlignemnt("RIGHT");
        }}
      >
        <i className="fas fa-align-right"></i>
      </StylingButton>{" "}
      <StylingButton
        className={`${
          currentAlignment === "JUSTIFY" ? "active" : ""
        } header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleTextAlignemnt("JUSTIFY");
        }}
      >
        <i className="fas fa-align-justify"></i>
      </StylingButton>
      <ColorPicker selectColor={toggleColor} activeColor={currentColor} />
    </div>
  </>
);

export default Controls;
