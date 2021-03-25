import React from "react";
import CallCreator from "sharedComponents/ActionCreator/CallCreator";
import MeetCreator from "sharedComponents/ActionCreator/MeetCreator";
import NoteCreator from "sharedComponents/ActionCreator/NoteCreator";
import TaskCreator from "sharedComponents/ActionCreator/TaskCreator";

const ActionTyper = (props) => {
  return (
    <>
      {props.actionType === "note" && <NoteCreator {...props} />}
      {props.actionType === "call" && <CallCreator {...props} />}
      {(props.actionType === "meet" || props.actionType === "meet-log") && (
        <MeetCreator {...props} />
      )}
      {props.actionType === "task" && <TaskCreator {...props} />}
    </>
  );
};

export default ActionTyper;
