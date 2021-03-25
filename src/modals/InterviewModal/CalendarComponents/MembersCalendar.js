import React, { useState, useEffect } from "react";
import AvatarIcon from "sharedComponents/AvatarIcon";
import styled from "styled-components";
// import moment from "moment";
import spacetime from "spacetime";

import TimeSlots from "modals/InterviewModal/CalendarComponents/TimeSlots";
import InterviewSlots from "modals/InterviewModal/CalendarComponents/InterviewSlots";

const COLUMN_WIDTH = 200;
const ROW_HEIGHT = 10;
const FIRST_COLUMN_WIDTH = 120;
const FIRST_ROW_HEIGHT = 50;

const GridTable = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: ${FIRST_ROW_HEIGHT}px repeat(96, ${ROW_HEIGHT}px);
  grid-template-columns: ${FIRST_COLUMN_WIDTH}px repeat(
      ${(props) => props.columns},
      ${COLUMN_WIDTH}px
    );
`;

const EmptyTopCell = styled.div`
  border-right: solid #eee 1px;
  border-bottom: solid #eee 1px;
  height: ${FIRST_ROW_HEIGHT}px;
  width: ${FIRST_COLUMN_WIDTH + 1}px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: 10px;
`;

const TopCell = ({ timeZone }) => {
  const [offset, setOffset] = useState("");

  useEffect(() => {
    if (timeZone) {
      let dateLocal = spacetime.now();
      let option = dateLocal.offset() / 60 - timeZone.offset() / 60;
      option =
        option > 0
          ? `-${Math.abs(option)}h`
          : option < 0
          ? `+${Math.abs(option)}h`
          : "";
      setOffset(option);
    }
  }, [timeZone]);

  return (
    <EmptyTopCell>
      {timeZone && (
        <>
          <span>LOCAL</span>
          <span>{`${offset} ${timezoneNames[timeZone.tz]}`}</span>
        </>
      )}
    </EmptyTopCell>
  );
};

const HeadersContainer = styled.div`
  background: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  height: ${FIRST_ROW_HEIGHT}px;
  position: fixed;
  min-width: 100%;
  z-index: 11;
  /* top: 145; */
  /* left: 0; */
