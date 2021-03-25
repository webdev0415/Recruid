import React, { useState, useEffect } from "react";
import SelectV2 from "sharedComponents/SelectV2";
import ToggleV3 from "sharedComponents/ToggleV3";
import { ShortAnswerSvg, MultiselectSvg, CheckboxSvg } from "assets/svg/icons";
import { AWS_CDN_URL } from "constants/api";
import styled from "styled-components";

const QUESTION_OPTIONS = [
  {
    value: "short",
    label: (
      <div>
        <ShortAnswerSvg /> Short answer
      </div>
    ),
  },
  {
    value: "multiselect",
    label: (
      <div>
        <MultiselectSvg /> Multiple Choices
      </div>
    ),
  },
  {
    value: "checkbox",
    label: (
      <div>
        <CheckboxSvg /> Checkboxes
      </div>
    ),
  },
];

export default function AddApplicationQuestionModal({
  close,
  renderedBy,
  questionToEdit = undefined,
  saveAction,
  handleSetQuestionAsDefault = null,
  handleQuestionDelete = null,
}) {
  const [questionType, setQuestionType] = useState(QUESTION_OPTIONS[0]);
  const [questionRequired, setQuestionRequired] = useState(false);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [newAnswerOption, setNewAnswerOption] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [isQuestionDefault, setIsQuestionDefault] = useState(false);
  const [questionNote, setQuestionNote] = useState("");

  useEffect(() => {
    return () => {
      setQuestionType(QUESTION_OPTIONS[0]);
      setQuestionRequired(false);
      setAnswerOptions([]);
      setNewAnswerOption("");
      setQuestionContent("");
      setIsQuestionDefault(false);
      setQuestionNote("");
    };
  }, []);

  useEffect(() => {
    if (questionToEdit) {
      setQuestionType(
        QUESTION_OPTIONS.find((option) => option.value === questionToEdit.type)
      );
      setQuestionRequired(questionToEdit.required);
      setAnswerOptions(questionToEdit.answers);
      setQuestionContent(questionToEdit.question);
      setIsQuestionDefault(questionToEdit.isDefault);
      setQuestionNote(questionToEdit?.note ?? "");
    }
  }, [questionToEdit]);

  const onQuestionTypeSelect = (questionTypeOption) =>
    setQuestionType(questionTypeOption);

  const handleQuestionRequiredToggle = () =>
    setQuestionRequired((state) => !state);

  const handleClose = () => {
    if (questionToEdit) {
      handleQuestionDelete();
      close();
    }

    return close();
  };

  const handleAnswerOptionChange = (event, index) => {
    event.persist();
    setAnswerOptions((options) => {
      const newOptions = [...options];

      if (event.target.value?.length) {
        newOptions[index] = event.target.value;

        return newOptions;
      }

      return newOptions.filter((key, idx) => idx !== index);
    });
  };

  const addNewAnswerOption = (option) => {
    if (newAnswerOption?.length) {
      setAnswerOptions((prevOptions) => [...prevOptions, option]);
      setNewAnswerOption("");
    }
  };

  const handleAddNewAnswerOption = (event) =>
    setNewAnswerOption(event.target.value);

  const handleNewOptionKeyDown = (event) => {
    if (event.key === "Enter") {
      addNewAnswerOption(newAnswerOption);
    }
  };

  const handleNewOptionBlur = () => addNewAnswerOption(newAnswerOption);

  const handleQuestionContentChange = ({ target: { value } }) =>
    setQuestionContent(value);

  const handleQuestionNoteChange = ({ target: { value } }) =>
    setQuestionNote(value);

  const buildApplicationQuestion = () => {
    const questionParams = {
      required: questionRequired,
      type: questionType.value,
      question: questionContent,
      answers: answerOptions,
      enabled: questionToEdit?.enabled ?? true,
      isDefault: isQuestionDefault,
      note: questionNote,
    };

    if (questionToEdit?.reasonable_adjustments_question) {
      questionParams.reasonable_adjustments_question = true;
    }

    return questionParams;
  };

  const handleSaveAction = async () => {
    const newQuestion = buildApplicationQuestion();
    saveAction(newQuestion);

    if (isQuestionDefault && renderedBy === "JobCreation") {
      handleSetQuestionAsDefault(newQuestion);
    }

    return close();
  };

  return (
    <ApplicationQiestion>
      {(!questionToEdit?.reasonable_adjustments_question ||
        !questionToEdit) && (
        <div className="leo-flex-center-between">
          <h3>{questionToEdit ? "Edit Question" : "Add Question"}</h3>
          <SelectV2
            name="application-questions-select"
            onSelect={onQuestionTypeSelect}
            options={QUESTION_OPTIONS}
            defaultOption={questionType}
          />
        </div>
      )}
      <Body>
        {(!questionToEdit?.reasonable_adjustments_question ||
          !questionToEdit) && (
          <>
            <Textarea
              placeholder="Enter your question here..."
              onChange={handleQuestionContentChange}
              defaultValue={questionContent}
            />
            {questionType.value !== "short" && (
              <AnswerOptionsList>
                {answerOptions?.map((option, index) => (
                  <div
                    key={`anwser-option-${index + 1}`}
                    className="leo-flex-center"
                  >
                    {questionType.value === "checkbox" && (
                      <CheckboxSvg checked={false} />
                    )}
                    {questionType.value === "multiselect" && (
                      <MultiselectSvg selected={false} />
                    )}
                    <input
                      value={option}
                      onChange={(e) => handleAnswerOptionChange(e, index)}
                      placeholder="Add option"
                    />
                  </div>
                ))}
                <div className="leo-flex-center">
                  {questionType.value === "checkbox" && (
                    <CheckboxSvg checked={false} />
                  )}
                  {questionType.value === "multiselect" && (
                    <MultiselectSvg selected={false} />
                  )}
                  {questionType.value !== "short" && (
                    <input
                      value={newAnswerOption}
                      onChange={handleAddNewAnswerOption}
                      onKeyDown={handleNewOptionKeyDown}
                      onBlur={handleNewOptionBlur}
                      placeholder="Add option"
                    />
                  )}
                </div>
              </AnswerOptionsList>
            )}
          </>
        )}
        <label style={{ margin: "10px 0" }} htmlFor="question-note">
          Note for Question
        </label>
        <Textarea
          id="question-note"
          placeholder="Leave a note explaining this question to a candidate"
          rows={8}
          onChange={handleQuestionNoteChange}
          defaultValue={questionNote}
        />
      </Body>
      <Footer className="leo-flex-center-between">
        <button
          className="button button--default button--blue-dark"
          onClick={handleSaveAction}
        >
          Save
        </button>
        {renderedBy === "JobCreation" && (
          <div className="leo-flex leo-justify-between">
            <span>Set as default</span>
            <ToggleV3
              name="application-question-default"
              toggle={() => setIsQuestionDefault((prevState) => !prevState)}
              checked={isQuestionDefault}
              disabled={questionToEdit?.isDefault}
            />
          </div>
        )}
        <div className="leo-flex leo-justify-between">
          <button onClick={handleClose}>
            <img src={`${AWS_CDN_URL}/icons/BinSvg.svg`} alt="Close" />
          </button>
          <div className="leo-flex-center">
            <span>Required</span>
            <ToggleV3
              name="application-question-required"
              toggle={handleQuestionRequiredToggle}
              checked={questionRequired}
            />
          </div>
        </div>
      </Footer>
    </ApplicationQiestion>
  );
}

const ApplicationQiestion = styled.div`
  width: 100%;
  margin: 20px 0;
  padding-bottom: 30px;
  border-bottom: 1px solid #eeeeee;
`;
const Body = styled.div`
  margin: 10px 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px;
  /* resize: none; */
  font-weight: 500;
  font-size: 12px;
  min-height: 80px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  height: auto;

  &::placeholder {
    color: #c4c4c4;
  }
`;

const AnswerOptionsList = styled.div`
  margin: 20px 0;
  div {
    input {
      font-weight: 500;
      font-size: 12px;
      width: 100%;
      border: none;
      padding: 2px 0;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease-in;

      &:focus {
        border-bottom: 1px solid #35c3ae;
      }

      &::placeholder {
        color: #74767b;
      }
    }
  }
`;

const Footer = styled.div`
  div {
    div {
      font-size: 14px;
      color: #74767b;
      border-left: 1px solid #c4c4c4;
      padding-left: 10px;
      margin-left: 10px;

      span {
        margin-right: 10px;
      }
    }
  }
`;
