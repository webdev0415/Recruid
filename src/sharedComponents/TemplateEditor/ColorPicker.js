import React, { useState } from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";

const displayColors = [
  "#000000",
  "#ff6900",
  "#fcb900",
  // "#7bdcb5",
  "#00d084",
  // "#8ed1fc",
  "#0693e3",
  "#abb8c3",
  "#eb144c",
  "#f78da7",
  // "#9900ef",
];
const regx = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const ColorPicker = ({ selectColor, activeColor }) => {
  const [customColor, setCustomColor] = useState("");
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <div ref={node} className="leo-relative">
      <ColorBox
        onMouseDown={(e) => {
          e.preventDefault();
          setShowSelect(true);
        }}
        color={activeColor}
        className="leo-flex-center-end leo-pointer"
      />
      {showSelect && (
        <Wrapper className="leo-flex-center leo-absolute">
          {displayColors.map((color, index) => (
            <ColorBox
              key={`color-box-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectColor(color);
                setShowSelect(false);
              }}
              color={color}
              className={activeColor === color ? "active" : ""}
            />
          ))}
          <ColorBox
            onMouseDown={(e) => {
              e.preventDefault();
              if (regx.test(customColor)) {
                selectColor(`#${customColor}`);
                setShowSelect(false);
              }
            }}
            color={`#${customColor}`}
            className={activeColor.slice(1) === customColor ? "active" : ""}
          >
            #
          </ColorBox>
          <ColorInput
            placeholder="FFFFFF"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
          />
        </Wrapper>
      )}
    </div>
  );
};
const Wrapper = styled.div`
  background: white;
  border-radius: 4px;
  padding: 10px 15px;
  top: 30px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.2);
  right: 0px;
`;

const ColorBox = styled.div`
  background: ${(props) => props.color};
  border-radius: 4px;
  height: 20px;
  margin-right: 5px;
  width: 20px;

  &.active {
    border: solid black 2px;
    opacity: 1;
  }
`;

const ColorInput = styled.input`
  border: none;
  border-bottom: solid #7d7d7d 1px;
  font-size: 13px;
  font-weight: 500;
  grid-column: 4 / span 3;
  width: 50px;
`;

export default ColorPicker;