`;

const MembersCalendar = ({
  selectedTeamMembers,
  membersInterviews,
  setSelectedTeamMembers,
  addMember,

  selectedDate,
  selectedCandidate,
  teamMembers,
  selectedDuration,

  removeMember,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  timeZone,
}) => (
  <GridTable
    id="members-grid"
    columns={selectedTeamMembers.length + 3}
    onMouseDown={(e) => handleMouseDown(e)}
    onMouseMove={(e) => handleMouseMove(e)}
    onMouseUp={(e) => handleMouseUp(e)}
  >
    <HeadersContainer>
      <TopCell timeZone={timeZone} />
      <MembersHeaders
        selectedTeamMembers={selectedTeamMembers}
        setSelectedTeamMembers={setSelectedTeamMembers}
        removeMember={removeMember}
      />
    </HeadersContainer>
    <HoursBar
      selectedTeamMembers={selectedTeamMembers}
      timeZone={timeZone}
      selectedDate={selectedDate}
    />
    <InterviewSlots
      membersInterviews={membersInterviews}
      selectedDate={selectedDate}
    />
    <TimeSlots
      selectedTeamMembers={selectedTeamMembers}
      setSelectedTeamMembers={setSelectedTeamMembers}
    />
    {teamMembers.length !== selectedTeamMembers.length && (
      <EmptyColumns
        selectedTeamMembers={selectedTeamMembers}
        setSelectedTeamMembers={setSelectedTeamMembers}
        addMember={addMember}
        teamMembers={teamMembers}
      />
    )}
    {selectedCandidate && (
      <SelectedSlot
        length={selectedTeamMembers.length}
        time={selectedDate}
        candidateName={
          selectedCandidate.talent_name ||
          selectedCandidate.name ||
          selectedCandidate.applicant_name
        }
        selectedDuration={selectedDuration}
        handleMouseMove={handleMouseMove}
        timeZone={timeZone}
      />
    )}
  </GridTable>
);

export default MembersCalendar;

const SelectedSlot = ({ length, time, candidateName, selectedDuration }) => {
  const StyledAppointment = styled.div`
    align-items: center;
    background: #00cba7;
    box-shadow: 0 0 0 1px #fff;
    color: #ffffff;
    display: flex;
    font-size: 12px;
    font-weight: 500;
    grid-column: 2 / span ${(props) => props.length};
    grid-row: ${(props) => 2 + props.start} / span
      ${Math.round(selectedDuration / 15)};
    justify-content: center;
    z-index: 10;
  `;

  const buildText = () => {
    if (length === 1 || !candidateName) {
      return `${time.getHours() < 10 ? "0" : ""}${time.getHours()}:${
        time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
      }`;
    } else {
      return `${time.getHours()}:${
        time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
      },  Interview with ${candidateName}`;
    }
  };

  if (time) {
    let topPosition = Math.round(time.getHours() * 4 + time.getMinutes() / 15);
    return (
      <StyledAppointment
        length={length}
        start={topPosition}
        height={selectedDuration / 15}
      >
        {buildText()}
      </StyledAppointment>
    );
  } else {
    return null;
  }
};

const HoursBar = ({ selectedTeamMembers, timeZone, selectedDate }) => {
  const StyledSlot = styled.div`
    color: #74767b;
    font-size: 12px;
    grid-column: 1/2;
    grid-row: ${(props) => props.index + 2} / span 4;
    height: 100%;
    position: relative;
    text-align: right;
    user-select: none;

    div {
      position: absolute;
      bottom: -9px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }

    &:after {
      display: block;
      position: absolute;
      content: "";
      height: 1px;
      width: ${(props) => 11 + props.length * COLUMN_WIDTH}px;
      background: #eee;
      z-index: 1;
      bottom: -1px;
      left: ${FIRST_COLUMN_WIDTH - 10}px;
    }
  `;
  const TimeSlot = ({ time, index, timeZone, i }) => {
    const [offsetTime, setOffsetTime] = useState(undefined);

    useEffect(() => {
      if (timeZone) {
        let dateCopy = new Date(selectedDate);
        let midnight = dateCopy.setHours(0, 0, 0, 0);
        let sMidnigth = new spacetime(midnight, timeZone.tz);
        let hour = sMidnigth.hours() + i;
        if (hour < 0) {
          hour += 24;
        } else if (hour > 24) {
          hour = 24 - hour;
        }
        setOffsetTime(
          `${Math.abs(hour) < 10 ? "0" : ""}${Math.floor(Math.abs(hour))}:00`
        );
      }
       
    }, [timeZone]);

    return (
      <StyledSlot
        index={index}
        length={selectedTeamMembers.length}
        className="noselect"
      >
        <div>
          <span className="localTime">{time}</span>
          {timeZone && offsetTime && (
            <span className="otherTime">{offsetTime}</span>
          )}
        </div>
      </StyledSlot>
    );
  };

  let hoursArr = [];
  for (let i = 1; i < 25; i++) {
    hoursArr.push(
      <TimeSlot
        time={`${i < 10 ? "0" : ""}${i}:00`}
        key={`${i}:00`}
        index={(i - 1) * 4}
        i={i}
        timeZone={timeZone}
      />
    );
  }
  return hoursArr;
};

const EmptyColumns = ({
  selectedTeamMembers,

  addMember,
  teamMembers,
}) => {
  const [showMembers, setShowMembers] = useState(false);

  const StyledColumn = styled.div`
    grid-row: 1 / span 97;
    grid-column: ${(props) => 2 + props.index + selectedTeamMembers.length} /
      span 1;
    background: #f6f6f6;
    border-left: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `;

  const StyledSelectColumn = styled.div`
    grid-row: 1 / span 97;
    grid-column: ${(props) => 2 + props.index + selectedTeamMembers.length} /
      span 1;
    background: ${showMembers ? "white" : "#f6f6f6"};
    border-left: ${showMembers ? "1px solid #eee" : "none"};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    user-select: none;

    .column-container {
      overflow: auto;
      max-height: 1010px;
      padding: 0px 5px;
      padding-top: 50px;
    }
  `;

  const notSelectedMembers = () => {
    let filteredMembers = teamMembers.filter((member) => {
      let result = true;
      selectedTeamMembers.map((selected) =>
        selected.professional_id === member.professional_id
          ? (result = false)
          : true
      );
      return result;
    });
    return filteredMembers;
  };

  const MemberContainer = styled.div`
    align-items: center;
    display: flex;
    /* height: ${FIRST_ROW_HEIGHT}px; */
    margin: 10px 0;
    cursor: pointer;

    span {
      font-weight: 500;
      margin-left: 10px;
    }
  `;

  const StyledAddButton = styled.div`
    cursor: pointer;
    top: 55%;
    position: fixed;
  `;

  const SelectColumn = ({ index }) => {
    return (
      <StyledSelectColumn index={index}>
        {!showMembers && (
          <StyledAddButton onClick={() => setShowMembers(true)}>
            <svg
              width="30"
              height="30"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <g fill="none" fill-role="evenodd">
                <circle fill="#9A9CA1" cx="15" cy="15" r="15" />
                <path d="M16 8v6h6v2h-6v6h-2v-6H8v-2h6V8h2z" fill="#FFF" />
              </g>
            </svg>
          </StyledAddButton>
        )}
        {showMembers && (
          <div
            className={
              notSelectedMembers().length > 15 ? "column-container" : ""
            }
          >
            {notSelectedMembers().map((member, index) => (
              <MemberContainer
                key={`member-${index}`}
                onClick={() => {
                  addMember(member);
                  setShowMembers(false);
                }}
              >
                <AvatarIcon
                  name={member.name}
                  imgUrl={member.avatar}
                  size={20}
                />
                <span>{member.name}</span>
              </MemberContainer>
            ))}
          </div>
        )}
      </StyledSelectColumn>
    );
  };

  let columnsArr = [];
  for (let i = 0; i < 4; i++) {
    columnsArr.push(
      i !== 0 ? (
        <StyledColumn index={i} key={`emptyColumn-${i}`} />
      ) : (
        <SelectColumn index={i} key={`emptyColumn-${i}`} />
      )
    );
  }
  return columnsArr;
};

const MembersHeaders = ({
  selectedTeamMembers,

  removeMember,
}) => {
  const MemberHeader = ({ member, index, remove }) => {
    const StyledHeader = styled.div`
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      position: relative;
      overflow: hidden;
      border-bottom: solid #eee 1px;
      border-right: solid #eee 1px;
      height: ${FIRST_ROW_HEIGHT}px;
      width: ${COLUMN_WIDTH}px;
      z-index: 5;

      &:hover {
        .remove-overlay {
          opacity: 0.8;
        }
      }
    `;

    const UserHeader = styled.div`
      align-items: center;
      display: flex;

      span {
        font-size: 14px;
        font-weight: 500;
        margin-left: 10px;
      }
    `;

    const RemoveOverlay = styled.div`
      align-items: center;
      background: #000;
      color: #fff;
      cursor: pointer;
      display: flex;
      height: 100%;
      justify-content: center;
      opacity: 0;
      position: absolute;
      transition: ease-in-out all 100ms;
      width: 100%;
    `;

    return (
      <StyledHeader index={index} onClick={() => remove(index)}>
        <UserHeader>
          <AvatarIcon name={member.name} imgUrl={member.avatar} size={20} />
          <span>{member.name}</span>
        </UserHeader>
        {index !== 0 && (
          <RemoveOverlay className="remove-overlay">
            <span>Remove</span>
          </RemoveOverlay>
        )}
      </StyledHeader>
    );
  };

  let headersArr = [];
  for (let i = 0; i < selectedTeamMembers.length; i++) {
    headersArr.push(
      <MemberHeader
        member={selectedTeamMembers[i]}
        index={i}
        remove={removeMember}
        key={`header-${i}`}
      />
    );
  }
  return headersArr;
};

const timezoneNames = {
  "etc/gmt+12": "E/K",
  "pacific/niue": "Samoa",
  "pacific/honolulu": "Hawaii",
  "america/anchorage": "UA",
  "america/los_angeles": "PT",
  "america/edmonton": "MT",
  "america/mexico_city": "CT",
  "america/new_york": "ET",
  "america/lima": "AT",
  "america/halifax": "AT",
  "america/argentina/buenos_aires": "BA",
  "etc/gmt-2": "MA",
  "atlantic/azores": "AZ",
  "europe/london": "WE",
  "europe/brussels": "EB",
  "europe/kaliningrad": "SA",
  "europe/moscow": "Moscow",
  "asia/dubai": "AD",
  "asia/yekaterinburg": "EK",
  "asia/almaty": "AA",
  "asia/bangkok": "Bangkok",
  "asia/hong_kong": "HK",
  "asia/tokyo": "Tokyo",
  "pacific/guam": "EA",
  "asia/magadan": "SI",
  "pacific/auckland": "PA",
  "pacific/apia": "PA",
};
