import styled from "styled-components";

const SubMenu = styled.div`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  position: absolute;
  top: 45px;
  z-index: 1;
  width: 100%;
  overflow: hidden;

  ul {
    list-style: none;
    margin: 0;
    margin-left: -1px;
    margin-right: -1px;
    padding: 7px 0;

    li {
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 8px 20px;
      width: min-content;

      span {
        white-space: nowrap;
      }

      &:hover {
        background: #e1e1e1 !important;
        color: #fff;
      }
    }
  }
`;

const TagsSubMenu = styled(SubMenu)`
  width: 190px;
  overflow: auto;
  max-height: 250px;

  ul {
    list-style: none;
    margin: 0;
    margin-left: -1px;
    margin-right: -1px;
    padding: 7px 0;

    li {
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 8px 20px;
      width: 100%;

      &:hover {
        background: #1f3653 !important;
        color: #fff;
      }
    }
  }
`;

const AddTagButton = styled.button`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  color: #1f3653;
  font-size: 14px;
  font-weight: 500;
  padding: 7px 15px;
`;

const Input = styled.input`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  margin-right: 10px;
  padding-left: 15px;
`;

export { TagsSubMenu, AddTagButton, Input };
