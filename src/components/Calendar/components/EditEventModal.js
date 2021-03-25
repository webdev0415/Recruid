import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  Modal,
  FlexWrapper,
  HorizontalFlexWrapper,
  DropDownWraper,
  MemberSpan,
} from "containers/Calendar/styles/CalendarComponents";
import { Row, Col } from "react-bootstrap";
import { API_ROOT_PATH } from "constants/api";
import AvatarIcon from "sharedComponents/AvatarIcon";
import notify from "notifications";

const EditEventModal = ({ event, session, closeModal, fetchEvents }) => {
  const { company } = useContext(GlobalContext);
  const [eventName, setEventName] = useState(event.name);
  const [eventDuration, setEventDuration] = useState(30);
  const [displayDropDown, setDisplayDropDown] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState(``);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [chosenParticipants, setChosenParticipants] = useState([
    ...event.participants,
  ]);
  // Fetch all team members on inial load
  useEffect(() => {
    (async function () {
      const url = `${API_ROOT_PATH}/v1/companies/${company.id}/team_members`;
      const params = { method: `GET`, headers: session };
      try {
        const data = await (await fetch(url, params)).json();
        await setMembers(data);
        await setFilteredMembers(data);
      } catch (err) {
        notify("danger", `Failed to get the list of team members!`);
      }
    })();
  }, [company.id, session]);
  // Filter members by name when the length of name typed changes
  useEffect(() => {
    const filterByName = () => {
      return members.filter((member) => {
        return member.name.toLowerCase().includes(memberName.toLowerCase());
      });
    };
    setFilteredMembers(filterByName());
  }, [members, memberName]);
  const deleteEvent = async () => {
    const url = `${API_ROOT_PATH}/v1/interview_events/${event.id}`;
    const params = { method: "DELETE", headers: session };
    try {
      const postData = await fetch(url, params);
      const data = await postData.json();
      if (!!data && data.message === "It worked") {
        fetchEvents();
        notify("info", "Event has been successfully deleted");
      }
      return data;
    } catch (e) {
      notify("danger", `Unable to delete en event!`);
    } finally {
      closeModal();
    }
  };
  const editEvent = async () => {
    const year = event.date.getFullYear();
    const month = event.date.getMonth();
    const day = event.date.getDate();
    const hours = event.date.getHours();
    const body = {
      name: eventName,
      participants: [...chosenParticipants],
      start: event.date,
      end: new Date(year, month, day, hours, eventDuration),
    };
    const url = `${API_ROOT_PATH}/v1/interview_events/${event.id}`;
    const params = {
      method: "PUT",
      headers: session,
      body: JSON.stringify(body),
    };
    try {
      const postData = await fetch(url, params);
      const data = await postData.json();
      if (!!data && data.message === "Success") {
        fetchEvents();
        notify("info", "Event has been successfully deleted");
      }
      return data;
    } catch (e) {
      notify("danger", `Unable to delete en event!`);
    } finally {
      closeModal();
    }
  };
  return (
    <Modal
      id={"editEvent"}
      className={"modal fade"}
      role={"dialog"}
      onClick={(event) => {
        if (event.target.id !== "modal-content") {
          console.log("here");
        }
      }}
    >
      <div className="modal-dialog" id={"modal-content"}>
        <div className="modal-content">
          <h2>Edit an Event!</h2>
          <Row>
            <Col sm={12}>
              <label className="form-label form-heading form-heading-small">
                {`What's the name for the event you're creating?`}
              </label>
            </Col>
            <Col sm={12}>
              <input
                className="form-control"
                type={"text"}
                placeholder="Event name"
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                required={true}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <label className="form-label form-heading form-heading-small">
                Start time
              </label>
            </Col>
            <Col sm={12}>
              <input
                className="form-control"
                type="text"
                value={!!event && event.date.toString()}
                readOnly={true}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <label className="form-label form-heading form-heading-small">
                How long will the interview take?
              </label>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <select
                className="form-control"
                onChange={(e) => setEventDuration(e.target.value)}
              >
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </Col>
          </Row>
          {chosenParticipants && (
            <FlexWrapper>
              {chosenParticipants.map((participant, index) => (
                <HorizontalFlexWrapper key={`participant-#${index}`}>
                  <AvatarIcon
                    imgUrl={participant.avatar}
                    name={participant.name}
                    size={50}
                  />
                  <span>{participant.name}</span>
                </HorizontalFlexWrapper>
              ))}
            </FlexWrapper>
          )}
          <Row>
            <Col sm={12}>
              <label className="form-label form-heading form-heading-small">
                Select participants for your event
              </label>
              <input
                type="text"
                className="form-control"
                name="title"
                autoComplete="off"
                style={{ marginBottom: "0px" }}
                placeholder={`Enter the team member name`}
                onChange={(e) => setMemberName(e.target.value)}
                value={memberName}
                onFocus={() => setDisplayDropDown(true)}
                onBlur={() => setTimeout(() => setDisplayDropDown(false), 150)}
                required
              />
            </Col>
          </Row>
          {displayDropDown && (
            <DropDownWraper>
              <div style={{ maxHeight: "250px", overflowY: "scroll" }}>
                {filteredMembers.length &&
                  filteredMembers.map((member, index) => (
                    <MemberSpan
                      key={`member_${index}`}
                      style={{
                        borderBottom:
                          index !== filteredMembers.length - 1 &&
                          "1px solid #eeeeee",
                      }}
                      onClick={() =>
                        setChosenParticipants([...chosenParticipants, member])
                      }
                    >
                      {member.name}
                    </MemberSpan>
                  ))}
              </div>
            </DropDownWraper>
          )}
          <FlexWrapper>
            <button
              className="button button--default button--grey"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="button button--default button--grey"
              onClick={deleteEvent}
            >
              Delete Event
            </button>
            <button
              className="button button--default button--primary"
              onClick={editEvent}
            >
              Edit
            </button>
          </FlexWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;
