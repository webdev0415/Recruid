import React, { useEffect, useState, Fragment } from "react";
import { Base64 } from "js-base64";
import { getConversation } from "./emailMethods";
import AvatarIcon from "sharedComponents/AvatarIcon";
import styled from "styled-components";

const EmailItem = styled.div`
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
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
  margin: 0;
  margin-bottom: 10px;
  margin-top: 10px;
  /* margin-top: -10px; */
  padding: 0 15px;
`;
const PreviewPTag = styled.p`
  font-size: 14px;
  line-height: 1.4;
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

export const EmailPreview = ({
  email,
  session,
  openModal,
  shouldThreadUpdate,
  gmailUser,
  role,
  receiver_id,
}) => {
  const [conversation, setConversation] = useState(null);
  const [threadOpened, setThreadOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentFits, setContentFits] = useState(false);
  const [threadParticipant, setThreadParticipant] = useState(false);

  useEffect(() => {
    if (!!gmailUser && gmailUser.id === email.created_by) {
      setThreadParticipant(true);
    }
    if (email.preview === Base64.decode(email.email_body)) {
      setContentFits(true);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (shouldThreadUpdate !== null && !!conversation) loadThread();
    // eslint-disable-next-line
  }, [shouldThreadUpdate]);

  const loadThread = async () => {
    const nextConversation = await getConversation(
      email.thread_id,
      session,
      role.team_member.team_member_id,
      receiver_id
    );
    setConversation(() => nextConversation);
    setThreadOpened(true);
    return nextConversation;
  };

  const collapseThread = () => {
    setThreadOpened(false);
    setConversation(null);
  };

  const toggleReplyModal = () => {
    if (!!conversation && conversation.length) {
      let args = email.has_replies
        ? {
            in_reply_to: conversation[0].in_reply_to,
            references: conversation[0].references,
          }
        : { identifier: email.identifier };
      return openModal({
        subject: `Re: ${email.subject}`,
        thread_id: email.thread_id,
        ...args,
      });
    } else if (email.has_replies) {
      return loadThread().then((data) => {
        openModal({
          subject: `Re: ${email.subject}`,
          thread_id: email.thread_id,
          in_reply_to: data[0].in_reply_to,
          references: data[0].references,
        });
      });
    }
    return openModal({
      subject: `Re: ${email.subject}`,
      thread_id: email.thread_id,
      identifier: email.identifier,
    });
  };

  const decodeMessage = (message) => Base64.decode(message);

  const convertDate = (date) => {
    let emailDate = new Date(date * 1000);
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
        {!!threadParticipant && (
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
        )}
      </EmailSubject>
      {!threadOpened && (
        <Fragment>
          <EmailHeader>
            <div className="leo-flex-center">
              <AvatarIcon
                name={email.sender}
                imgUrl={email.sender_avatar}
                size={30}
              />
              <EmailHeaderDetails>
                <From>{email.sender}</From>
                <To>
                  To: {email.receiver} ({email.receiver_email})
                </To>
              </EmailHeaderDetails>
            </div>
            <EmailDate>{convertDate(email.created_at)}</EmailDate>
          </EmailHeader>
          <Preview>
            {!showContent || contentFits ? (
              <PreviewPTag
                dangerouslySetInnerHTML={{ __html: email.preview }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: decodeMessage(email.email_body),
                }}
              />
            )}
          </Preview>
        </Fragment>
      )}
      {!!conversation &&
        threadOpened &&
        conversation.map((message, idx) => (
          <Replies key={`email-thread-#${idx + 1}`}>
            <EmailHeader>
              <div className="leo-flex-center">
                <AvatarIcon
                  name={message.sender}
                  imgUrl={message.sender_avatar}
                  size={30}
                />
                <EmailHeaderDetails>
                  <From>{message.sender}</From>
                  <To>
                    To: {message.receiver} ({message.receiver_email})
                  </To>
                </EmailHeaderDetails>
              </div>
              <EmailDate>{convertDate(message.created_at)}</EmailDate>
            </EmailHeader>
            <Preview>
              {!showContent || contentFits ? (
                <PreviewPTag>{message.preview}</PreviewPTag>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: decodeMessage(message.email_body),
                  }}
                />
              )}
            </Preview>
          </Replies>
        ))}
      <Footer>
        {email.has_replies ? (
          threadOpened ? (
            <ViewThreads onClick={collapseThread}>Collapse</ViewThreads>
          ) : (
            <ViewThreads onClick={loadThread}>View thread</ViewThreads>
          )
        ) : (
          !contentFits && (
            <ViewThreads onClick={() => setShowContent((state) => !state)}>
              {showContent ? "Hide content" : "Show content"}
            </ViewThreads>
          )
        )}
      </Footer>
    </EmailItem>
  );
};
