import React, { useState } from "react";
import useDropdown from "hooks/useDropdown";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

export default function SelectV2({ name, options, defaultOption, onSelect }) {
  const { node, showSelect, setShowSelect } = useDropdown();
  const [selectedOption, setSelectedOption] = useState(undefined);

  const handleSelect = (option) => () => {
    onSelect(option);
    setSelectedOption(option);
    setShowSelect(false);
  };

  return (
    <SelectV2SC ref={node}>
      <Selected
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-between"
      >
        {selectedOption?.label ?? defaultOption?.label ?? "Select an option"}{" "}
        <img src={`${AWS_CDN_URL}/icons/SelectArrowSvg.svg`} alt="" />
      </Selected>
      {showSelect && (
        <Dropdown>
          {options.map((option, index) => (
            <li
              key={`${name}-option-${index + 1}`}
              onClick={handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </Dropdown>
      )}
    </SelectV2SC>
  );
}

const SelectV2SC = styled.div`
  min-width: 180px;
  position: relative;
`;
const Selected = styled.button`
  padding: 10px 15px;
  width: 100%;
  border: 1px solid #b0bdca;
  border-radius: 4px;

  font-weight: 500;
  font-size: 12px;
  color: #2a3744;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 2;
  background: #fff;
  border: 1px solid #b0bdca;
  border-radius: 4px;

  li {
    padding: 10px 15px;
    font-weight: 500;
    font-size: 12px;
    color: #2a3744;
    transition: all 0.2s ease-out;
    cursor: pointer;

    &:hover {
      background: #ebf2f9;
    }
  }
`;
