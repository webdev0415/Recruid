import React, { useState } from "react";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { TimerSvg } from "components/TempJobDashboard/JobDashboardShifts/icons";
import AppButton from "styles/AppButton";
import { WarningIcon } from "components/TempJobDashboard/JobDashboardShifts/icons";
import ReactTooltip from "react-tooltip";

const ShiftCell = ({
  setActiveMiniModal,
  className,
  shift,
  setActiveShift,
  setActiveDate,
  allowEditPrev,
}) => {
  const [tooltipBG, setTooltipBG] = useState("#FFA076");
  return (
    <Cell
      className={` ${className || ""}`}
      statusColor={
        shift.applicant && shift.status
          ? statusExchanger[shift.status]
          : undefined
      }
    >
      {shift && (
        <>
          {shift.applicant && (
            <div className="candidate-container">
              <AvatarIcon
                name={shift.applicant.name}
                imgUrl={shift.applicant.avatar_url}
                size={22}
              />

              <span>{shift.applicant.name}</span>
            </div>
          )}
          <span className="time-duration">
            <TimerSvg
              statusColor={
                shift.applicant && shift.status
                  ? palettes[statusExchanger[shift.status]].dark
                  : undefined
              }
            />
            {shift.start_time.format("{hour-24-pad}:{minute-pad}")} -{" "}
            {shift.end_time.format("{hour-24-pad}:{minute-pad}")}
          </span>
        </>
      )}
      {shift.applicant && !allowEditPrev && shift.status !== "cancelled" && (
        <CancelCover className="cancel-cover">
          <AppButton
            theme="white"
            size="small"
            onClick={() => {
              setActiveShift(shift);
              setActiveDate({
                start: shift.start_time,
                end: shift.end_time,
              });
              setActiveMiniModal("cancel-shift");
            }}
          >
            Cancel Shift
          </AppButton>
        </CancelCover>
      )}
      <SubMenu
        className={`sub-menu-shift ${
          allowEditPrev || !shift.applicant_id ? "raise-up" : ""
        }`}
      >
        {shift.applicant && allowEditPrev && (
          <button
            onClick={() => {
              setActiveShift(shift);
              setActiveDate({
                start: shift.start_time,
                end: shift.end_time,
              });
              setActiveMiniModal("assign-candidate");
            }}
          >
            <i className="fas fa-user"></i>
          </button>
        )}
        {(allowEditPrev || !shift.applicant_id) && (
          <>
            <button
              onClick={() => {
                setActiveShift(shift);
                setActiveDate({
                  start: shift.start_time,
                  end: shift.end_time,
                });
                setActiveMiniModal("edit-shift");
              }}
            >
              <i className="fas fa-pen"></i>
            </button>

            <button
              onClick={() => {
                setActiveShift(shift);
                setActiveMiniModal("delete-shift");
              }}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </>
        )}
      </SubMenu>
      <IndicatorContainer>
        {shift.status === "reject" && (
          <Indicator
            className="indicator-marker"
            data-tip="The candidate has cancelled this shift"
            onMouseEnter={() => setTooltipBG("#D24650")}
          >
            <WarningIcon color="red" />
          </Indicator>
        )}
        {shift.status === "cancelled" && (
          <Indicator
            className="indicator-marker"
            data-tip="This shift has been cancelled"
            onMouseEnter={() => setTooltipBG("#D24650")}
          >
            <WarningIcon color="red" />
          </Indicator>
        )}
        {shift.applicant &&
          !shift.applicant.is_available &&
          shift.status === "pending" && (
            <Indicator
              className="indicator-marker"
              data-tip="The candidate has not set themselves available for this shift"
              onMouseEnter={() => setTooltipBG("#FFA076")}
            >
              <WarningIcon color="orange" />
            </Indicator>
          )}
        {!shift.published && shift.applicant && (
          <Indicator
            className="indicator-marker"
            data-tip="Shift has not been published yet"
            onMouseEnter={() => setTooltipBG("#FFA076")}
          >
            <WarningIcon color="orange" />
          </Indicator>
        )}
        {tooltipBG && (
          <ReactTooltip
            effect="solid"
            backgroundColor={tooltipBG}
            data-delay-show="500"
            data-class="custom-tooltip"
          />
        )}
      </IndicatorContainer>
      {!shift.applicant_id && (
        <AppButton
          className="assign-button"
          theme="dark-blue"
          size="mini"
          onClick={() => {
            setActiveShift(shift);
            setActiveDate({
              start: shift.start_time,
              end: shift.end_time,
            });
            setActiveMiniModal("assign-candidate");
          }}
        >
          Assign Shift
        </AppButton>
      )}
    </Cell>
  );
};

export default ShiftCell;

const Cell = styled.div`
  padding: 5px 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  overflow: hidden;
  border-top: solid #c4c4c4 1px;
  border-right: solid #c4c4c4 1px;
  height: 100px;
  max-height: 100px;
  overflow: hidden;
  text-align: center;
  background: ${(props) =>
    props.statusColor ? palettes[props.statusColor].light : "none"};

  &.no-top-border {
    border-top: none;
  }

  &.no-right-border {
    border-right: none;
  }

  &.candidate-over {
    border: solid black 1px;
  }

  &:hover:not(.candidate-over) {
    .raise-up {
      bottom: 0 !important;
    }
  }

  &:hover {
    .cancel-cover {
      display: flex;
    }
  }

  .time-duration {
    margin-top: 15px;
    color: ${(props) =>
      props.statusColor ? palettes[props.statusColor].dark : "#2a3744"};
    svg {
      margin-right: 5px;
    }
  }

  .assign-button {
    width: min-content;
    align-self: end;
    padding: 4px;
    border-radius: 5px;
    font-size: 12px;
    line-height: 1;
    position: absolute;
    bottom: 35px;
    left: 50%;
    right: 50%;
    transform: translate(-50%, 0);
  }

  .candidate-container {
    display: flex;
    align-items: center;
    color: ${(props) =>
      props.statusColor ? palettes[props.statusColor].dark : "#2a3744"};
    span {
      margin-left: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
    }
  }

  .sub-menu-shift {
    border-top: solid
      ${(props) =>
        props.statusColor ? palettes[props.statusColor].dark : "#c4c4c4"}
      1px;

    button {
      color: ${(props) =>
        props.statusColor ? palettes[props.statusColor].dark : "gray"};
    }
  }
  .custom-tooltip {
    opacity: 1;
  }
  // .__react_component_tooltip {
  //   background: ${(props) => props.tooltipBG || "#FFA076"} !important;
  // }
`;

const Indicator = styled.div`
  margin-right: 5px;
`;

const IndicatorContainer = styled.div`
  position: absolute;
  bottom: 3px;
  left: 5px;
  display: flex;
  transition: all 200ms;
`;

const SubMenu = styled.div`
  padding: 2px;
  position: absolute;
  bottom: -28px;
  left: 0;
  width: 100%;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    background: none;
    margin: 0px;
    margin-right: 10px;
  }
`;

const statusExchanger = {
  pending: "orange",
  accepted: "green",
  rejected: "red",
  cancelled: "red",
};

const palettes = {
  orange: {
    dark: "#B88910",
    light: "rgba(244, 209, 110, 0.4)",
  },
  red: {
    dark: "#D24650",
    light: "rgba(242, 120, 129, 0.4)",
  },
  green: {
    dark: "#1FAB96",
    light: "rgba(119, 235, 190, 0.4)",
  },
};

const CancelCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000a6;
  transition: all 500ms;
  display: none;

  button {
    color: #d24650 !important;
  }
`;
