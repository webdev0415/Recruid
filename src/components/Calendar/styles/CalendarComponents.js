import styled from "styled-components";

// TableCalendar Styles
export const CalendarWrapper = styled.div`
  *::-webkit-scrollbar {
    display: none;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }
  background: #ffffff;
  display: grid;
  grid-template-columns: 1fr 320px;
  width: 100%;
`;
export const TableContainer = styled.div``;

export const TableWrapper = styled.div`
  max-height: calc(100vh - 324px);
  /* overflow-x: auto; */
  -ms-overflow-style: none;
  max-height: calc(100vh - 274px);
  overflow: -moz-scrollbars-none;
  overflow-y: scroll;
  width: 100%;
`;
export const Table = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex",
}))`
  overflow: hidden;
  width: 100%;
`;
export const DateWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
`;
export const ColumnWrapper = styled.div``;

export const TimeColumn = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-relative",
}))`
  min-height: 1560px;
  width: 60px;
`;
export const FilterWrapper = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-relative leo-width-full",
}))`
  background: #ffffff;
`;
export const Filter = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center-between",
}))`
  border-bottom: 1px solid #eee;
  width: 100%;
`;

export const MonthToggle = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center",
}))`
  h3 {
    font-size: 15px;
    letter-spacing: 0.1px;
    margin: 0;
    margin-left: 5px;
    margin-right: 5px;
  }

  button {
    padding: 0 10px;
  }
`;
export const Dates = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex",
}))`
  border-bottom: 1px solid #eee;
  width: 100%;
`;
export const DatePlaceHolder = styled.div`
  width: 60px;
`;
export const TimeSlot = styled.div`
  color: #74767b;
  font-size: 12px;
  left: -15px;
  position: absolute;
  text-align: right;
  top: calc(${(props) => props.position}% - 10px);
  width: 100%;

  &:after {
    content: "";
    background: #eee;
    height: 1px;
    left: calc(100% + 5px);
    position: absolute;
    top: 10px;
    width: calc(100vw - 320px);
    z-index: 1;
  }
`;
export const DateColumn = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-relative",
}))`
  min-height: 1560px;
  border-left: 1px solid #eeeeee;

  &.today::after {
    display: block;
    position: absolute;
    top: ${(props) => props.currentTime}%;
    content: "";
    height: 3px;
    width: calc(100% + 3px);
    background: #5bceaa;
    z-index: 1;
  }

  &.today::before {
    display: block;
    position: absolute;
    top: ${(props) => props.currentTime - 0.31}%;
    left: -6px;
    content: "";
    height: 12px;
    border-radius: 50%;
    width: 12px;
    background: #5bceaa;
    z-index: 1;
  }
`;
// CalendarFilter
export const Placeholder = styled.span`
  border-left: 1px solid #eee;
  color: #74767b;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1px;
  padding: 15px 0 10px;
  text-align: center;
  text-transform: uppercase;

  span {
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.11px;
    margin-bottom: 2px;
  }

  &.today {
    color: #2a3744;

    span {
      font-weight: 600;
    }
  }
`;

// ListView => ListCard styles
export const ListCardWrapper = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center-between",
}))`
  width: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
  border-bottom: 1px solid #eee;
  padding: 10px;
`;
export const ListCardName = styled.span.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center-start",
}))`
  min-width: 25%;
  flex-direction: row;
  span {
    padding: 0 10px;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 5px;
    color: #1e1e1e;
  }
`;
export const ListCardPosition = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center",
}))`
  flex-direction: row;
  flex-wrp: nowrap;
  min-width: 20%;
  margin-bottom: 5px;
  a {
    color: #1e1e1e;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
  }
`;
export const ListCardDetails = styled.span.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  color: #74767b;
  font-size: 14px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  svg {
    margin-right: 7px;
  }

  a {
    color: #004a6d;
    font-size: 12px;
    font-weight: 500;
    margin-right: 3px;
  }
`;
export const ListCardInterviewType = styled.div``;

