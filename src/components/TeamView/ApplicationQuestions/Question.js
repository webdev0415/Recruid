import React, { lazy, Suspense } from "react";
import useDropdown from "hooks/useDropdown";
import ToggleV3 from "sharedComponents/ToggleV3";
import styled from "styled-components";
// import notify from "notifications";

const AddApplicationQuestion = lazy(() =>
  import("sharedComponents/AddApplicationQuestion")
);

export const Question = ({
  title,
  question = undefined,
  active = true,
  disabled = false,
  onToggle = () => {},
  customQuestion = true,
  index,
  applicationQuestions = undefined,
  handleUpdateFetchCall = undefined,
  removeQuestion = undefined
}) => {
  const { node, showSelect, setShowSelect } = useDropdown(null, 50);

  const toggleEditQuestion = () => {
    // if (question.reasonable_adjustments_question) {
    //   return notify('warning', 'This is a default question and it can\'t be edited.');
    // };
    if (!disabled) return setShowSelect((prevState) => !prevState);
  };

  const updateQuestion = async (newQuestion) => {
    const newApplicationQuestions = { ...applicationQuestions };

    newApplicationQuestions.questions[index] = newQuestion;

    await handleUpdateFetchCall(newApplicationQuestions);
  };

  return (
    <div ref={node}>
      <QuestionSC style={customQuestion ? { marginLeft: "20px" } : {}}>
        <button
          disabled={disabled || !question}
          onClick={toggleEditQuestion}
          className={disabled || !question ? "disabled" : ""}
        >
          {title}
        </button>
        <ToggleV3
          name={`application-question-${index + 1}`}
          checked={active}
          toggle={onToggle}
          disabled={disabled}
        />
      </QuestionSC>
      {showSelect && (
        <Suspense fallback={<div />}>
          <AddApplicationQuestion
            close={() => setShowSelect(false)}
            renderedBy="Settings"
            questionToEdit={question}
            saveAction={updateQuestion}
            handleQuestionDelete={removeQuestion(index)}
          />
        </Suspense>
      )}
    </div>
  );
};

const QuestionSC = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    font-size: 14px;
    color: #74767b;
    transition: all 0.15s ease-in;

    &:hover:not(.disabled) {
      text-decoration: underline;
      color: #2a3744;
      cursor: pointer;
    }
  }
`;
