import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";
import SizzlingFlame from "assets/svg/icons/sizzling";

const FilterSizzle = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [flames, setFlames] = useState(undefined);

  const saveAttributeFilter = () => {
    if (!option.prop_value || option.prop_value.length === 0) {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (flames) {
      let arr = [];
      Object.entries(flames).map((rt) => (rt[1] ? arr.push(rt[0]) : null));
      setOption({
        ...option,
        prop_value: arr,
        display_text: option.text_constructor(arr),
      });
    }
  }, [flames]);

  useEffect(() => {
    let ratObj = { 1: false, 2: false, 3: false };
    if (option.prop_value && !flames) {
      option.prop_value.map((rat) => {
        ratObj = { ...ratObj, [rat]: true };
        return null;
      });
    }
    if (!flames) {
      setFlames(ratObj);
    }
  }, [option, flames]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            {[1, 2, 3].map((fire, index) => (
              <OptionWrapper key={`rating-star-${index}`} className="leo-flex">
                <input
                  type="radio"
                  value={fire}
                  checked={flames ? flames[fire] : false}
                  onChange={() => {}}
                  onClick={() => {
                    setFlames({
                      ...flames,
                      [fire]: !flames[fire],
                    });
                  }}
                />
                <CustomLabel className="leo-flex-center">
                  <SizzlingFlames rating={fire} />{" "}
                  {/*}<span className="stars-text">Flames</span>*/}
                </CustomLabel>
              </OptionWrapper>
            ))}
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterSizzle;

const OptionWrapper = styled.div`
  margin-bottom: 5px;

  &:last-of-type {
    margin-bottom: 12px;
  }

  label {
    font-size: 14px;
    margin-left: 8px;
  }
`;

const SingleContainer = styled.div`
  margin: 0px 2px;
`;

const CustomLabel = styled.label`
  .stars-text {
    margin-left: 5px;
  }
`;

const SizzlingFlames = ({ rating }) => (
  <div className="leo-flex-center">
    {[1, 2, 3].map((fire, index) => (
      <SingleContainer
        key={`candidate-rating-${index}`}
        className="leo-flex-center-center"
      >
        <SizzlingFlame active={rating >= fire} />
      </SingleContainer>
    ))}
  </div>
);
