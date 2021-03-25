import styled from "styled-components";
import { COLORS } from "constants/style";
// <Button
//   full={true || undefined}
//   size={"small" || "large" || undefined = "default"}
//   theme={"dark" || "pink" || "blue" || "dark-blue" || "grey" || "light-grey" || "white" || "primary" || light-blue }
// />

const AppButton = styled.button`
  background: transparent;
  background-color: ${(props) =>
    themes[props.theme]?.background || themes.default.background};
  border: ${(props) => (props.theme === "white" ? "1px solid #C4C4C4" : 0)};
  border-radius: ${(props) => radius[props.size] || radius.default}px;
  box-shadow: ${(props) =>
    props.theme === "white"
      ? "none"
      : "0 1px 4px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"};
  color: ${(props) => themes[props.theme]?.color || themes.default.color};
  cursor: pointer;
  display: inline-block;
  font-size: ${(props) =>
    fontSize[props.size] || fontSize.default}px !important;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 0;
  padding: ${(props) => padding[props.size] || padding.default};
  text-align: center;
  touch-action: manipulation;
  transition: all 0.2s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: ${(props) => (props.full ? "100%" : "initial")};

  &:hover,
  &:active,
  &:focus {
    background-color: ${(props) =>
      themes[props.theme]?.backgroundHover || themes.default.backgroundHover};
    color: ${(props) => themes[props.theme]?.color || themes.default.color};
    text-decoration: none;
  }
`;

const radius = {
  small: 4,
  default: 4,
};

const fontSize = {
  small: 12,
  large: 16,
  default: 14,
};

const padding = {
  small: "6px 10px",
  large: "20px 50px",
  default: "10px 20px",
};

const themes = {
  dark: {
    background: "#2c2c2c",
    backgroundHover: "#1F1F1F",
    color: COLORS.white,
  },
  pink: {
    background: "#ff3159",
    backgroundHover: "#F2244C",
    color: COLORS.white,
  },
  primary: {
    background: COLORS.secondary_3,
    backgroundHover: "#00BE9A",
    color: COLORS.white,
  },
  blue: {
    background: "#004a6d",
    backgroundHover: "#003D60",
    color: COLORS.white,
  },
  "light-blue": {
    background: "#8CD4ED",
    backgroundHover: "#73BBD4",
    color: COLORS.white,
  },
  "dark-blue": {
    background: COLORS.dark_2,
    backgroundHover: "#1D2A37",
    color: COLORS.white,
  },
  default: {
    background: COLORS.dark_2,
    backgroundHover: "#1D2A37",
    color: COLORS.white,
  },
  grey: {
    background: COLORS.dark_4,
    backgroundHover: "#67696E",
    color: COLORS.white,
  },
  "light-grey": {
    background: "#a8abb1",
    backgroundHover: "#9B9EA4",
    color: COLORS.white,
  },
  white: {
    background: COLORS.white,
    backgroundHover: "#E6E6E6",
    color: COLORS.dark_1,
  },
};

export default AppButton;
