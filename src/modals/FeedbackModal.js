import React, { useState, useEffect, useContext } from "react";
import UniversalModal, {
  ModalFooter,
  ModalHeaderV2,
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";

import GlobalContext from "contexts/globalContext/GlobalContext";
import { API_ROOT_PATH } from "constants/api";
import { MENTION_REGEX } from "constants/regex";
import { AWS_CDN_URL } from "constants/api";
// import { getJobPost } from "helpersV2/jobs";

import ChangeStatusSelect from "sharedComponents/ChangeStatusSelect";
import styled from "styled-components";
import notify from "notifications";

const FeedbackModal = (props) => {
  const store = useContext(GlobalContext);
  const [selectedRating, setSelectedRating] = useState(undefined);
  const [feedback, setFeedback] = useState("");
  const [callbackStatusFunction, setCallbackStatusFunction] = useState({
    call: () => null,
  });
  const [isAgenciesClientJob, setIsAgenciesClientJob] = useState(null);
  const [relevantMembers, setRelevantMembers] = useState([]);

  // GET JOB POST
  useEffect(() => {
    if (props.interviewEvent?.company && store.company) {
      const isClientsJob = props.interviewEvent.company.id !== store.company.id;
      setIsAgenciesClientJob(isClientsJob);
    }
  }, [props.interviewEvent, store.company]);

  const submitNote = () => {
    let trimmedNote = feedback.trim();
    if (feedback === "") {
      // alert("Please fill in some feedback");
      notify("danger", "Please fill in some feedback");
      return;
    }
    let matches = feedback.match(MENTION_REGEX);
    let mentionTags = [];
    let notifyAll = false;
    if (matches && matches.length > 0) {
      matches.map((match) => {
        let mentionTagArr = match.match(/[(][^)]*[)]/);
        let mentionTag = mentionTagArr[0].substring(
          1,
          mentionTagArr[0].length - 1
        );
        if (mentionTag !== "ALL") {
          mentionTags.push(mentionTag);
        } else {
          notifyAll = true;
        }

        return null;
      });
    }

    const url = `${API_ROOT_PATH}/v1/notes?source_id=${props.interviewEvent.tn_profile_id}&source=ProfessionalTalentNetwork`;
    const payload = {
      professional_id: props.interviewEvent.applicant.applicant_prof_id,
      author_id: store.session.id,
      author_name: store.user.name,
      title: `${props.interviewEvent.applicant.applicant_name} notes`,
      body: trimmedNote,
      company_id: props.interviewEvent.company.company_id,
      applicant_id: props.interviewEvent.applicant.applicant_id,
      job_id: props.interviewEvent.job_id,
      rating: selectedRating,
      tn_profile_id: props.interviewEvent.tn_profile_id,
    };

    if (mentionTags.length > 0) {
      payload.mention_tags = mentionTags;
    }
    if (notifyAll) {
      payload.team_assigned_notification = notifyAll;
    }
    fetch(url, {
      method: "POST",
      headers: store.session,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (response.ok) {
        callbackStatusFunction.call();
        notify("info", "Your feedback has been added to the candidate notes");
        if (props.afterFinish) {
          props.afterFinish();
        }
        props.hide();
      } else {
        notify("danger", "Creating applicant notes failed");
      }
    });
  };

  useEffect(() => {
    if (store.teamMembers) {
      setRelevantMembers(
        store.teamMembers.filter(
          (member) =>
            member.permission === "owner" ||
            member.permission === "admin" ||
            member.roles.includes("recruiter") ||
            member.roles.includes("hiring_manager")
        )
      );
    }
  }, [store.teamMembers]);

  return (
    <UniversalModal
      show={props.show}
      hide={props.hide}
      id={"feedback-modal"}
      width={520}
    >
      <ModalHeaderV2
        name={props.name}
        userAvatar={props.userAvatar}
        subTitle={props.subTitle}
      />
      <STModalBody>
        <div
          style={{
            padding: "20px 20px 0",
            margin: "0 40px",
            borderBottom: "1px solid #eee ",
          }}
        >
          <p>{`Would you like to change ${props.interviewEvent.applicant.applicant_name}'s status for this job?`}</p>
          <ChangeStatusSelect
            jobId={props.interviewEvent.job_id}
            applicantId={props.interviewEvent.applicant.applicant_id}
            professionalId={props.interviewEvent.applicant.applicant_prof_id}
            setCallbackStatusFunction={setCallbackStatusFunction}
            redirectToScheduleModal={props.redirectToScheduleModal}
            redirectToOfferModal={props.redirectToOfferModal}
            isAgenciesClientJob={isAgenciesClientJob}
            jobOwnerId={props.interviewEvent.company.company_id}
          />
        </div>
        <h1>{`How was your interview with ${props.interviewEvent.applicant.applicant_name}?`}</h1>
        <EmojiContainer selectedRating={selectedRating}>
          <EmojiButton
            onClick={() => setSelectedRating(1)}
            selectedRating={selectedRating}
            value={1}
          >
            <img src={`${AWS_CDN_URL}/icons/CryEmoji.svg`} alt="CryEmoji" />
          </EmojiButton>
          <EmojiButton
            onClick={() => setSelectedRating(2)}
            selectedRating={selectedRating}
            value={2}
          >
            <img src={`${AWS_CDN_URL}/icons/SadEmoji.svg`} alt="SadEmoji" />
          </EmojiButton>
          <EmojiButton
            onClick={() => setSelectedRating(3)}
            selectedRating={selectedRating}
            value={3}
          >
            <img src={`${AWS_CDN_URL}/icons/MehEmoji.svg`} alt="MehEmoji" />
          </EmojiButton>
          <EmojiButton
            onClick={() => setSelectedRating(4)}
            selectedRating={selectedRating}
            value={4}
          >
            <img src={`${AWS_CDN_URL}/icons/SmileEmoji.svg`} alt="SmileEmoji" />
          </EmojiButton>
          <EmojiButton
            onClick={() => setSelectedRating(5)}
            selectedRating={selectedRating}
            value={5}
          >
            <img src={`${AWS_CDN_URL}/icons/LaughEmoji.svg`} alt="LaughEmoji" />
          </EmojiButton>
        </EmojiContainer>
        {selectedRating && store.teamMembers && store.teamMembers.length > 0 ? (
          <NoteContainer>
            <NoteInput
              members={relevantMembers}
              currentNote={feedback}
              setCurrentNote={setFeedback}
              store={store}
              customStyle={noteInputStyle}
            />
          </NoteContainer>
        ) : selectedRating ? (
          <StyledNoteInput
            placeholder="Type something..."
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        ) : null}
      </STModalBody>
      <ModalFooter hide={props.hide}>
        <button
          id="forward"
          className="button button--default button--blue-dark"
          onClick={submitNote}
        >
          Submit
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

const STModalBody = styled(ModalBody)`
  border-bottom: 1px solid #eee;
  padding-bottom: 20px !important;

  h1 {
    text-align: center;
    margin-top: 41px;
  }
`;

const EmojiContainer = styled.div`
  display: flex;
  margin: auto;
  padding: 40px;
  align-items: center;
  justify-content: space-around;

  :hover {
    div {
      opacity: ${(props) => (!props.selectedRating ? 0.5 : 1)};
    }
  }
`;

const EmojiButton = styled.div`
  font-size: 20px;
  cursor: pointer;
  :hover {
    opacity: 1 !important;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-name: ${(props) => (!props.selectedRating ? "shake" : "")};
  }
  filter: grayscale(
    ${(props) =>
      !props.selectedRating || props.selectedRating === props.value
        ? "0%"
        : "100%"}
  );
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
`;

// const TextAreaContainer = styled.div`
//   padding: 0 60px;
//
//   textarea {
//     background: #f5f2f2;
//   }
// `;

const StyledNoteInput = styled.input`
  background: #ffffff;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  color: #2c2c2c;
  font-size: 15px;
`;

const NoteContainer = styled.div`
  margin: 0px 40px;
`;

export default FeedbackModal;
