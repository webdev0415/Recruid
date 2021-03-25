import styled from "styled-components";

export const PageContainer = styled.div`
  align-items: center;
  background: #fff;
  display: grid;
  padding-bottom: 30px;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    height: 100vh;
    padding: 0;
  }
`;

export const Header = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    left: 0;
    padding: 30px 40px;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

export const HeaderLink = styled.div`
  @media screen and (max-width: 768px) {
    display: block;
    margin: 30px auto 10px;
    text-align: center;
    width: 100%;
  }
`;

export const ImageContainer = styled.div.attrs((props) => ({
  className: (props.className || "") +" leo-flex-center-center",
}))`
  background: #f2f3f5;
  height: 100%;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const FormContainer = styled.div.attrs((props) => ({
  className: (props.className || "") +" leo-flex-center-center",
}))`
  min-height: calc(100vh - 100px);
  padding-left: 30px;
  padding-right: 30px;

  @media screen and (max-width: 320px) {
    padding-left: 15px;
    padding-right: 15px;
  }

  &.large {
    padding-top: 50px;

    @media screen and (min-height: 768px) {
      align-items: flex-start;
      max-height: 100vh;
      overflow-y: auto;
      padding-bottom: 30px;
      padding-top: 100px;
    }

    @media screen and (min-height: 820px) {
      align-items: center;
      padding-bottom: 0;
      padding-top: 0;
    }
  }
`;

export const FormWrapper = styled.div`
  max-width: 400px;
  width: 100%;

  h2 {
    color: #222222;
    font-family: "hk_groteskmedium";
    font-size: 25px;
    margin-bottom: 20px;
  }
`;
