import React from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";

const Sp = ({ color, size, inline, style, className }) => (
  <SpinnerContainer inline={inline} style={style} className={className}>
    <Loader
      type="Oval"
      color={color || "#2a3744"}
      height={size === "sm" ? 16 : 32}
      width={size === "sm" ? 16 : 32}
    />
  </SpinnerContainer>
);

export default Sp;

const SpinnerContainer = styled.div`
  display: ${(props) => (props.inline ? "inline" : "flex")};
  align-items: center;
  justify-content: center;
  padding: ${(props) => (!props.inline ? "20px 0px" : "0px")};
`;

// import Spinner from "sharedComponents/Spinner";
