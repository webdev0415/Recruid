import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

import { MultiselectSvg, CheckboxSvg } from "assets/svg/icons";
import useDropdown from "hooks/useDropdown";
import AddApplicationQuestion from "sharedComponents/AddApplicationQuestion";
import notify from "notifications";

const QuestionRow = ({
  question,
  index,
  handleQuestionUpdate,
  handleSetQuestionAsDefault,
  handleQuestionDelete,
}) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  const onSetAsDefaultUpdate = (newQuestion) => {
    handleSetQuestionAsDefault(newQuestion, question);
    handleQuestionUpdate(index)(newQuestion);
  };

  const showEditScreen = () => {
    if (question.reasonable_adjustments_question) {
      return notify(
        "warning",
        "This is a default question and it can't be edited. \n If you don't want this question to be included in the application form, please disable it in the customisations settings of your company."
      );
    }
    setShowSelect((prevSelect) => !prevSelect);
  };

  return (
    <QRowWrapper ref={node}>
      <Qrow>
        <div className="leo-flex-center-between">
          <div className="leo-flex">
            <img src={`${AWS_CDN_URL}/icons/BurguerMenu.svg`} alt="" />
            <p>{question.question}</p>
          </div>
          <button onClick={showEditScreen}>
            <img
              src={`${AWS_CDN_URL}/icons/filter-icons/edit.svg`}
              alt="edit pencil"
            />
          </button>
        </div>
        {question.type !== "short" && !showSelect && (
          <div className="question-bottom">
            {question.answers?.map((option, index) => (
              <div key={`anwser-option-${index + 1}`} className="leo-flex">
                {question.type === "checkbox" && (
                  <CheckboxSvg checked={false} />
                )}
                {question.type === "multiselect" && (
                  <MultiselectSvg selected={false} />
                )}
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </Qrow>
      {showSelect && (
        <AddApplicationQuestion
          close={() => setShowSelect(false)}
          renderedBy="JobCreation"
          questionToEdit={question}
          saveAction={handleQuestionUpdate(index)}
          handleSetQuestionAsDefault={onSetAsDefaultUpdate}
          handleQuestionDelete={handleQuestionDelete(index)}
        />
      )}
    </QRowWrapper>
  );
};

export default QuestionRow;

const QRowWrapper = styled.div`
  border-bottom: solid #eee 1px;
  margin-bottom: 10px;
  padding-bottom: 30px;
`;
const Qrow = styled.div`
  p {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin-left: 15px;
    color: #74767b;
  }

  .question-bottom {
    margin-left: 40px;
    div {
      margin: 10px 0;

      span {
        font-size: 12px;
      }
    }
  }
`;
