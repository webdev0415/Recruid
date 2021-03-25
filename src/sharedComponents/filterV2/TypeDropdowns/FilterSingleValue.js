import React, { useEffect } from "react";

const FilterSingleValue = ({
  option,
  setOption,
}) => {

  useEffect(() => {
    if (!option.display_text) {
      setOption({ ...option, display_text: option.text_constructor("") });
    }
     
  }, [option]);

  return (
    <></>
  );
};

export default FilterSingleValue;
