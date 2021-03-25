import styled from "styled-components";

export const EditorRoot = styled.div`
  background: #fff;
  font-size: 14px;

  height: 100%;
  min-height: 200px;
  max-height: 500px;
  /* overflow: hidden; */
  /* overflow-y: auto; */
  text-align: left;

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: #b9b9b9;
  }
`;

export const EditorContainer = styled.div`
  text-align: left;
  cursor: text;
  font-size: 16px;
  min-height: 200px;
  padding: 15px;
  max-height: ${(props) =>
    props.maxHeight === "profile-email" ? "calc(100vh - 460px)" : "400px"};
  overflow: auto;
  font-family: Arial, Tahoma, Verdana, Helvetica, Georgia, Lucida, Times,
    Trebuchet;

  *:first-child {
    margin-top: 0;
  }

  h1 {
    font-size: 25px;
    font-weight: 500;
    line-height: 30px;
    margin-bottom: 20px;
    margin-top: 30px;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    line-height: 25px;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }

  h4 {
    display: block;
    margin-top: 1.33em;
    margin-bottom: 1.33em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }
  h5 {
    display: block;
    font-size: 0.83em;
    margin-top: 1.67em;
    margin-bottom: 1.67em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }
  h6 {
    display: block;
    font-size: 0.67em;
    margin-top: 2.33em;
    margin-bottom: 2.33em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
  }

  p {
    margin-bottom: 20px;
  }

  span {
    display: inline;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin-top: 1em;
    margin-bottom: 1 em;
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;

    li {
      display: list-item;
      line-height: 30px;
    }
  }

  ol {
    display: block;
    list-style-type: decimal;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;

    li {
      display: list-item;
      line-height: 30px;
    }
  }
  blockquote {
    display: block;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 40px;
    margin-right: 40px;
  }
  strong {
    font-weight: bold;
  }
`;

export const EditorControls = styled.div`
  font-family: "Helvetica", sans-serif;
  font-size: 14px;
  user-select: none;
  display: grid;
  align-items: center;
  grid-template-rows: 1fr;
  grid-template-columns: auto auto auto 1fr;

  &.bottom-row {
    border-top: solid #eee 1px;
  }

  &.top-row {
    border-bottom: solid #eee 1px;
  }

  .cont {
    padding: 10px 15px;
    display: flex;
    align-items: center;

    &.separator {
      border-right: solid #eee 1px;
    }
  }
  .end {
    justify-self: end;
  }
`;

export const StylingButton = styled.button`
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  opacity: 0.5;
  min-width: 24px;
  padding: 1px 4px;

  &:not(:last-child) {
    margin-right: 5px;
  }

  &.active {
    background: #dfe9f4;
    opacity: 1;
  }

  &.bold {
    font-weight: 600 !important;
  }

  &.italic {
    font-style: italic;
  }

  &.underline {
    text-decoration: underline;
  }

  &.header-bt {
    font-weight: 600 !important;
  }

  &.monospace {
    font-family: monospace;
  }
`;
