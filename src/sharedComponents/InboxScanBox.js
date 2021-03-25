import React, { useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import styled from "styled-components";
import {
  searchGoogleMessages,
  sendGoogleMessagesIdsToServer,
  notifyEmailsImported,
} from "components/Profiles/Emails/emailMethods";
import { getCandidatesAndContactsEmails } from "helpersV2/company";

export default function InboxScanBox({
  gmailUser,
  noBorder = false,
  setGmailUser,
}) {
  const { session, company, user, dispatch } = useContext(GlobalContext);

  const getGoogleMessagesIds = async (
    messagesIds = [],
    filters,
    pageToken = null
  ) => {
    const nextMessages = await searchGoogleMessages(
      gmailUser.access_token,
      filters,
      pageToken
    );
    const allMessagesIds = nextMessages
      ? messagesIds.concat(nextMessages.messages)
      : messagesIds;

    if (nextMessages && nextMessages.nextPageToken) {
      return getGoogleMessagesIds(
        allMessagesIds,
        filters,
        nextMessages.nextPageToken
      );
    }

    return allMessagesIds;
  };

  const postGoogleMessagesIds = (session, company, user) => async () => {
    dispatch({ type: "UPDATE_EMAILS_SCAN", payload: true });
    if (!gmailUser) return;
    const candidatesAndContactsEmail = await getCandidatesAndContactsEmails(
      session,
      company.id
    );
    // Whole filter looks like - '{from:email@1.com from:email@2.com ...}'
    let emailsFilter = [];
    for (let email of candidatesAndContactsEmail) {
      emailsFilter.push(`from:${email}`);
    }
    emailsFilter = emailsFilter.join(" ");

    const messagesIds = await getGoogleMessagesIds([], emailsFilter);
    await sendGoogleMessagesIdsToServer(
      session,
      company.id,
      user.id,
      messagesIds
    );
    dispatch({ type: "UPDATE_EMAILS_SCAN", payload: false });
    notifyEmailsImported(session, gmailUser.id);
  };

  const handleNoScanClick = () => {
    notifyEmailsImported(session, gmailUser.id);
    setGmailUser((prevState) => ({ ...prevState, emails_imported: true }));
  };

  return (
    <InboxScanSC noBorder={noBorder}>
      <p>
        Want to have all your candidate, client and contact emails stored in
        Leo? Just give us your permission below, we will scan your inbox and
        store all emails on the respective records{" "}
        <span role="img" aria-label="dance emoji">
          💃
        </span>
      </p>
      <div className="buttons">
        <button
          className="button button--default button--blue-dark"
          onClick={postGoogleMessagesIds(session, company, user)}
        >
          Yes, scan my inbox
        </button>
        <button
          className="button button--default button--grey"
          onClick={handleNoScanClick}
        >
          {`No, don't scan`}
        </button>
      </div>
    </InboxScanSC>
  );
}

const InboxScanSC = styled.div`
  background: #fff;
  border: ${(props) => (!props.noBorder ? "1px solid #e1e1e1" : 0)};
  border-bottom: ${(props) =>
    !props.noBorder ? "1px solid #e1e1e1" : "1px solid #e1e1e1"};
  border-radius: ${(props) => (!props.noBorder ? "4px" : 0)};
  margin-bottom: 30px;
  max-width: ${(props) => (!props.noBorder ? "500px" : "none")};
  padding: ${(props) => (!props.noBorder ? "20px" : 0)};
  padding-bottom: ${(props) => (!props.noBorder ? "20px" : "30px")};
  width: 100%;

  h2 {
    font-weight: 500;
    margin-bottom: 10px;
  }

  p {
    color: #74767b;
    margin-bottom: 20px;
  }

  .buttons {
    button:first-of-type {
      margin-right: 10px;
    }
  }
`;
