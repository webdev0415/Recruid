import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import styled from "styled-components";
import {
  getCompanyApplicationQuestions,
  updateCompanyApplicationQuestions,
} from "helpersV2/company";
import QuestionRow from "./QuestionComponent/QuestionRow";
import notify from "notifications";
import AddApplicationQuestion from "sharedComponents/AddApplicationQuestion";
import useDropdown from "hooks/useDropdown";
import { AWS_CDN_URL } from "constants/api";
const QuestionsComponent = ({
  job,
  disabled,
  applicationQuestions,
  setApplicationQuestions,
}) => {
  const { company, session } = useContext(GlobalContext);
  const { node, showSelect, setShowSelect } = useDropdown();
  const [defaultQuestions, setDefaultQuestions] = useState(undefined);

  useEffect(() => {
    if (company && session) {
      if (!job.application_questions && !applicationQuestions) {
        getCompanyApplicationQuestions(company.id, session).then((res) => {
          if (res.application_questions && !res.application_questions?.error) {
            setDefaultQuestions(res.application_questions);

            const jobAppQuestions = res.application_questions.questions
              .filter((question) => question.enabled)
              .map((question) => ({ ...question, isDefault: true }));

            return setApplicationQuestions(jobAppQuestions);
          }

          return setApplicationQuestions([]);
        });
      } else if (job.application_questions?.length)
        setApplicationQuestions(job.application_questions);
    }
  }, [job, company, session]);

  const handleQuestionUpdate = (index) => (updatedQuestion) => {
    const newQuestions = [...applicationQuestions];

    newQuestions[index] = updatedQuestion;

    return setApplicationQuestions(newQuestions);
  };

  const handleQuestionDelete = (index) => () => {
    const newQuestions = [...applicationQuestions];

    newQuestions.splice(index, 1);

    return setApplicationQuestions(newQuestions);
  };

  const handleSetQuestionAsDefault = async (newQuestion, oldQuestion) => {
    const newDefaultQuestions = { ...defaultQuestions };

    let updateIndex, notificationMessage;

    if (oldQuestion) {
      updateIndex = defaultQuestions.questions?.findIndex(
        (q) => q.question === oldQuestion.question
      );
    }

    if (updateIndex >= 0) {
      newDefaultQuestions.questions[updateIndex] = newQuestion;
      notificationMessage =
        "Successfully updated the default question for your company.";
    } else {
      newDefaultQuestions.questions.push(newQuestion);
      notificationMessage =
        "Successfully set the question as default for your company.";
    }

    const updateQuestionsRes = await updateCompanyApplicationQuestions(
      company.id,
      session,
      newDefaultQuestions
    );

    if (
      updateQuestionsRes?.application_questions?.error &&
      updateQuestionsRes?.error
    ) {
      return notify("danger", "Couldn't set the question as default", "Error");
    }

    setDefaultQuestions(updateQuestionsRes.application_questions);

    return notify("success", notificationMessage, "Success");
  };

  const addApplicationQuestion = (newQuestion) => {
    setApplicationQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  return (
    <Wrapper>
      {!applicationQuestions?.length && <p>No questions added</p>}
      {applicationQuestions?.map((question, index) => (
        <QuestionRow
          key={`question-row-${index}`}
          handleQuestionUpdate={handleQuestionUpdate}
          handleSetQuestionAsDefault={handleSetQuestionAsDefault}
          handleQuestionDelete={handleQuestionDelete}
          question={question}
          index={index}
        />
      ))}
      {showSelect && (
        <div ref={node}>
          <AddApplicationQuestion
            close={() => setShowSelect(false)}
            renderedBy="JobCreation"
            saveAction={addApplicationQuestion}
            handleSetQuestionAsDefault={handleSetQuestionAsDefault}
          />
        </div>
      )}
      <QuestionsButton
        disabled={disabled}
        onClick={() => setShowSelect(true)}
        className="leo-flex-center"
      >
        <span>
          <img src={`${AWS_CDN_URL}/icons/AddSvg.svg`} alt="" />
        </span>
        Add a question
      </QuestionsButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`;

const QuestionsButton = styled.button`
  color: #1fab96;
  font-size: 14px;

  span {
    margin-right: 10px;
  }
`;
export default QuestionsComponent;
