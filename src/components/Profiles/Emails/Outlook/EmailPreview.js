import React, { useState, Fragment } from "react";
import AvatarIcon from "sharedComponents/AvatarIcon";
import styled from "styled-components";
import renderHTML from "react-render-html";
import { getConversation } from "helpersV2/outlook";

export const EmailPreview = ({
  email,
  setNewEmailData,
  openModal,
  getMsalToken,
}) => {
  const [conversation, setConversation] = useState(null);
  const [threadOpened, setThreadOpened] = useState(false);

  const displayConversation = async () => {
    const accessToken = await getMsalToken();
    const nextConversation = await getConversation(
      accessToken,
      email.conversation_id
    );
    setConversation(
      () =>
        nextConversation?.value?.map((email) => ({
          message_id: email.Id,
          email_body: email.Body,
          from: email.From?.EmailAddress,
          to: email.ToRecipients?.map((recipient) => recipient.EmailAddress),
          subject: email.Subject,
          sent_at: email.SentDateTime,
          preview: email.BodyPreview,
        })) ?? null
    );
    setThreadOpened(true);
  };

  const collapseThread = () => {
    setThreadOpened(false);
    setConversation(null);
  };

  const toggleReplyModal = () => {
    setNewEmailData(() => ({
      conversationSubject: email.subject,
      messageId: email.message_id,
    }));
    openModal();
  };

  const convertDate = (date) => {
    let emailDate = new Date(date);
    let options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    let renderDate = emailDate.toLocaleDateString("en-GB", options);
    return renderDate;
  };

  return (
    <EmailItem>
      <EmailSubject>
        <h2>{email.subject}</h2>
        <button onClick={toggleReplyModal}>
          <svg
            width="18"
            height="13"
            xmlns="http://www.w3.org...replyData/svg"
            xlinkHref="http://www.w3.org/1999/xlink"
          >
            <path
              d="M6.585 0L0 5.793l6.585 5.792V8.573c.374-.018 6.888-.24 11.415 3.94-1.812-5.892-7.502-8.455-11.415-9.5V0z"
              fill="#9A9CA1"
              fill-role="nonzero"
            />
          </svg>
        </button>
      </EmailSubject>
      {!threadOpened && (
        <Fragment>
          <EmailHeader>
            <div className="leo-flex-center">
              <AvatarIcon name={email.from} imgUrl={null} size={30} />
              <EmailHeaderDetails>
                <From>{email.from}</From>
                <To>To: ({email.to})</To>
              </EmailHeaderDetails>
            </div>
            <EmailDate>
              {email?.sent_at
                ? convertDate(email.sent_at)
                : convertDate(email.created_at)}
            </EmailDate>
          </EmailHeader>
          <Preview>{email.preview}</Preview>
        </Fragment>
      )}
      {!!conversation &&
        threadOpened &&
        conversation.map((message, idx) => (
          <Replies key={`email-thread-#${idx + 1}`}>
            <EmailHeader>
              <div className="leo-flex-center">
                <AvatarIcon name={message.from.Name} imgUrl={null} size={30} />
                <EmailHeaderDetails>
                  <From>{message.from.Address}</From>
                  <To>
                    To: {message.to[0].Name} ({message.to[0].Address})
                  </To>
                </EmailHeaderDetails>
              </div>
              <EmailDate>{convertDate(message.sent_at)}</EmailDate>
            </EmailHeader>
            <Preview className="preview">
              {renderHTML(message.email_body.Content)}
            </Preview>
          </Replies>
        ))}
      <Footer>
        {threadOpened ? (
          <ViewThreads onClick={collapseThread}>Collapse</ViewThreads>
        ) : (
          <ViewThreads onClick={displayConversation}>View Thread</ViewThreads>
        )}
      </Footer>
    </EmailItem>
  );
};

const EmailItem = styled.div`
  /* background: red; */
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;

const EmailSubject = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 15px;

  h2 {
    font-size: 15px;
    font-weight: 500;
  }
`;

const EmailHeader = styled.div`
  align-items: center;
  border-top: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  padding: 15px;
`;

const EmailHeaderDetails = styled.div`
  margin-left: 15px;
`;

const From = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const To = styled.span`
  font-size: 12px;
`;

const Preview = styled.div`
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  margin-bottom: 10px;
  /* margin-top: -10px; */
  padding: 0 15px;
`;

const Footer = styled.div`
  padding: 0 15px 10px;
`;

const ViewThreads = styled.button`
  font-size: 12px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Replies = styled.div`
  p {
    margin-bottom: 15px !important;
  }
`;

const EmailDate = styled.div`
  color: #74767b;
  font-size: 12px;
`;
