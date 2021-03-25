import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";

export default function FilterSelector({
  dateBoundary,
  boundaryMap,
  setDateBoundary,
  isCompanyAnalytics = false,
}) {
  return (
    <Dropdown className="leo-flex leo-justify-end leo-relative">
      <Dropdown.Toggle
        as="button"
        className="leo-flex-center-between leo-pointer"
        style={{
          padding: "0",
        }}
      >
        {boundaryMap[dateBoundary]}
        <span style={{ marginLeft: "5px" }}>
          <li className="fas fa-caret-down" />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
        <DropdownMenuHeader />
        <DropdownOption>
          <DropdownLink onClick={() => setDateBoundary("today")}>
            Today
          </DropdownLink>
        </DropdownOption>
        <DropdownOption>
          <DropdownLink onClick={() => setDateBoundary("7")}>
            Last 7 Days
          </DropdownLink>
        </DropdownOption>
        <DropdownOption>
          <DropdownLink onClick={() => setDateBoundary("14")}>
            Last 14 Days
          </DropdownLink>
        </DropdownOption>
        <DropdownOption>
          <DropdownLink onClick={() => setDateBoundary("30")}>
            Last 30 Days
          </DropdownLink>
        </DropdownOption>
        <DropdownOption>
          <DropdownLink onClick={() => setDateBoundary("90")}>
            Last 90 Days
          </DropdownLink>
        </DropdownOption>
        <DropdownMenuHeader />
        <DropdownLine />
        <DropdownOptionBottom>
          <DropdownOption>
            <DropdownLink onClick={() => setDateBoundary("this week")}>
              This Week
            </DropdownLink>
          </DropdownOption>
          <DropdownOption>
            <DropdownLink onClick={() => setDateBoundary("this month")}>
              This Month
            </DropdownLink>
          </DropdownOption>
          <DropdownOption>
            <DropdownLink onClick={() => setDateBoundary("this quarter")}>
              This Quarter
            </DropdownLink>
          </DropdownOption>
          <DropdownOption>
            <DropdownLink onClick={() => setDateBoundary("this year")}>
              This Year
            </DropdownLink>
          </DropdownOption>
          {isCompanyAnalytics && (
            <DropdownOption>
              <DropdownLink onClick={() => setDateBoundary("all time")}>
                All Time
              </DropdownLink>
            </DropdownOption>
          )}
        </DropdownOptionBottom>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const DropdownMenuHeader = styled.span`
  color: #74767b;
  font-size: 11px;
  padding: 8px 14px 0;
`;

const DropdownOption = styled(Dropdown.Item)`
  padding: 0;
`;

const DropdownLink = styled.button`
  color: #1e1e1e !important;
  font-size: 14px;
  padding: 5px 14px 5px !important;

  &:hover {
    background: #f6f6f6 !important;
    color: #1e1e1e !important;
  }
`;

const DropdownLine = styled.div`
  background: #eeeeee;
  height: 1px;
  margin-top: 5px
  width: 100%;
`;

const DropdownOptionBottom = styled.div`
  padding: 8px 0 8px;
`;
