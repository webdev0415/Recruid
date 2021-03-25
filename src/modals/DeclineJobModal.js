import React, { useState, useEffect } from "react";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";
import { prepareMentions } from "constants/noteMentions";
import notify from "notifications";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import AppButton from "styles/AppButton";
import { fetchCreateNote } from "helpersV2/notes/candidate";

const DeclineJobModal = ({ hide, job, callDeclineJob, store, jobId }) => {
  const [currentNote, setCurrentNote] = useState("");
  const [relevantMembers, setRelevantMembers] = useState([]);
  const [sendingRequest, setSendingRequest] = useState(false);
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

  const createNoteAndDecline = () => {
    let trimmedNote = currentNote.trim();
    if (trimmedNote === "") {
      return callDeclineJob();
    }
    if (sendingRequest) return;
    setSendingRequest(true);
    let { notifyAll, mentionTags } = prepareMentions(currentNote);
    const payload = {
      author_id: store.session.id,
      author_name: store.user.name,
      body: trimmedNote,
      title: `${job.title} notes`,
      mention_tags: mentionTags?.length > 0 ? mentionTags : undefined,
      team_assigned_notification: notifyAll || undefined,
      company_id: store.company.id,
      //job props
      job_id: jobId,
      // client_id: noteType === "client" ? jobData?.company?.id : undefined,
      client_note: false,
      // noteType === "client" && jobData?.company?.id ? true : false,
    };

    fetchCreateNote(store.session, payload, jobId, "JobPost")
      .then((res) => {
        if (!res.err) {
          callDeclineJob(res.id);
        } else {
          notify("danger", res);
        }
      })
      .catch(() => {
        notify("danger", "Unable to add note to job");
        callDeclineJob();
      })
      .finally(() => {
        setSendingRequest(false);
      });
  };

  return (
    <UniversalModal show={true} hide={hide} id="decline-job-modal" width={480}>
      <MinimalHeader title={`Decline ${job.title}`} hide={hide} />
      <STModalBody className="no-footer">
        <Text>{`You can leave a note in the job mentioning the reasons for declining`}</Text>
        <NoteInput
          members={relevantMembers}
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          store={store}
          customStyle={noteInputStyle}
        />
        <Footer>
          <STButton
            theme="pink"
            size="small"
            onClick={() => createNoteAndDecline()}
          >
            Decline
          </STButton>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

export default DeclineJobModal;

const STModalBody = styled(ModalBody)`
  padding: 20px !important;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 17px;
  color: #74767b;
  margin-bottom: 20px;
  // max-width: 300px;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
`;

const STButton = styled(AppButton)`
  border-radius: 8px;
  padding: 5px 20px;
`;
