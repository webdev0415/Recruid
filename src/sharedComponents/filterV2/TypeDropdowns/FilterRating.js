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
import { Star } from "sharedComponents/CandidateRating";

const FilterRating = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [ratingStars, setRatingStars] = useState(undefined);

  const saveAttributeFilter = () => {
    if (!option.prop_value || option.prop_value.length === 0) {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (ratingStars) {
      let arr = [];
      Object.entries(ratingStars).map((rt) => (rt[1] ? arr.push(rt[0]) : null));
      setOption({
        ...option,
        prop_value: arr,
        display_text: option.text_constructor(arr),
      });
    }
  }, [ratingStars]);

  useEffect(() => {
    let ratObj = { 1: false, 2: false, 3: false, 4: false, 5: false };
    if (option.prop_value && !ratingStars) {
      option.prop_value.map((rat) => {
        ratObj = { ...ratObj, [rat]: true };
        return null;
      });
    }
    if (!ratingStars) {
      setRatingStars(ratObj);
    }
  }, [option, ratingStars]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            {[1, 2, 3, 4, 5].map((rate, index) => (
              <OptionWrapper key={`rating-star-${index}`} className="leo-flex">
                <input
                  type="radio"
                  value={rate}
                  checked={ratingStars ? ratingStars[rate] : false}
                  onChange={() => {}}
                  onClick={() => {
                    setRatingStars({
                      ...ratingStars,
                      [rate]: !ratingStars[rate],
                    });
                  }}
                />
                <CustomLabel className="leo-flex-center">
                  <RatingStars rating={rate} />{" "}
                  <span className="stars-text">Stars</span>
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

export default FilterRating;

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

const CustomLabel = styled.label`
  .stars-text {
    margin-left: 5px;
  }
`;

const RatingStars = ({ rating }) => (
  <div className="leo-flex-center">
    {[1, 2, 3, 4, 5].map((rate, index) => (
      <div className="leo-flex-center-center" key={`candidate-rating-${index}`}>
        <Star active={rating >= rate} />
      </div>
    ))}
  </div>
);
