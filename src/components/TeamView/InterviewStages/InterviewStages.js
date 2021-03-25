import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import InterviewStagesBoard from "sharedComponents/InterviewStagesBoard";
import { updateInterviewStages } from "contexts/globalContext/GlobalMethods";
import { fetchChangeCandidateStatus } from "helpersV2/applicants";
import {
  Title,
  SubTitle,
  ButtonsWrapper,
  ContentWrapper,
} from "components/TeamView/Customisation/sharedComponents";
import { ExpandButton } from "components/TeamView/Customisation/sharedComponents";
import AppButton from "styles/AppButton";

const InterviewStages = () => {
  const store = useContext(GlobalContext);
  const [interviewStages, setInterviewStages] = useState(undefined);
  const [displayWarning, setDisplayWarning] = useState(false);
  const [unsuccesfullApplicants, setUnsuccesfullApplicants] = useState(
    undefined
  );
  const [expand, setExpand] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (store.interviewStages) {
      setInterviewStages(
        store.interviewStages.map((stage) => {
          return { ...stage };
        })
      );
    }
  }, [store.interviewStages]);

  const updateInterviewStagesMethod = (confirmDelete) => {
    if (!confirmDelete) {
      let stagesToDelete = interviewStages.filter((stage) => stage.destroy);
      if (stagesToDelete.length > 0) {
        setDisplayWarning(true);
        return;
      }
    }
    let copyStages = [...interviewStages];
    let missingName;
    copyStages.map((stage, index) => {
      if (stage.name === "") {
        if (stage.id) {
          missingName = true;
        } else {
          if (index !== copyStages.length - 1) {
            missingName = true;
          }
        }
      }
      return null;
    });
    if (missingName) {
      notify("danger", "All stages must have a name");
      return;
    } else {
      if (copyStages[copyStages.length - 1].name === "") {
        copyStages = copyStages.slice(0, copyStages.length - 1);
      }
      updateInterviewStages(store, copyStages).then((res) => {
        if (!res.err) {
          if (res.body.unsuccessful_applicants?.length > 0) {
            setUnsuccesfullApplicants(res.body.unsuccessful_applicants);
          } else {
            notify("info", "Interview stages succesfully changed");
            setInterviewStages(res.body.interview_stages);
            setDisplayWarning(false);
          }
        } else {
          notify("danger", "There was an error updating the interview stages");
          // setInterviewStages(store.interviewStages);
        }
      });
    }
  };

  return (
    <>
      <div
        className="row"
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        <div className="col-md-12">
          <ContentWrapper>
            <Header>
              <div>
                <Title>Interview Stages</Title>
                <SubTitle>
                  Change your Interview Stages to better match your internal
                  process
                </SubTitle>
              </div>
              <ExpandButton expand={expand} setExpand={setExpand} />
            </Header>
            {expand && (
              <Body>
                {interviewStages && (
                  <InterviewStagesBoard
                    interviewStages={interviewStages}
                    setInterviewStages={setInterviewStages}
                    companyId={store.company.id}
                  />
                )}
                {displayWarning && (
                  <>
                    <ApplicantsWarning
                      unsuccesfullApplicants={unsuccesfullApplicants}
                      stagesToDelete={interviewStages.filter(
                        (stage) => stage.destroy
                      )}
                      updateInterviewStagesMethod={updateInterviewStagesMethod}
                      revertToOriginal={() => {
                        setInterviewStages(
                          store.interviewStages.map((stage) => {
                            return { ...stage };
                          })
                        );
                        setDisplayWarning(false);
                      }}
                      stagesOptions={interviewStages.filter(
                        (stage) => !stage.destroy && stage.id
                      )}
                      companyId={store.company.id}
                      session={store.session}
                      setDisplayWarning={setDisplayWarning}
                    />
                  </>
                )}
                {over && (
                  <ButtonsWrapper>
                    <AppButton
                      theme="grey"
                      size="small"
                      onClick={() =>
                        setInterviewStages(
                          store.interviewStages.map((stage) => {
                            return { ...stage };
                          })
                        )
                      }
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      theme="primary"
                      size="small"
                      onClick={() => updateInterviewStagesMethod()}
                    >
                      Save
                    </AppButton>
                  </ButtonsWrapper>
                )}
              </Body>
            )}
          </ContentWrapper>
        </div>
      </div>
    </>
  );
};

export default InterviewStages;

const ApplicantsWarning = ({
  unsuccesfullApplicants,
  stagesToDelete,
  updateInterviewStagesMethod,
  revertToOriginal,
  stagesOptions,
  companyId,
  session,
  setDisplayWarning,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newStageIndex, setNewStageIndex] = useState(undefined);

  const confirmCandidates = () => {
    if (newStageIndex === undefined) {
      notify("danger", "Please choose a stage");
      return;
    } else {
      fetchChangeCandidateStatus(
        companyId,
        unsuccesfullApplicants,
        undefined,
        stagesOptions[newStageIndex].static_name,
        session
      ).then((res) => {
        if (!res.err) {
          notify("info", "candidates succesfully moved");
          updateInterviewStagesMethod(true);
          setDisplayWarning(false);
        } else {
          notify("danger", "Unable to change candidates stage");
        }
      });
    }
  };

  return (
    <ApplicantsWarningContainer>
      {!confirmDelete && (
        <>
          <p>Are you sure you want to delete the stage(s)?</p>
          <ul>
            {stagesToDelete.map((stage, index) => (
              <li key={`stage-${index}`}>{stage.name}</li>
            ))}
          </ul>
          <div className="buttons-container">
            <button
              className="button button--default button--blue-dark"
              onClick={() => {
                updateInterviewStagesMethod(true);
                setConfirmDelete(true);
              }}
            >
              Yes
            </button>
            <button
              className="button button--default button--grey"
              onClick={() => revertToOriginal()}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {confirmDelete && unsuccesfullApplicants?.length > 0 && (
        <>
          <p>
            You are trying to remove a stage that has candidates. Please move
            the candidates to an existing stage first
          </p>
          <label className="form-label form-heading form-heading-small">
            Select Stage
          </label>
          <select
            className="form-control"
            onChange={(e) => setNewStageIndex(e.target.value)}
            value={newStageIndex || ""}
          >
            <option value="" disabled hidden>
              Select a status
            </option>
            {stagesOptions.map((stage, index) => (
              <option value={index} key={`stage-option-${index}`}>
                {stage.name}
              </option>
            ))}
          </select>
          <div className="buttons-container">
            <button
              className="button button--default button--blue-dark"
              onClick={() => confirmCandidates()}
            >
              Confirm
            </button>
            <button
              className="button button--default button--grey"
              onClick={() => revertToOriginal()}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </ApplicantsWarningContainer>
  );
};

const ApplicantsWarningContainer = styled.div`
  margin-top: 5px;

  p {
    margin-bottom: 10px;
  }

  .buttons-container {
    margin-top: 15px;

    button {
      margin-right: 15px;
    }
  }

  select {
    border: 0;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
      inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    max-width: 360px;
  }

  ul {
    list-style: disc;
    padding-left: 15px;
  }
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  position: relative;
  width: 100%;
`;

const Body = styled.div`
  display: grid;
  grid-column-gap: 80px;
  grid-template-columns: 500px 1fr;
  min-height: 450px;
  padding-top: 20px;
  position: relative;
  margin-bottom: 40px;
`;
