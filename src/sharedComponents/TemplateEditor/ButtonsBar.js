import React from "react";
import { EditorControls } from "sharedComponents/TemplateEditor/components";
import VariableSelector from "sharedComponents/TemplateEditor/VariableSelector";
import FileSelector from "sharedComponents/TemplateEditor/FileSelector";
import TemplatesSelector from "sharedComponents/TemplateEditor/TemplatesSelector";
const ButtonsBar = ({
  addVariable,
  store,
  setActiveTemplate,
  type,
  source,
  addFilesToTemplate,
  createLink,
  createImageEntity,
  participants,
}) => {
  return (
    <>
      <EditorControls className="bottom-row">
        <div className="cont">
          <VariableSelector
            addVariable={addVariable}
            createLink={createLink}
            source={source}
            type={type}
            store={store}
          />
        </div>
        <div className="cont">
          <FileSelector
            addFilesToTemplate={addFilesToTemplate}
            store={store}
            createImageEntity={createImageEntity}
          />
        </div>
        {type === "email" && (
          <div className="cont end">
            <TemplatesSelector
              store={store}
              setActiveTemplate={setActiveTemplate}
              source={source}
              participants={participants}
            />
          </div>
        )}
      </EditorControls>
    </>
  );
};

export default ButtonsBar;
