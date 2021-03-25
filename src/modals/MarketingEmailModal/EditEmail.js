import React from "react";
import TemplateEditor from "sharedComponents/TemplateEditor";
import EditButtons from "components/Profiles/components/EditButtons";
import FilesDisplay from "sharedComponents/TemplateEditor/FilesDisplay";

import styled from "styled-components";

const EditEmail = ({
  email,
  setEmail,
  editSection,
  setEditSection,
  triggerEditSection,
  cancelEdit,
  hide,
  moveToConfirmParticipants,
  setEmailVariables,
  activeTemplate,
  setActiveTemplate,
  source,
  filesToAdd,
  setFilesToAdd,
  participants,
  createEmail,
}) => {
  return (
    <>
      <EmailContainer>
        <FlexRowDiv>
          <ContentInput>
            <label>Subject:</label>
            <input
              value={email.subject}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              placeholder="Email subject"
              maxLength={500}
            />
          </ContentInput>
        </FlexRowDiv>
        <FlexRowDiv>
          <ContentInput>
            {editSection !== "initial_from" && <label>From: </label>}
            <div className="flex-div">
              {editSection !== "initial_from" ? (
                <>
                  <div style={{ marginLeft: "5px" }}>
                    {email?.from_name} {`<${email?.from_email}>`}
                  </div>
                </>
              ) : (
                <>
                  <label>From Name: </label>
                  <Input
                    value={email.from_name}
                    onChange={(e) =>
                      setEmail({ ...email, from_name: e.target.value })
                    }
                  />
                  <label>From Email: </label>
                  <Input
                    value={email.from_email}
                    onChange={(e) =>
                      setEmail({ ...email, from_email: e.target.value })
                    }
                  />
                </>
              )}
              <EditButtons
                editing={editSection === "initial_from"}
                onClickEdit={() => triggerEditSection("initial_from")}
                onClickCancel={cancelEdit}
                onClickSave={() => setEditSection(undefined)}
              />
            </div>
          </ContentInput>
        </FlexRowDiv>
        <div>
          <TemplateEditor
            initialBody={email.body}
            returnState={(body) => setEmail({ ...email, body })}
            returnVariables={(varArray) => setEmailVariables(varArray)}
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
            type="email"
            source={source}
            addFilesToTemplate={(files) =>
              setFilesToAdd([...filesToAdd, ...files])
            }
            participants={participants}
          />
        </div>
      </EmailContainer>
      <div style={{ margin: "0px 30px 30px 20px" }}>
        {filesToAdd && filesToAdd.length > 0 && (
          <FilesDisplay filesToAdd={filesToAdd} setFilesToAdd={setFilesToAdd} />
        )}
      </div>
      <Footer>
        <div>
          <button
            type="button"
            className="button button--default button--grey-light"
            onClick={hide}
          >
            Cancel
          </button>
          {email.subject && (
            <button
              type="button"
              className="button button--default button--primary"
              onClick={() => createEmail(true, true)}
              style={{ marginRight: "10px" }}
            >
              Save Progress
            </button>
          )}
          <button
            type="button"
            className="button button--default button--blue-dark"
            onClick={() => moveToConfirmParticipants()}
          >
            Next
          </button>
        </div>
      </Footer>
    </>
  );
};

export default EditEmail;

const EmailContainer = styled.div`
  border-radius: 4px;
  border: solid 1px #eee;
  margin: 0px 30px 30px 20px;
`;

const FlexRowDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: solid 1px #eee;
`;

const ContentInput = styled.div`
  display: flex;
  font-size: 14px;
  align-items: end;
  width: 100%;

  .flex-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  label {
    font-weight: 500;
    font-size: 14px;
  }

  input {
    font-size: 14px;
    margin-left: 10px;
    border: none;
    background: none;
    width: 100%;
  }
`;

const Input = styled.input`
  border: #c8c8c8 solid 1px !important;
  width: 100%;
  max-width: 250px !important;
  padding: 5px;
  border-radius: 4px;
`;

const Footer = styled.div`
  padding-top: 30px;
  border-top: solid #eee 1px;
  div {
    button:first-of-type {
      margin-right: 10px;
    }
  }
`;
