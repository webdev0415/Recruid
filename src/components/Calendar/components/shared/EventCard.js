import React, { useEffect, useState, useContext } from "react";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import { setAsCompleted } from "helpers/calendar/eventsActions";
import styled from "styled-components";

// Event Card EventCardStyles
export const EventCardStyles = styled.div`
  background: ${(props) => props.source};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  /* box-shadow: 0px 0px 0px 1px #ffffff; */
  color: ${(props) => (props.font ? props.font : "#004a6d")};
  cursor: pointer;
  font-size: 13px;
  left: 1px;
  min-height: calc(${(props) => props.duration}% - 3px);
  padding: 5px;
  position: absolute;
  top: calc(${(props) => props.startingPosition}% + 2px);
  width: calc(100% - 15px);
  z-index: ${(props) => props.zIndex};

  &:hover {
    box-shadow: 0px 0px 4px 1px #eee;
  }
`;

export const EventCardTitle = styled.span`
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const EventCardTime = styled.span`
  font-size: 10px;
`;

export const CompletedBlock = styled.div`
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  font-size: 10px;
  justify-content: space-between;
  line-height: 1;
  margin-top: 6px;
  padding-top: 5px;

  svg {
    margin-left: 5px;
  }

  #check:hover,
  #cross:hover {
    g {
      circle {
        fill: #2a3744;
        stroke: #2a3744;
      }
      path {
        fill: #fff;
      }
    }
  }
`;

export const EventCard = ({
  event,
  eventAction,
  duration,
  startingPosition,
  zIndex,
  openModal,
  session,
}) => {
  const { state, dispatch } = useContext(CalendarContext);
  const [bgColor, setBgColor] = useState(null);
  const [inlineStyles, setInlineStyles] = useState({});
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [pastEvent, setPastEvent] = useState(false);
  const onOver = {
    display: "inline-block",
    zIndex: `${10 ** 3}`,
  };
  useEffect(() => {
    switch (event.source) {
      case "recruitd":
        setBgColor("#e8fafe");
        break;
      case "google":
        setBgColor("#fff");
        break;
      default:
        setBgColor("#e8fafe");
    }
  }, [event]);
  useEffect(() => {
    if (duration === 1) {
      setInlineStyles({
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        fontSize: "10px",
        padding: "1px 3px",
      });
    }
  }, [duration]);

  function handleMouseEnter() {
    setIsMouseOver(true);
    let currentDate = new Date();
    if (
      event.date.getTime() < currentDate.getTime() &&
      event.source !== "google"
    )
      setTimeout(() => setPastEvent(true), 50);
  }

  function handleMouseLeave() {
    setIsMouseOver(false);
    setPastEvent(false);
  }

  if (event) {
    return (
      <EventCardStyles
        startingPosition={startingPosition}
        duration={duration}
        source={
          event.source
            ? bgColor
            : event.event_type === "meeting"
            ? "#FFA076"
            : ""
        }
        font={event.event_type === "meeting" && "#1e1e1e"}
        id="talbe-event-card"
        style={isMouseOver ? onOver : inlineStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        zIndex={zIndex}
        onClick={(e) => eventAction(e, event)}
      >
        <EventCardTitle className="noselect">{event.name}</EventCardTitle>
        <EventCardTime className="noselect">
          {!!event.date &&
            `${event.date.getHours()}:${
              !event.date.getMinutes() ? `00` : event.date.getMinutes()
            }`}
          {duration === 1 && !isMouseOver
            ? ``
            : !!event.dateEnd &&
              ` - ${event.dateEnd.getHours()}:${
                !event.dateEnd.getMinutes() ? `00` : event.dateEnd.getMinutes()
              }`}
        </EventCardTime>
        {pastEvent &&
          event.status !== "conducted" &&
          event.event_type !== "meeting" && (
            <CompletedBlock>
              <div
                style={{ fontWeight: "400" }}
                onClick={(e) => eventAction(e, event)}
              >
                Completed?
              </div>
              <div style={{ display: "flex" }}>
                <button
                  onClick={() =>
                    setAsCompleted(
                      event.id,
                      session,
                      () => openModal("completeEvent", event),
                      () =>
                        dispatch({
                          type: "SET_FORCE_UPDATE",
                          payload: !state.forceUpdate,
                        })
                    )
                  }
                >
                  <ConfirmEventSvg />
                </button>
                <button onClick={() => openModal("cancelEvent", event)}>
                  <CancelEventSvg />
                </button>
              </div>
            </CompletedBlock>
          )}
      </EventCardStyles>
    );
  } else return null;
};

export const CancelEventSvg = () => (
  <svg id="cross" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <circle strokeOpacity=".5" stroke="#2a3744" cx="7" cy="7" r="6.5" />
      <path
        d="M4.884 4.354l2.12 2.12 2.123-2.12a.375.375 0 0 1 .53.53l-2.121 2.12 2.12 2.123a.375.375 0 0 1-.53.53L7.006 7.536l-2.121 2.12a.375.375 0 0 1-.53-.53l2.12-2.121-2.12-2.121a.375.375 0 0 1 .53-.53z"
        fill="#2a3744"
      />
    </g>
  </svg>
);
export const ConfirmEventSvg = () => (
  <svg id="check" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <circle strokeOpacity=".5" stroke="#2a3744" cx="7" cy="7" r="6.5" />
      <path
        d="M10.276 4.617a.375.375 0 0 1 0 .53L6.564 8.86a.375.375 0 0 1-.58-.06.36.36 0 0 1-.153-.077L4.107 7.276a.375.375 0 0 1 .482-.574l1.67 1.401 3.487-3.486a.375.375 0 0 1 .53 0z"
        fill="#2a3744"
      />
    </g>
  </svg>
);
