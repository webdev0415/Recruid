import React, { useState, Suspense } from "react";
import { STModalBody } from "modals/ViewProfilesListsModal/components";

import UniversalModal, {
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import retryLazy from "hooks/retryLazy";

const CandidatesTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/CandidatesTable"))
);
const ContactsTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/ContactsTable"))
);
const DealsTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/DealsTable"))
);
const NotesTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/NotesTable"))
);
const MeetingsTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/MeetingsTable"))
);
const CallsTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/CallsTable"))
);
const TasksTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/TasksTable"))
);
const InterviewsTable = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal/InterviewsTable"))
);

const ViewProfilesListsModal = ({
  hide,
  elasticIds,
  source,
  title,
  store,
  interviews,
}) => {
  const [profiles, setProfiles] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="view-profiles-lists-modal"
      width={960}
    >
      <ModalHeaderClassic title={title} closeModal={hide} />
      <STModalBody>
        {source === "candidate" && (
          <Suspense fallback={<div />}>
            <CandidatesTable
              elasticIds={elasticIds}
              store={store}
              network={profiles}
              setNetwork={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "contact" && (
          <Suspense fallback={<div />}>
            <ContactsTable
              elasticIds={elasticIds}
              store={store}
              contacts={profiles}
              setContacts={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "deal" && (
          <Suspense fallback={<div />}>
            <DealsTable
              elasticIds={elasticIds}
              store={store}
              deals={profiles}
              setDeals={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "note" && (
          <Suspense fallback={<div />}>
            <NotesTable
              elasticIds={elasticIds}
              store={store}
              notes={profiles}
              setNotes={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "meeting" && (
          <Suspense fallback={<div />}>
            <MeetingsTable
              elasticIds={elasticIds}
              store={store}
              meetings={profiles}
              setMeetings={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "call" && (
          <Suspense fallback={<div />}>
            <CallsTable
              elasticIds={elasticIds}
              store={store}
              calls={profiles}
              setCalls={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "completed_task" && (
          <Suspense fallback={<div />}>
            <TasksTable
              elasticIds={elasticIds}
              store={store}
              tasks={profiles}
              setTasks={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
              completed={true}
            />{" "}
          </Suspense>
        )}
        {source === "task" && (
          <Suspense fallback={<div />}>
            <TasksTable
              elasticIds={elasticIds}
              store={store}
              tasks={profiles}
              setTasks={setProfiles}
              hasMore={hasMore}
              setHasMore={setHasMore}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
        {source === "interviews" && (
          <Suspense fallback={<div />}>
            <InterviewsTable
              elasticIds={elasticIds}
              store={store}
              interviews={interviews}
              loaded={loaded}
              setLoaded={setLoaded}
            />{" "}
          </Suspense>
        )}
      </STModalBody>
      <ModalFooter hide={hide} cancelText="Close" />
    </UniversalModal>
  );
};

export default ViewProfilesListsModal;
