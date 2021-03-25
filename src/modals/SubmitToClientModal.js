import React, { useState, useEffect } from "react";
import UniversalModal, {
  ModalHeaderV2,
  ModalBody,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import { fetchDocuments } from "helpersV2/CandidateProfile";
import notify from "notifications";
import generalStyles from "assets/stylesheets/scss/collated/profileTabs.module.scss";
import InfoCard from "components/Profiles/components/InfoCard";
import { fetchCompanyContacts } from "helpers/crm/clientCompanies";
import TextEditor from "sharedComponents/TextEditor";
import helpers from "helpersV2/CandidateProfile";
import { Star } from "sharedComponents/CandidateRating";
import { AWS_CDN_URL } from "constants/api";

const SubmitToClientModal = ({
  show,
  hide,
  name,
  userAvatar,
  subTitle,
  candidate,
  submitCandidateToClient,
  company,
  session,
  job,
}) => {
  const [stage, setStage] = useState(0);
  //DOCUMENTS
  const [documents, setDocuments] = useState(undefined);
  const [contacts, setContacts] = useState(undefined);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [emailBody, setEmailBody] = useState("");
  const [initialBody, setInitialBody] = useState(undefined);
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    if (session && company && candidate) {
      helpers
        .fetchTalentNetworkProfile(
          candidate.professional_id,
          company.id,
          session
        )
        .then((user) => {
          if (
            user !== "err" &&
            user.message !== "TN Profile no longer exists"
          ) {
            setProfile(user.tn_profile);
          }
        });
    }
  }, [candidate, session, company]);

  useEffect(() => {
    if (candidate && documents === undefined) {
      fetchDocuments(candidate.ptn_id, session).then((docs) => {
        if (docs !== "err" && !docs.message && docs.length !== 0) {
          setDocuments(docs);
        } else {
          if (docs === "err" || docs.message) {
            notify("danger", "Unable to fetch documents");
          }
          setDocuments(false);
        }
      });
    }
  }, [candidate]);
  useEffect(() => {
    if (job && job.client_id && company && session) {
      // and client id
      fetchCompanyContacts(session, job.client_id, company.id).then((res) => {
        if (!res.err && res.length > 0) {
          setContacts(res);
        } else {
          setContacts(false);
          notify("danger", "Unable to fetch contacts");
        }
      });
    } else {
      setContacts(false);
    }
  }, [job, company, session]);

  const handleChange = (index) => {
    let docsCopy = [...documents];
    let docCopy = { ...docsCopy[index] };
    docCopy.selected = docCopy.selected ? false : true;
    docsCopy[index] = docCopy;
    setDocuments(docsCopy);
  };

  const gatherDocIds = () => {
    if (!documents) return;
    if (documents.length === 0) return;
    let docIds = [];
    if (documents) {
      documents.map((doc) => (doc.selected ? docIds.push(doc.id) : null));
    }
    if (docIds.length === 0) return;
    return {
      documents_ids: docIds?.length > 0 ? docIds : undefined,
    };
  };
  const prepareStage2 = () => {
    setInitialBody(
      emailBodygenerator(
        selectedContact?.name,
        job.title,
        job.company.name,
        name,
        profile?.tn_description,
        profile?.salary_expectation,
        documents && documents.filter((doc) => doc.selected).length > 0
      )
    );
    setStage(2);
  };

  const createEmail = () => {
    let docs = [];
    if (documents && documents.length > 0) {
      documents.map((doc) => (doc.selected ? docs.push(doc) : null));
    }
    let docLinks = documentLinkGenerator(docs);
    submitCandidateToClient(
      gatherDocIds(),
      `${emailBody}${docLinks}`,
      selectedContact?.id
    );
  };
  return (
    <UniversalModal
      show={show}
      hide={hide}
      id={"assign-contact-modal"}
      width={stage !== 2 ? 600 : 960}
    >
      <ModalHeaderV2 name={name} userAvatar={userAvatar} subTitle={subTitle} />
      <ModalBody>
        <BodyWrapper>
          {stage === 0 && (
            <>
              <p>
                You are setting the candidate to submitted, would you like to
                send the candidates profile to the client?
              </p>
              <div className="d-flex">
                <button
                  style={{ width: "auto", marginRight: "10px" }}
                  type="button"
                  className="button button--default button--blue-dark button--full"
                  onClick={() =>
                    submitCandidateToClient({}, "", undefined, true)
                  }
                >
                  Just Change Status
                </button>
                {documents !== undefined && contacts !== undefined && (
                  <button
                    style={{ width: "auto" }}
                    type="button"
                    className="button button--default button--blue-dark button--full"
                    onClick={() => {
                      if (documents === false) {
                        if (contacts) {
                          setStage(1.5);
                        } else if (contacts === false) {
                          prepareStage2();
                        }
                      } else if (documents) {
                        setStage(1);
                      }
                    }}
                  >
                    Send Profile to Client
                  </button>
                )}
              </div>
            </>
          )}
          {stage === 1 && (
            <>
              <p>
                Please confirm you want to submit the candidate to the client.
              </p>
              {documents?.length > 0 && (
                <>
                  <Title>Documents</Title>
                  {documents.map((doc, index) => (
                    <TagWrapper key={`document-${index}`}>
                      <input
                        type="checkbox"
                        onClick={() => handleChange(index)}
                      />
                      <DocumentItem doc={doc} />
                    </TagWrapper>
                  ))}
                </>
              )}
            </>
          )}
          {stage === 1.5 && (
            <>
              <p>Select a contact to send the candidates profile to...</p>
              <ResultArea>
                {contacts &&
                  contacts.length > 0 &&
                  contacts.map((contact, index) => (
                    <InfoCard
                      key={`contact-card-${index}`}
                      light
                      header={contact.name}
                      subText={contact.title}
                      email={contact.email}
                      phone={contact.phone}
                      avatar={contact.avatar_url}
                      onContactSelect={() => setSelectedContact(contact)}
                      id={contact.id}
                      parentActive={
                        selectedContact?.id === contact.id
                          ? true
                          : selectedContact
                          ? false
                          : undefined
                      }
                    />
                  ))}
              </ResultArea>
            </>
          )}
          {stage === 2 && initialBody && (
            <>
              <p>Here you can edit the email that your client will receive.</p>
              <TextEditor
                returnState={(body) => setEmailBody(body)}
                placeholder="Start typing..."
                initialBody={initialBody}
              />
            </>
          )}
        </BodyWrapper>
      </ModalBody>
      <ModalFooter hide={hide}>
        {stage !== 0 && (
          <button
            style={{ width: "auto" }}
            type="button"
            className="button button--default button--blue-dark button--full"
            onClick={() =>
              stage === 1 && !contacts
                ? prepareStage2()
                : stage === 1 && contacts && contacts.length > 0
                ? setStage(1.5)
                : stage === 1.5
                ? prepareStage2()
                : createEmail()
            }
          >
            {stage !== 2 ? "Next" : "Confirm"}
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default SubmitToClientModal;

const emailBodygenerator = (
  addressee,
  jobTitle,
  companyName,
  candidateName,
  candidateSumary,
  salaryExpectations,
  attachements
) => {
  return `<p>Hi <strong>${addressee || companyName}</strong>,</p><br>
  <p>${
    attachements ? "Please find attached" : "I am submitting"
  } <strong>${candidateName}</strong> for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> and below a summary:</p><br>
  <div>Candidate Name: ${candidateName}</div>
  ${
    candidateSumary
      ? `<div>Candidate summary: ${candidateSumary.replace(
          /[\r\n]+/g,
          "<br>"
        )}</div>`
      : ""
  }
  ${
    salaryExpectations
      ? `<div>Salary Expectations: ${salaryExpectations}</div>`
      : ""
  }<br>`;
};

const documentLinkGenerator = (docs) => {
  if (!docs || docs.length === 0) return "";
  let attachmentsFooter = "<br><div>";
  if (docs && docs.length > 0) {
    docs.map((doc) => {
      attachmentsFooter += `<a href=${
        doc.url || doc.candidate_cv_url
      } target="_blank" rel="noopener noreferrer" style="${linkStyle}">${
        doc.title
      }</a>`;
      return null;
    });
  }
  attachmentsFooter += "</div><br>";
  return attachmentsFooter;
};

const linkStyle = `background: #eeeeee; border-radius: 3px; color: #1e1e1e; cursor: pointer; font-size: 12px; font-weight: 500; padding: 4px 6px;text-decoration: none;
margin-right: 10px;
display: inline-block;
margin-bottom: 10px;`;

const DocumentItem = ({ doc }) => (
  <DocumentContainer>
    <div className={generalStyles.documentDetails}>
      <img src={`${AWS_CDN_URL}/icons/DocumentIcon.svg`} alt="" />
      <div
        className={generalStyles.noteHeader}
        style={{ margin: "0", maxWidth: "450px" }}
      >
        <span>{doc.title}</span>
      </div>
      <div style={{ marginLeft: "10px" }}>
        <Star active={doc.is_latest_cv} style={{ display: "initial" }} />
      </div>
    </div>
  </DocumentContainer>
);

const DocumentContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 15px;
  position: relative;
  width: 100%;
  z-index: 1;

  svg,
  img {
    margin-right: 20px;
  }
`;

const Title = styled.h2`
font-size: 15px;
    font-weight: 500;
    margin-bottom: 10px;
}
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    margin-top: 0;
    margin-right: 20px;
  }
`;

const BodyWrapper = styled.div`
  padding: 30px;
  overflow-y: auto;
  max-height: 500px;
`;
const ResultArea = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  height: 100%;
  max-height: 420px;
  overflow-y: auto;
  padding: 10px;
  text-align: left;
`;