export const MoreParticipants = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center leo-pointer",
}))`
  background: #eee;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #74767b;
  font-size: 12px;
  font-weight: 500;
  height: 32px;
  margin-left: -10px;
  text-align: center;
  width: 32px;
  z-index: 1;
`;

// ListVew => MonthPickerStyles
export const PickMonth = {
  Wrapper: styled.div`
    position: absolute;
    top: 30px;
    left: -45px;
    width: 175px;
    height: 125px;
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(3, 1fr);
    z-index: 5;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 2px #eee;
  `,
  MonthCell: styled.div`
    border: 1px solid #eee;
    color: #74767b;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    &.currentMonth {
      background: #00cba7;
      color: #fff;
      border-color: #00cba7;
    }
  `,
};
// SideBar Styles
export const SideBar = styled.div`
  min-width: 320px;
  border-left: 1px solid #eeeeee;
  max-height: calc(100vh - 210px);
  overflow: hidden;
  overflow-y: auto;
  padding: 20px;

  h2 {
    color: #1e1e1e;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  h3 {
    color: #74767b;
    font-size: 15px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  ul {
    margin-bottom: 30px;
  }
`;
// SideBar Card Styles
export const SideBarCardStyles = styled.div`
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  padding: 14px 15px;
  cursor: pointer;
`;

export const InterviewName = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 5px;
`;

export const InterviewDetails = styled.span.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  color: #74767b;
  flex-flow: wrap;
  font-size: 12px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  svg {
    margin-right: 7px;
  }
  img {
    margin-right: 7px;
  }

  a {
    color: #004a6d;
    font-size: 12px;
    font-weight: 500;
    margin-right: 3px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SideBarCardFooter = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between",
}))`
  margin-top: 12px;
`;

export const InterviewParticipant = styled.div`
  background: #fff;
  border-radius: 50%;
  margin-left: -10px;
  padding: 2px;
`;

export const InterviewApplicant = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-start",
}))`
  overflow: hidden;
  margin-right: 15px;
`;

// Event OverviewCard Styles
export const OverviewWrapper = styled.div`
  background: transparent;
  height: 100vh;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

export const OverviewCard = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between leo-relative",
}))`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 0 22px 3px rgba(0, 0, 0, 0.13);
  flex-direction: column;
  padding: 20px 20px 10px;
  width: 280px;
  z-index: 3;
`;

export const CardName = styled.h2`
  color: #1e1e1e;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 10px;
  word-break: break-all;
`;

export const CardDetails = styled.div`
  padding-bottom: 15px;
`;

export const IntervieweeBlock = styled.div`
  border-top: 1px solid #eee;
  padding: 10px 0;
`;

export const MemberBlock = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  padding: 5px 0;
`;

export const MemberDetails = styled.div`
  line-height: 1;
  margin-left: 10px;

  span {
    color: #1e1e1e;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    margin: 0;
    margin-bottom: 3px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    color: #74767b;
    font-size: 12px;
  }
`;

export const CardParticipants = styled.div`
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  overflow: hidden;
  overflow-y: auto;
  padding: 10px 0;
`;

export const CardButtons = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between",
}))`
  padding-top: 10px;

  a,
  button {
    color: #004a6d;
    font-size: 12px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Create/Edit Event Modal Styles
export const Modal = styled.div`
  .modal-dialog {
    max-width: 450px;
    min-width: 0px;
    width: 100%;
  }
`;
export const FlexWrapper = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-evenly",
}))`
  width: 100%;
  padding: 10px;
  flex-wrap: nowrap;
`;
export const HorizontalFlexWrapper = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center",
}))`
  flex-direction: column;
  flex-wrap: nowrap;
`;
export const DropDownWraper = styled.div`
  width: 100%;
  position: absolute;
  border: 1px solid #eeeeee;
  borderradius: 3px;
  z-index: 10;
`;
export const MemberSpan = styled.div`
  padding: 10px;
  background: white;
  fontweight: 515;
`;
// CalendarFilter => TeamMember Filter
export const TMFilter = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center",
}))`
  min-width: 200px;
`;
