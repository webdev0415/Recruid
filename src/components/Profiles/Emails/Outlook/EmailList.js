import React from "react";
import styled from "styled-components";
// import NoEmails from "./NoEmails";

import EmptyTab from "components/Profiles/components/EmptyTab";
import { EmailPreview } from "./EmailPreview";
import { EmptyEmails } from "assets/svg/EmptyImages";
const AddEmailContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export default function EmailsList({
  setNewEmailData,
  emails,
  openModal,
  session,
  shouldThreadUpdate = false,
  getMsalToken,
  role,
  receiver_id,
}) {
  return (
    <div>
      <AddEmailContainer>
        <button
          className="button button--default button--blue-dark"
          onClick={() => openModal()}
        >
          New Email
        </button>
      </AddEmailContainer>
      {!!emails && emails?.length ? (
        <div>
          {emails.map((email, idx) => (
            <EmailPreview
              key={`email-#${idx + 1}`}
              email={email}
              session={session}
              openModal={openModal}
              getMsalToken={getMsalToken}
              setNewEmailData={setNewEmailData}
              shouldThreadUpdate={shouldThreadUpdate}
              role={role}
              receiver_id={receiver_id}
            />
          ))}
        </div>
      ) : (
        ""
      )}
      {emails?.length === 0 && (
        <EmptyTab
          data={emails}
          title={"This candidate has no emails."}
          copy={"Why don't you send one?"}
          image={<EmptyEmails />}
        />
      )}
    </div>
  );
}
