import React, { useState, useEffect } from "react";
import styled from "styled-components";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import useForceUpdate from "hooks/useForceUpdate";
import AvatarIcon from "sharedComponents/AvatarIcon";
import notify from "notifications";
import SearchInput from "sharedComponents/SearchInput";
import AppButton from "styles/AppButton";
import { fetchDocuments } from "helpersV2/CandidateProfile";
import TextEditor from "sharedComponents/TextEditor";
import { fetchToggleHiringManagerDocuments } from "helpersV2/documents";
import ToogleV3 from "sharedComponents/ToggleV3";
import { AWS_CDN_URL } from "constants/api";

const AssignContactModal = ({
  hide,
  availableHiringManagers,
  candidate,
  // name,
  // userAvatar,
  // subTitle,
  // confirmChangeCandidateStatus,
  addRemoveReviewers,
  // newStatus,
  // teamMembers,
  // candidate,
  // modalName,
  selectedJob,
  store,
}) => {
  // const [chooseContact, setChooseContact] = useState(false);
  // const [contactIndex, setContactIndex] = useState("");
  // const [selectedHiringManagers, setSelectedHiringManagers] = useState([]);
  const [view, setView] = useState("managers-select");
  const [filteredHM, setFilteredHM] = useState(undefined);
  const [searchValue, setSearchValue] = useState("");
  const [hiringManagerIds, setHiringManagerIds] = useState([]);
  const [documents, setDocuments] = useState(undefined);
  const [managersToAdd, setManagersToAdd] = useState([]);
  const [managersToRemove, setManagersToRemove] = useState([]);
  const [originalIds, setOriginalIds] = useState([]);
  const [togglingDocuments, setTogglingDocuments] = useState([]);
  const [emailBody, setEmailBody] = useState("");
  const [initialBody, setInitialBody] = useState(undefined);
  const [useDefaultEmail, setUseDefaultEmail] = useState(true);
  const { shouldEditorUpdate, triggerEditorUpdate } = useForceUpdate(
    "shouldEditorUpdate",
    "triggerEditorUpdate"
  );

  useEffect(() => {
    if (availableHiringManagers) {
      if (searchValue === "") {
        setFilteredHM([...availableHiringManagers]);
      } else {
        setFilteredHM([
          ...availableHiringManagers.filter((member) =>
            member.name.toLowerCase().includes(searchValue.toLowerCase())
          ),
        ]);
      }
    }
  }, [availableHiringManagers, searchValue]);

  useEffect(() => {
    if (candidate) {
      let idsArr = candidate.hiring_managers.map(
        (member) => member.team_member_id
      );
      setHiringManagerIds([...idsArr]);
      setOriginalIds([...idsArr]);
    }
  }, [candidate]);

  useEffect(() => {
    if (candidate && documents === undefined) {
      fetchDocuments(candidate.ptn_id, store.session).then((docs) => {
        if (docs !== "err" && !docs.message && docs.length !== 0) {
          setDocuments(
            docs.map((doc) => {
              return { ...doc, selected: doc.show_for_hm };
            })
          );
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
    if (hiringManagerIds && originalIds) {
      let toAdd = [];
      let toRemove = [];
      hiringManagerIds.map((memberId) => {
        if (originalIds.indexOf(memberId) === -1) {
          toAdd.push(memberId);
        }
        return null;
      });
      originalIds.map((memberId) => {
        if (hiringManagerIds.indexOf(memberId) === -1) {
          toRemove.push(memberId);
        }
        return null;
      });
      setManagersToAdd(toAdd);
      setManagersToRemove(toRemove);
    }
  }, [hiringManagerIds, originalIds]);

  useEffect(() => {
    if (documents) {
      let toggled = [];
      documents.map((doc) => {
        if (doc.selected && !doc.show_for_hm) {
          toggled.push(doc.id);
        } else if (doc.show_for_hm && !doc.selected) {
          toggled.push(doc.id);
        }
        return null;
      });
      setTogglingDocuments(toggled);
    }
  }, [documents]);

  useEffect(() => {
    if (candidate && selectedJob) {
      setInitialBody(emailBodygenerator());
    }
  }, [candidate, selectedJob]);

  const removeFromList = (id) => {
    let selectedManagersCopy = [...hiringManagerIds];
    let index = selectedManagersCopy.indexOf(id);
    selectedManagersCopy.splice(index, 1);
    setHiringManagerIds(selectedManagersCopy);
  };

  const addToList = (id) => {
    let selectedManagersCopy = [...hiringManagerIds];
    selectedManagersCopy.push(id);
    setHiringManagerIds(selectedManagersCopy);
  };

  const updateHiringManagers = () => {
    if (managersToAdd.length === 0 && managersToRemove.length === 0) {
      return notify("danger", "No members to add or remove");
    }
    if (togglingDocuments.length > 0) {
      toggleHiringManagerDocuments(togglingDocuments);
    }
    const emailBodyProp = useDefaultEmail ? undefined : emailBody;
    addRemoveReviewers(managersToAdd, managersToRemove, emailBodyProp);
  };

  const continueFunction = () => {
    if (managersToAdd.length > 0) {
      if (view === "managers-select") {
        if (documents && documents.length > 0) {
          setView("select-documents");
        } else {
          setView("write-email");
        }
      } else if (view === "select-documents") {
        setView("write-email");
      } else {
        updateHiringManagers();
      }
    } else if (managersToRemove.length > 0) {
      updateHiringManagers();
    } else {
      return notify("danger", "No members to add or remove");
    }
  };

  const selectDocument = (index) => {
    let docsCopy = [...documents];
    docsCopy[index] = {
      ...docsCopy[index],
      selected: docsCopy[index].selected ? false : true,
    };
    setDocuments(docsCopy);
  };

  const toggleHiringManagerDocuments = () => {
    fetchToggleHiringManagerDocuments(store.session, togglingDocuments).then(
      (res) => {
        if (!res.err) {
          notify("info", "Document permissions updated");
        } else {
          notify(
            "danger",
            "Unable to update document hiring manager permissions"
          );
        }
      }
    );
  };

  const handleEmailModeToggle = async () => {
    const newToggleState = !useDefaultEmail;

    if (!newToggleState) setInitialBody("");
    else setInitialBody(emailBodygenerator());

    await Promise.resolve(setTimeout(triggerEditorUpdate, 0));

    return setUseDefaultEmail(newToggleState);
  };

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="add-candidates-to-job-modal"
      width={view === "write-email" ? 780 : 330}
    >
      <MinimalHeader title="Manage hiring managers" hide={hide} />
      <STModalBody className="no-footer">
        {view === "managers-select" && (
          <>
            <SearchContainer>
              <SearchInput
                value={searchValue}
                onChange={(val) => setSearchValue(val)}
                placeholder="Search hiring managers..."
                className="search-input"
              />
            </SearchContainer>
            <MembersContainer>
              <MemberUL>
                {filteredHM &&
                  filteredHM.length > 0 &&
                  filteredHM.map((member, ix) => (
                    <li
                      key={`hiring-manager-${ix}`}
                      onClick={() => {
                        if (
                          hiringManagerIds.indexOf(member.team_member_id) !== -1
                        ) {
                          removeFromList(member.team_member_id);
                        } else {
                          addToList(member.team_member_id);
                        }
                      }}
                    >
                      <AvatarIcon
                        name={member.name}
                        imgUrl={member.avatar}
                        size={30}
                      />
                      <div className="name-container">
                        <span className="member-name">{member.name}</span>
                      </div>
                      {hiringManagerIds.indexOf(member.team_member_id) !==
                        -1 && (
                        <CheckMark>
                          <img
                            src={`${AWS_CDN_URL}/icons/CheckIcon.svg`}
                            alt=""
                          />
                        </CheckMark>
                      )}
                    </li>
                  ))}
                {filteredHM?.length === 0 && (
                  <li>
                    There are no hiring managers matching your search added to
                    this job
                  </li>
                )}
              </MemberUL>
            </MembersContainer>
          </>
        )}
        {view === "select-documents" && (
          <>
            <TextExplanation>
              {`The documents you select will be displayed for any hiring manager
              with access to this candidate's profile.`}
            </TextExplanation>
            <MembersContainer>
              <MemberUL>
                {documents &&
                  documents.length > 0 &&
                  documents.map((doc, ix) => (
                    <li
                      onClick={() => selectDocument(ix)}
                      key={`document-row-${ix}`}
                    >
                      <FileContainer>
                        <img
                          src={`${AWS_CDN_URL}/icons/FileIcon.svg`}
                          alt="FileIcon"
                        />
                      </FileContainer>
                      <div className="name-container">
                        <span className="member-name">{doc.title}</span>
                      </div>
                      {doc.selected && (
                        <CheckMark>
                          <img
                            src={`${AWS_CDN_URL}/icons/CheckIcon.svg`}
                            alt=""
                          />
                        </CheckMark>
                      )}
                    </li>
                  ))}
              </MemberUL>
            </MembersContainer>
          </>
        )}
        {view === "write-email" && (
          <>
            <TextExplanation>
              Here you can edit the email that your hiring manager/s will
              receive, or use a default one provided by us.
            </TextExplanation>
            <TextExplanation
              className="leo-flex"
              style={{
                minWidth: "400px",
                padding: "0 0 10px 0",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                Do you want to use a default email to notify a hiring manager?
              </span>
              <ToogleV3
                name="use-default-hm-email"
                toggle={handleEmailModeToggle}
                checked={useDefaultEmail}
              />
            </TextExplanation>
            <EditorContainer>
              <TextEditor
                returnState={(body) => setEmailBody(body)}
                placeholder="Start typing..."
                initialBody={initialBody}
                updateFromParent={shouldEditorUpdate}
                readOnly={useDefaultEmail}
              />
            </EditorContainer>
          </>
        )}
        <Footer>
          <AppButton
            onClick={continueFunction}
            size="small"
            disabled={documents === undefined}
            theme={documents === undefined ? "light-grey" : "dark-blue"}
          >
            {managersToAdd.length > 0
              ? view !== "write-email"
                ? "Continue"
                : "Finish"
              : "Finish"}
          </AppButton>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

export default AssignContactModal;

const emailBodygenerator = () => {
  return `<p>Hi <strong>[HM First Name]</strong>,</p><br>
  <p>[Your Name]  has requested you review the following candidate for the job of <strong>[Job Title]</strong></p></br>
  <div>Candidate Name: <strong>[Candidate Name]</strong></div></br>
  <div>Candidate summary: <strong>[Candidate Summary]</strong></div></br></br>
  <p>Many thanks</p>
  <p>Team Leo</p>`;
};

const STModalBody = styled(ModalBody)``;

const MembersContainer = styled.div`
  max-height: 280px;
  overflow: scroll;
  padding-bottom: 20px;
  min-height: 180px;
`;

const MemberUL = styled.ul`
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding: 12px 20px;

    :hover {
      background: rgba(196, 196, 196, 0.25);
    }

    .name-container {
      margin-left: 10px;

      .member-title {
        font-size: 12px;
        line-height: 14px;
        color: #74767b;
        display: flex;
        align-items: center;
        margin-top: 3px;

        svg,
        img {
          margin-right: 5px;
        }
      }
      .member-name {
        font-size: 14px;
        line-height: 16px;
      }
    }
  }
`;

const CheckMark = styled.div`
  position: absolute;
  right: 30px;
  background: #35c3ae;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const SearchContainer = styled.div`
  padding: 20px;
`;

const Footer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  border-top: solid #eee 1px;
`;

const FileContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: solid #c4c4c4 1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextExplanation = styled.div`
  max-width: 320px;
  margin: auto;
  font-size: 11px;
  text-align: center;
  padding-top: 15px;
  color: #575757;
  padding-bottom: 15px;
`;

const EditorContainer = styled.div`
  max-width: 700px;
  margin: auto;
  margin-bottom: 20px;
`;
