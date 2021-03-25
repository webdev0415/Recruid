import React from "react";
import { StylingButton } from "sharedComponents/TemplateEditor/components";
import ImageInserter from "sharedComponents/TemplateEditor/ImageInserter";

const Controls = ({
  activeBlock,
  activeInline,
  toggleBlockType,
  toggleInlineStyle,
  store,
  createImageEntity,
}) => (
  <>
    <div className="leo-flex-center">
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
          "unordered-list-item" === activeBlock ? "active" : ""
        } header-bt`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("unordered-list-item");
        }}
      >
        <i className="fas fa-list-ul"></i>
      </StylingButton>
      <ImageInserter store={store} createImageEntity={createImageEntity} />
    </div>
  </>
);

export default Controls;
