import styled from "styled-components";

export const TextInput = styled.input`
  // margin: 5px 10px 10px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 15px;
  height: 40px;
  padding: 0 10px;
`;

export const MenuContainer = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex leo-absolute",
}))`
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 4px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  flex-direction: column;
  max-height: 350px;
  overflow-y: auto;
  top: 40px;
  width: 230px;
  z-index: 1;

  ul {
    list-style: none;
    margin: 0;
    //   margin-left: -1px;
    //   margin-right: -1px;
    padding: 5px 0;

    li {
      cursor: pointer;
      font-size: 14px;
      line-height: 1;

      button {
        height: 32px;
        padding: 0 12px;
        width: 100%;
      }

      &:hover {
        background: rgba(212, 223, 234, 0.44) !important;
      }
    }
  }

  button {
    align-items: center;
    display: flex;
    font-size: 14px;

    .image-container {
      align-items: center;
      display: flex;
      height: 12px;
      justify-content: center;
      margin-right: 10px;
      width: 12px;
    }
  }
`;

export const TyperMenuContainer = styled.div`
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 4px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  display: flex;
  flex-direction: column;
  max-height: 350px;
  position: absolute;
  top: 50px;
  width: 250px;
  z-index: 1;
`;

export const TypeMenuContent = styled.div`
  border-bottom: 1px solid #dde2e6;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export const FilterStyledContainer = styled.div`
  background: #eff4f9;
  // background: #f6f6f6;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 10px;
  position: relative;
  transition: 0.1s ease-in-out background-color;
  width: max-content;

  .image-container {
    align-items: center;
    display: flex;
    height: 12px;
    justify-content: center;
    margin-right: 10px;
    width: 12px;
  }

  button {
    height: 35px;
    line-height: 1;
    padding: 0 10px;
  }

  img {
    margin-right: 10px;
  }

  span {
    display: inline;
    font-weight: 500;
    margin-right: 0;
  }

  .cancelFilter {
    background: linear-gradient(
      270.58deg,
      #ecf1f6 0.79%,
      #ecf1f6 49.65%,
      rgba(236, 241, 246, 0) 99.67%
    );
    // background: linear-gradient(
    //   270.58deg,
    //   #fff 0.79%,
    //   #fff 49.65%,
    //   rgba(255, 255, 255, 0) 99.67%
    // );
    border: 0;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    bottom: 0;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.1s ease-in-out opacity;
    width: 50px;

    svg,
    img {
      position: absolute;
      right: 10px;
      top: 14px;
    }
  }

  &:hover {
    background: #eff4f9;
    // background: #fff;

    .cancelFilter {
      opacity: 1;
    }
  }
`;

export const SelectContainer = styled.div``;

export const SaveButton = styled.button`
  color: #2a3744;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;

  &:hover {
    background: #f9f9f9;
  }
`;

export const Label = styled.label`
  color: #74767b;
  font-size: 12px;
  line-height: 1;
  margin-bottom: 10px;
`;
