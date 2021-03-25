import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";

import NotesTab from "components/Profiles/Tabs/NotesTab";
import { fetchCandidateNotes } from "helpersV2/notes/candidate";

const SLICE_LENGTH = 10;

const CandidateNotesTab = ({
  notes,
  setNotes,
  tnProfile,
  tnProfileId,
  setReplyToNote,
  canEdit,
}) => {
  const store = useContext(GlobalContext);
  const [addNote, setAddNote] = useState(undefined);

  useEffect(() => {
    if (tnProfileId && store.company && store.session && notes === undefined) {
      fetchCandidateNotes(store.session, store.company.id, tnProfileId, [
        0,
        SLICE_LENGTH,
      ]).then((res) => {
        if (!res.err) {
          setNotes(res);
        } else {
          setNotes(false);
          notify("danger", "Unable to fetch notes");
        }
      });
    }
  }, [notes, setNotes, tnProfileId, store.company, store.session]);

  const loadMoreNotes = () => {
    fetchCandidateNotes(store.session, store.company.id, tnProfileId, [
      notes.length,
      SLICE_LENGTH,
    ]).then((res) => {
      if (!res.err) {
        setNotes([...notes, ...res]);
      } else {
        notify("danger", "Unable to fetch notes");
      }
    });
  };

  return (
    <NotesTab
      notes={notes}
      setNotes={setNotes}
      hasMoreNotes={
        notes && notes.length !== 0 && notes.length % SLICE_LENGTH === 0
          ? true
          : false
      }
      fetchMoreNotes={loadMoreNotes}
      addNote={addNote}
      setAddNote={setAddNote}
      tnId={tnProfile.ptn_id}
      source={"ProfessionalTalentNetwork"}
      sourceId={tnProfile.ptn_id}
      setReplyToNote={setReplyToNote}
      canEdit={canEdit}
    />
  );
};

// const NotesButtons = ({ setAddNote, jobData, store }) => {
//   return (
//     <AddNoteContainer>
//       <button
//         className="button button--default button--blue-dark"
//         onClick={() => {
//           setAddNote("internal");
//         }}
//       >
//         Add Internal Note
//       </button>
//       {jobData && jobData.job_owner_company_id !== store.company.id && (
//         <button
//           className="button button--default button--primary"
//           style={{ marginLeft: "15px" }}
//           onClick={() => {
//             setAddNote("client");
//           }}
//         >
//           Add Note for Client
//         </button>
//       )}
//     </AddNoteContainer>
//   );
// };

export default CandidateNotesTab;
