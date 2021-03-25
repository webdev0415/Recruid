import React, { useEffect } from "react";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
const SelectionActionBar = ({ children, selectedTotal, activeModal }) => {
  useEffect(() => {
    if (selectedTotal > 0) {
      let intercom = document.querySelector(
        ".intercom-lightweight-app-launcher.intercom-launcher"
      );
      if (intercom && !activeModal) {
        intercom.style.display = "none";
      }
      // console.log(intercom);
    }
    return () => {
      let intercom = document.querySelector(
        ".intercom-lightweight-app-launcher.intercom-launcher"
      );
      if (intercom) {
        intercom.style.display = "initial";
      }
    };
  }, [selectedTotal, activeModal]);
  return (
    <>
      {selectedTotal > 0 && (
        <ActionBar>
          <ATSContainer>{children}</ATSContainer>
        </ActionBar>
      )}
    </>
  );
};
export default SelectionActionBar;

export const SelectedCounter = ({ selectedTotal, selectedText, style }) => (
  <Totals style={style} className="leo-flex">
    <CheckSvg />
    <span>
      {selectedTotal} {selectedText}
    </span>
  </Totals>
);

const ActionBar = styled.div`
  background: #2a3744;
  position: fixed;
  padding: 15px 0px;
  bottom: 0;
  width: 100%;
  z-index: 200;
`;

const Totals = styled.div`
  // margin-left: 20px;
  color: #b0bdca;

  span {
    margin-right: 20px;
    margin-left: 5px;
  }
`;

const CheckSvg = () => (
  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="1"
      y="1"
      width="14"
      height="14"
      rx="3"
      stroke="#B0BDCA"
      strokeWidth="2"
    />
    <path
      d="M7.54 11.381a.412.412 0 01-.293-.12L4.687 8.7a.413.413 0 11.584-.584l2.268 2.268 3.864-5.463a.413.413 0 01.584.584L7.83 11.26a.414.414 0 01-.292.121z"
      fill="#fff"
      stroke="#B0BDCA"
    />
  </svg>
);
