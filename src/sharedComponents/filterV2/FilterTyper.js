import React from "react";
import {
  FilterInput,
  FilterAttribute,
  FilterStatus,
  FilterDate,
  FilterNumber,
  FilterMember,
  FilterSingleValue,
  FilterLocation,
  FilterNotice,
  FilterBoolean,
  FilterUntil,
  FilterQualifications,
  FilterStaticOptions,
  FilterCompany,
  FilterDistanceFrom,
  FilterCandidateStage,
  FilterRating,
  FilterCommute,
  FilterSizzle,
} from "sharedComponents/filterV2/TypeDropdowns";

const FilterTyper = (props) => {
  return (
    <>
      {props.option.filter_type === "text" && <FilterInput {...props} />}
      {props.option.filter_type === "attribute" && (
        <FilterAttribute {...props} />
      )}
      {props.option.filter_type === "location" && <FilterLocation {...props} />}

      {props.option.filter_type === "by_status" && <FilterStatus {...props} />}
      {props.option.filter_type === "date" && <FilterDate {...props} />}
      {props.option.filter_type === "numeric" && <FilterNumber {...props} />}
      {props.option.filter_type === "team_member" && (
        <FilterMember {...props} />
      )}
      {(props.option.filter_type === "activity" ||
        props.option.filter_type === "active_on_deals") && (
        <FilterSingleValue {...props} />
      )}
      {props.option.filter_type === "notice" && <FilterNotice {...props} />}
      {props.option.filter_type === "boolean" && <FilterBoolean {...props} />}
      {props.option.filter_type === "until" && <FilterUntil {...props} />}
      {props.option.filter_type === "qualification" && (
        <FilterQualifications {...props} />
      )}
      {props.option.filter_type === "simple_select" && (
        <FilterStaticOptions {...props} />
      )}
      {props.option.filter_type === "by_stage" && (
        <FilterCandidateStage {...props} />
      )}
      {props.option.filter_type === "company_select" && (
        <FilterCompany {...props} />
      )}
      {props.option.filter_type === "distance_from" && (
        <FilterDistanceFrom {...props} />
      )}
      {props.option.filter_type === "rating" && <FilterRating {...props} />}
      {props.option.filter_type === "commute" && <FilterCommute {...props} />}
      {props.option.filter_type === "sizzle" && <FilterSizzle {...props} />}
    </>
  );
};

export default FilterTyper;
