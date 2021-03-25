import React, { useState, useEffect, useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
// Components
import AvatarIcon from "sharedComponents/AvatarIcon";
import {
  TMFilter,
  MoreParticipants,
} from "components/Calendar/styles/CalendarComponents";

const AvatarContainer = styled.div`
  &.avatar {
    opacity: 0.5;
    transition: all 0.1s linear;

    &:hover,
    &.active {
      opacity: 1;
    }
  }
`;

const FilterParticipant = styled.div`
  background: #fff;
  cursor: pointer;
  border-radius: 50%;
  margin-left: -10px;
  padding: 2px;
  transition: all 0.1s linear;
  z-index: 1;

  &:hover,
  &.active {
    transform: translateY(-4px);
    z-index: 1;
  }
`;

const MembersFilter = ({ resetTMFilter }) => {
  const { state, dispatch } = useContext(CalendarContext);
  const store = useContext(GlobalContext);
  const [limit, setLimit] = useState(10);
  const getMore = () => {
    const totalLength = store.teamMembers.length;
    const currentLength = limit;
    if (totalLength - currentLength > 0) {
      setLimit(totalLength);
    }
  };

  useEffect(() => {
    if (resetTMFilter) setLimit(10);
  }, [resetTMFilter]);

  function handleMemberClick(id) {
    let nextIds = [...state.calendarId];
    let index = nextIds.indexOf(id);
    if (!nextIds.length) {
      nextIds.push(id);
      dispatch({ type: "SET_CALENDAR_ID", payload: nextIds });
      return;
    }
    if (index === -1) nextIds.push(id);
    else nextIds.splice(index, 1);
    dispatch({ type: "SET_CALENDAR_ID", payload: nextIds });
    return;
  }

  return (
    <TMFilter>
      {!!store.company && (
        <OverlayTrigger
          key={`top-0`}
          placement={"top"}
          overlay={
            <Tooltip id={`tooltip-top`}>
              <strong>{store.company.name}</strong>
            </Tooltip>
          }
        >
          <FilterParticipant
            onClick={() => dispatch({ type: "SET_CALENDAR_ID", payload: [] })}
            className={!state.calendarId.length ? `active` : `test`}
          >
            <AvatarContainer
              className={`${!state.calendarId.length ? `active` : `test`} ${
                store.company.avatar_url && "avatar"
              }`}
            >
              <AvatarIcon
                imgUrl={store.company.avatar_url}
                name={store.company.name}
                size={28}
              />
            </AvatarContainer>
          </FilterParticipant>
        </OverlayTrigger>
      )}
      {!!store.teamMembers &&
        store.teamMembers.map((participant, index) => {
          let isActive;
          if (!state.calendarId.length) {
            isActive = ``;
          } else {
            isActive = state.calendarId.includes(participant.professional_id)
              ? `active`
              : `  `;
          }
          if (index < limit) {
            return (
              <OverlayTrigger
                key={`top-${index + 1}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-top ${index}`}>
                    <strong>{participant.name}</strong>
                  </Tooltip>
                }
              >
                <FilterParticipant
                  className={isActive}
                  onClick={() => handleMemberClick(participant.professional_id)}
                >
                  <AvatarContainer
                    className={`${isActive} ${participant.avatar && "avatar"}`}
                  >
                    <AvatarIcon
                      imgUrl={participant.avatar}
                      name={participant.name}
                      size={28}
                    />
                  </AvatarContainer>
                </FilterParticipant>
              </OverlayTrigger>
            );
          } else return false;
        })}
      {!!store.teamMembers && store.teamMembers.length > limit && (
        <MoreParticipants onClick={getMore}>
          +{store.teamMembers.length - limit}
        </MoreParticipants>
      )}
    </TMFilter>
  );
};

export default MembersFilter;
