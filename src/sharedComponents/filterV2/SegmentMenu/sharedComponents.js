import styled from "styled-components";

export const Menu = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex leo-absolute",
}))`
  background: #ffffff;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  top: 30px;
  width: 300px;
  z-index: 1;
  max-height: 350px;
  overflow: auto;
  flex-direction: column;
`;

export const FolderButton = styled.button.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  span {
    font-size: 10px;
    margin-left: 10px;
    width: max-content;
  }
`;

export const FoldersContainer = styled.div`
  max-height: 230px;
  overflow: auto;
  padding: 5px 0px;

  li {
    .d-flex:hover {
      background: #eeeeee;
    }

    &.active {
      border-bottom: solid #eee 1px;
    }

    &.empty {
      padding: 10px;
    }
  }
`;

export const IconButton = styled.button`
  margin-right: 15px;
  font-weight: 500;
  font-size: 13px;
`;

export const LiButton = styled.button.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between",
}))`
  width: 100%;
  padding: 5px 15px;
  font-size: 13px;
  font-weight: 500;

  &.fold-button {
    color: grey;
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 600;
}
  }
`;
