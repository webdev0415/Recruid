import React, { useEffect } from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import useDropdown from "hooks/useDropdown";
import CustomCalendar from "sharedComponents/CustomCalendar";

const JobDateSelect = ({ value, setValue, placeholder, readOnly, style }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    if (!value && showSelect) {
      setValue(spacetime());
    }
  }, [value, showSelect]);

  const returnValue = (val) => {
    setValue(val);
    setShowSelect(false);
  };

  return (
    <Wrapper
      ref={node}
      style={style}
      className="leo-relative leo-flex-center-between"
    >
      <Input
        readOnly={readOnly}
        onClick={() => {
          if (!readOnly) {
            setShowSelect(true);
          }
        }}
      >
        {!value && <span className="placeholder">{placeholder}</span>}
        {value && <span>{spacetime(value).format("numeric-uk")}</span>}
      </Input>
      <i className={`fas fa-caret-down ${readOnly ? "disabled" : ""}`}></i>
      {showSelect && (
        <>
          <CalendarContainer>
            <CustomCalendar initialValue={value} returnValue={returnValue} />
          </CalendarContainer>
        </>
      )}
    </Wrapper>
  );
};

export default JobDateSelect;

const Wrapper = styled.div`
  padding: 5px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  width: 130px;

  i.disabled {
    color: #c4c4c4;
  }
`;

const Input = styled.div`
  border: none;
  background: none;
  font-weight: 500;
  font-size: 12px;
  width: 100%;
  margin-right: 5px;
  cursor: ${(props) => (props.readOnly ? "initial" : "pointer")};

  span {
    font-size: 12px;

    &.placeholder {
      color: #d9d8d8;
    }
  }
`;

const CalendarContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  position: absolute;
  background: #ffffff;
  top: 40px;
  left: 25px;
  z-index: 10;
`;
