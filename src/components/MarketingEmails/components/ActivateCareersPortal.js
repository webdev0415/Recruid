import React from "react";
import Toggle from "sharedComponents/Toggle";

import styled from "styled-components";

const ActivateCareersPortal = ({ portalStatus, onCallAction }) => {
  return (
    <StyledContainer className="leo-flex-center-between">
      <label className="form-label form-heading">
        Activate your careers portal
      </label>
      <div className="leo-relative" style={{ top: "3px" }}>
        <Toggle name="portal" toggle={onCallAction} checked={portalStatus} />
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  .form-label {
    margin-bottom: 0;
  }
`;

export default ActivateCareersPortal;
