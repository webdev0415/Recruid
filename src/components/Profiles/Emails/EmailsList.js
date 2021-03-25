import React from "react";
import styled from "styled-components";
// import NoEmails from "./NoEmails";

import { EmailPreview } from "./EmailPreview";
import EmptyTab from "components/Profiles/components/EmptyTab";
import { AWS_CDN_URL } from "constants/api";
import InboxScanBox from "sharedComponents/InboxScanBox";
import { EmptyEmails } from "assets/svg/EmptyImages";
const AddEmailContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Button = styled.button`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  padding: 10px 0;
  width: 160px;

  svg,
  img {
    margin-right: 15px;
  }

  span {
    color: #1f1f1f;
    font-size: 14px;
    font-weight: 600;
  }
`;

export default function EmailsList({
  emails,
  gmailUser,
  grantAccess,
  openModal,
  session,
  shouldThreadUpdate,
  role,
  receiver_id,
  setGmailUser,
}) {
  return (
    <div>
      {!!gmailUser && !gmailUser?.emails_imported && (
        <InboxScanBox
          gmailUser={gmailUser}
          setGmailUser={setGmailUser}
          noBorder
        />
      )}
      <AddEmailContainer>
        {gmailUser ? (
          <button
            className="button button--default button--blue-dark"
            onClick={() => openModal()}
          >
            New Email
          </button>
        ) : (
          <Button onClick={grantAccess}>
            <img src={`${AWS_CDN_URL}/icons/gmail-ico.svg`} alt="Gmail Icon" />
            <span>Connect Google Mail</span>
          </Button>
        )}
      </AddEmailContainer>

      {!!emails && emails.length ? (
        <div>
          {emails.map((email, idx) => (
            <EmailPreview
              key={`email-#${idx + 1}`}
              email={email}
              session={session}
              openModal={openModal}
              shouldThreadUpdate={shouldThreadUpdate}
              gmailUser={gmailUser}
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
