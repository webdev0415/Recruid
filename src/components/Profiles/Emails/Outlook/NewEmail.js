import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import styled from "styled-components";
import notify from "notifications";
import {
  sendEmail,
  replyToEmail,
  listMessages,
  saveEmailToDb,
} from "helpersV2/outlook";
import Spinner from "sharedComponents/Spinner";
import TextEditor from "sharedComponents/TextEditor";

const Modal = {
  Wrapper: styled.div`
    bottom: 0;
    background: #fff;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px 4px 0 0;
    display: flex;
    flex-direction: column;
    // height: 400px;
    position: fixed;
    right: 120px;
    width: 600px;
    z-index: 10;
  `,

  Header: styled.div`
    align-items: center;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 11px 20px;

    h3 {
      color: #74767b;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1.67px;
      text-transform: uppercase;
    }

    button {
      color: #74767b;
      font-size: 12px;

      &:hover {
        text-decoration: underline;
      }
    }
  `,

  HeaderField: styled.div`
    border-bottom: 1px solid #eee;
    font-size: 15px;
    margin: 10px 0px 0;
    padding: 0px 20px;

    &.row-border {
      border-bottom: 1px solid #eee;
    }

    label {
      color: #74767b;
      margin-right: 3px;
    }

    input {
      border: none;
      margin-bottom: 10px;
      min-width: 70%;
    }
  `,

  Footer: styled.div`
    align-items: center;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px;
  `,
};

const { Wrapper, Header, HeaderField, Footer } = Modal;

export default function NewEmail({
  getMsalToken,
  closeModal,
  previewData,
  setPreviewData,
  setTriggerEmailsUpdate,
  emailReceiver,
}) {
  const store = useContext(GlobalContext);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailLoader, setEmailLoader] = useState(false);
  const [sendRequestPending, setRequestPending] = useState(false);

  useEffect(
    () => () => setPreviewData(null),
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    if (previewData?.conversationSubject)
      setEmailSubject(`Re: ${previewData.conversationSubject}`);
  }, [previewData]);

  const validateAndPost = () => {
    if (emailLoader) return false;
    if (!previewData) {
      if (!!emailMessage.length && !!emailSubject.length) {
        return submitEmailSend(emailSubject, emailMessage);
      }
      return notify("danger", "Email and subject fields are required.");
    } else {
      if (emailMessage) {
        return submitEmailReply(emailMessage);
      }
      return notify("danger", "Email body can't be blank.");
    }
  };

  const getNewEmails = async (accessToken, emailBody) => {
    const newEmails = await listMessages(
      accessToken,
      "sentitems",
      emailBody.ToRecipients[0].EmailAddress.Address,
      null
    );
    if (!newEmails || !newEmails.value || !newEmails.value[0]) {
      return notify("danger", "Unable to get emails");
    }

    const {
      ConversationId,
      Id,
      From,
      ToRecipients,
      Subject,
      BodyPreview,
      Body,
      SentDateTime,
    } = newEmails.value[0];

    const dbRecord = {
      conversation_id: ConversationId,
      message_id: Id,
      from: From.EmailAddress.Address,
      to: ToRecipients[0].EmailAddress.Address,
      subject: Subject,
      preview: BodyPreview,
      email_body: Body.Content,
      sent_at: SentDateTime,
      professional_id: store.user.id,
      company_id: store.company.id,
    };

    return await saveEmailToDb(null, dbRecord);
  };

  const submitEmailSend = async (emailSubject, emailMessage) => {
    setRequestPending(true);
    const emailBody = {
      Subject: emailSubject,
      Body: {
        ContentType: "html",
        Content: emailMessage,
      },
      ToRecipients: [{ EmailAddress: { Address: emailReceiver } }],
    };

    const accessToken = await getMsalToken();

    sendEmail(accessToken, emailBody).then((data) => {
      if (data.status === 202) {
        setTimeout(async () => {
          notify("info", "Email has been successfully sent.");
          setEmailLoader(false);
          if (!previewData) await getNewEmails(accessToken, emailBody);
          setTriggerEmailsUpdate(Math.random());
          setRequestPending(false);
          closeModal();
        }, 1750);
      } else {
        notify("danger", data || data?.error || data?.error?.message);
        setRequestPending(false);
      }
    });
  };

  const submitEmailReply = async (emailMessage) => {
    setRequestPending(true);

    const accessToken = await getMsalToken();

    replyToEmail(accessToken, previewData.messageId, emailMessage).then(
      (data) => {
        if (data) {
          setTimeout(() => {
            notify("info", "Email has been successfully sent.");
            setEmailLoader(false);
            setRequestPending(false);
            closeModal();
          }, 2000);
        }
      }
    );
  };

  const handleSubjectChange = (e) => setEmailSubject(e.target.value);

  return (
    <Wrapper>
      <Header>
        <h3>Email</h3>
        <button onClick={closeModal}>Cancel</button>
      </Header>
      <HeaderField>
        <label>To: </label>
        <input type="text" value={emailReceiver} readOnly={true} />
      </HeaderField>
      <HeaderField>
        <label>Subject: </label>
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => handleSubjectChange(e)}
          readOnly={!!previewData}
        />
      </HeaderField>
      <TextContainer>
        <TextEditor
          returnState={(body) => setEmailMessage(body)}
          placeholder="Enter text..."
          // initialBody={emailMessage}
          maxHeight="profile-email"
        />
      </TextContainer>
      <Footer>
        {emailLoader && (
          <Spinner style={{ marginRight: "20px", padding: "20px" }} />
        )}
        <button
          className="button button--default button--blue-dark"
          onClick={() => validateAndPost()}
          disabled={sendRequestPending}
        >
          Send
        </button>
      </Footer>
    </Wrapper>
  );
}

const TextContainer = styled.div`
  max-height: calc(100vh - 200px);
  overflow: auto;
  position: relative;
`;
