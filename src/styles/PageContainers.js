import styled from "styled-components";
import { COLORS } from "constants/style";

export const MasterContainer = styled.div`
  max-width: 940px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
  width: 100%;

  @media screen and (max-width: 768px) {
    max-width: 720px;
  }
  @media screen and (max-width: 576px) {
    max-width: 540px;
  }
`;

export const InnerPageContainer = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 150px;
  width: 100%;
  background-color: ${(props) =>
    props.background === "white" ? COLORS.white : "inherit"};
`;

export const ATSContainer = styled(MasterContainer)`
  max-width: 1170px;
  width: 100%;
`;

export const ProfilePageContainer = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  flex-direction: column;
  padding: 0;
  background: #fff;
  max-height: calc(100vh - 50px);
  width: 100%;

  &.grey-container {
    background: #eee;
  }
`;
