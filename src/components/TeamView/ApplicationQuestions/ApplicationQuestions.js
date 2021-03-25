import React, { useContext, useState, useEffect, lazy, Suspense } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  Title,
  SubTitle,
} from "components/TeamView/Customisation/sharedComponents";
import { Question } from "./Question";
import styled from "styled-components";
import {
  getCompanyApplicationQuestions,
  updateCompanyApplicationQuestions,
} from "helpersV2/company";
import useForceUpdate from "hooks/useForceUpdate";
import useDropdown from "hooks/useDropdown";
import { AWS_CDN_URL } from "constants/api";

const AddApplicationQuestion = lazy(() =>
  import("sharedComponents/AddApplicationQuestion")
);

export default function ApplicationQuestions() {
  const { company, session } = useContext(GlobalContext);
  const { shouldUpdate, triggerUpdate } = useForceUpdate();
  const [applicationQuestions, setApplicationQuestions] = useState(undefined);
  // For AddQuestion component
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    if (company && session) {
      getCompanyApplicationQuestions(company.id, session).then((res) => {
        if (res.application_questions) {
          return setApplicationQuestions(res.application_questions);
        }

        return setApplicationQuestions({
          company_id: company.id,
          questions: [],
          enabled: false,
        });
      });
    }
  }, [company, session, shouldUpdate]);

  const showAddQuestionComponent = (newState) => () => setShowSelect(newState);

  const toggleQuestionsEnabled = async () => {
    const newEnabledStatus = !applicationQuestions?.enabled;
    const newApplicationQuestions = { ...applicationQuestions };

    newApplicationQuestions.enabled = newEnabledStatus;
    newApplicationQuestions.questions = newApplicationQuestions.questions?.map(
      (question) => ({ ...question, enabled: newEnabledStatus })
    );

    await updateCompanyApplicationQuestions(
      company.id,
      session,
      newApplicationQuestions
    );

    return triggerUpdate();
  };

  const toggleQuestionEnabled = async (currentStatus, index) => {
    const newApplicationQuestions = { ...applicationQuestions };
    newApplicationQuestions.questions[index].enabled = !currentStatus;

    await updateCompanyApplicationQuestions(
      company.id,
      session,
      newApplicationQuestions
    );

    return triggerUpdate();
  };

  const handleUpdateFetchCall = async (newQuestions) => {
    const updateQuestionsRes = await updateCompanyApplicationQuestions(
      company.id,
      session,
      newQuestions
    );

    if (
      updateQuestionsRes?.application_questions?.error &&
      updateQuestionsRes?.error
    ) {
      console.log("ERROR");
    }

    return triggerUpdate();
  };

  const addNewQuestion = async (newQuestion) => {
    const newApplicationQuestions = { ...applicationQuestions };

    newApplicationQuestions.questions.push(newQuestion);

    await handleUpdateFetchCall(newApplicationQuestions);
  };

  const removeQuestion = (index) => async () => {
    const newApplicationQuestions = { ...applicationQuestions };

    newApplicationQuestions.questions.splice(index, 1);

    await handleUpdateFetchCall(newApplicationQuestions);
  };

  return (
    <div>
      <Title>Questions Tool</Title>
      <SubTitle>Select default questions for your application form.</SubTitle>
      <QuestionsBox>
        <Question
          title="Personal information"
          disabled
          index={-3}
          customQuestion={false}
        />
        <Question
          title="Details: Resume & Cover Letter"
          disabled
          index={-2}
          customQuestion={false}
        />
        <Question
          title="Custom Questions"
          index={-1}
          active={applicationQuestions?.enabled ?? false}
          onToggle={toggleQuestionsEnabled}
          customQuestion={false}
        />
        {applicationQuestions?.questions.map((question, index) => (
          <Question
            title={question.question}
            question={question}
            index={index}
            key={`custom-question-${index + 1}`}
            active={question?.enabled ?? false}
            onToggle={() => toggleQuestionEnabled(question?.enabled, index)}
            applicationQuestions={applicationQuestions}
            handleUpdateFetchCall={handleUpdateFetchCall}
            removeQuestion={removeQuestion}
          />
        ))}
        {showSelect && (
          <Suspense fallback={"Loading..."}>
            <div ref={node}>
              <AddApplicationQuestion
                close={showAddQuestionComponent(false)}
                renderedBy="Settings"
                saveAction={addNewQuestion}
              />
            </div>
          </Suspense>
        )}
        <AddQuestion onClick={showAddQuestionComponent(true)}>
          <img src={`${AWS_CDN_URL}/icons/AddFieldSvg.svg`} alt="AddFieldSvg" />
          Add Question
        </AddQuestion>
      </QuestionsBox>
    </div>
  );
}

const QuestionsBox = styled.div`
  max-width: 500px;
  padding: 15px 30px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  margin-bottom: 40px;
`;
const AddQuestion = styled.button`
  svg,
  img {
    margin-right: 10px;
  }
  font-weight: 600;
  font-size: 14px;
  color: #2a3744;
`;
