import React, { useState, useEffect } from "react";
// Components
import AvatarIcon from "sharedComponents/AvatarIcon";
// Styles
import { Row, Col } from "react-bootstrap";
import {
  Modal,
  FlexWrapper,
  HorizontalFlexWrapper,
  DropDownWraper,
  MemberSpan,
} from "containers/Calendar/styles/CalendarComponents";
// Helpers
import { API_ROOT_PATH } from "constants/api";
import notify from "notifications";

const CreateEventModal = ({
  event,
  session,
  companyId,
  closeModal,
  fetchEvents,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDuration, setEventDuration] = useState(60);
  const [displayDropDown, setDisplayDropDown] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState(``);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [chosenParticipants, setChosenParticipants] = useState([]);
  // Fetch all team members on inial load
  useEffect(() => {
    (async function () {
      const url = `${API_ROOT_PATH}/v1/companies/${companyId}/team_members`;
      const params = { method: `GET`, headers: session };
      try {
        const data = await (await fetch(url, params)).json();
        await setMembers(data);
        await setFilteredMembers(data);
      } catch (err) {
        notify("danger", `Failed to get the list of team members!`);
      }
    })();
  }, [companyId, session]);
  // Filter members by name when the length of name typed changes
  useEffect(() => {
    const filterByName = () => {
      return members.filter((member) => {
        return member.name.toLowerCase().includes(memberName.toLowerCase());
      });
    };
    setFilteredMembers(filterByName());
  }, [members, memberName]);
  const createEvent = async () => {
    const year = event.getFullYear();
    const month = event.getMonth();
    const day = event.getDate();
    const hours = event.getHours();
    const body = {
      name: eventName,
      participants: [...chosenParticipants],
      start: event,
      end: new Date(year, month, day, hours, eventDuration),
    };
    const url = `${API_ROOT_PATH}/v1/interview_events`;
    const params = {
      method: "POST",
      headers: session,
      body: JSON.stringify(body),
    };
    try {
      const postData = await fetch(url, params);
      if (!!postData && postData.status === 200) {
        fetchEvents();
        notify("info", "Event has been successfully added to your calendar");
      }
      return await postData.json();
    } catch (e) {
      notify("danger", `Unable to post en event!`);
    } finally {
      closeModal();
    }
  };
  return (
    <Modal id={"createEvent"} className={"modal fade"} role={"dialog"}>
      <div className="modal-dialog">
        <div className="modal-content">
          <h2>Schedule an event!</h2>
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
                value={event.toString()}
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
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option selected defaultValue={60}>
                  60 min
                </option>
                <option value={75}>75 min</option>
                <option value={90}>90 min</option>
                <option value={105}>105 min</option>
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
              className="button button--default button--primary"
              onClick={createEvent}
            >
              Submit
            </button>
          </FlexWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEventModal;
