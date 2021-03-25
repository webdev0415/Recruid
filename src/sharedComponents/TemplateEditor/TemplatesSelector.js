import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import notify from "notifications";

import {
  Menu,
  FoldersContainer,
  LiButton,
  IconButton,
} from "sharedComponents/filterV2/SegmentMenu/sharedComponents";

import { folder } from "sharedComponents/filterV2/icons/index";
import { fetchGetTemplates } from "helpersV2/marketing/templates";
import useDropdown from "hooks/useDropdown";

const TemplatesSelector = ({
  setActiveTemplate,
  store,
  source,
  participants,
}) => {
  const [templates, setTemplates] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    //fetch emails
    if (store.company) {
      fetchGetTemplates(
        store.session,
        store.company.id,
        store.session.id,
        undefined,
        {
          created_at: "all time",
          // source_type: source && participants > 0 ? [source, ""] : undefined,
        }
      ).then((res) => {
        if (!res.err) {
          if (source && participants > 0) {
            setTemplates(filterTemplates(res, source));
          } else {
            setTemplates(res);
          }
        } else {
          setTemplates(false);
          notify("danger", "Unable to fetch templates");
        }
      });
    }
  }, [store.session, store.company, source, participants]);
  return (
    <Wrapper ref={node}>
      <SelectButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-end"
      >
        <div className="leo-flex-center-between leo-pointer">
          Templates
          <span>
            <i className="fas fa-caret-down"></i>
          </span>
        </div>
      </SelectButton>
      {showSelect && (
        <SelectMenu
          setShowSelect={setShowSelect}
          templates={templates}
          setActiveTemplate={setActiveTemplate}
          source={source}
        />
      )}
    </Wrapper>
  );
};

export default TemplatesSelector;

const SelectMenu = ({
  templates,
  setActiveTemplate,
  setShowSelect,
  source,
}) => {
  const [tab, setTab] = useState("personal");
  const [foldIndex, setFoldIndex] = useState(undefined);

  return (
    <STSelectMenu>
      <STSelectMenuHeader className="leo-flex-center">
        <div className="tabs-container">
          <button
            onClick={() => {
              setTab("personal");
              setFoldIndex(undefined);
            }}
            className={tab === "personal" ? "active" : ""}
          >
            Personal
          </button>
          <button
            onClick={() => {
              setTab("company");
              setFoldIndex(undefined);
            }}
            className={tab === "company" ? "active" : ""}
          >
            Company
          </button>
        </div>
      </STSelectMenuHeader>
      <FoldersContainer>
        <ul>
          {templates &&
            templates[`${tab}_folders`] &&
            templates[`${tab}_folders`].length > 0 &&
            templates[`${tab}_folders`].map((fold, index) => (
              <li key={`template-folder-${index}`} className="active">
                <div className="d-flex justify-content-between align-items-center">
                  <LiButton
                    className="fold-button"
                    onClick={() =>
                      setFoldIndex(foldIndex === index ? undefined : index)
                    }
                  >
                    {fold.folder_name}
                  </LiButton>
                  <IconButton>
                    <img src={folder} alt="folder icon" />
                  </IconButton>
                </div>
                {foldIndex === index && (
                  <ul>
                    {fold.templates.map((template, ix) => (
                      <li key={`templates-list-${ix}`}>
                        <div className="d-flex justify-content-between align-items-center">
                          <LiButton
                            onClick={() => {
                              setActiveTemplate({
                                ...template,
                              });
                              setShowSelect(false);
                            }}
                          >
                            {template.name}
                          </LiButton>
                          <IconButton></IconButton>
                        </div>
                      </li>
                    ))}
                    {!fold.templates.length && (
                      <li className="empty">
                        No {source ? `${source}s` : ""} templates yet.
                      </li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          {templates &&
            templates[`${tab}_templates`] &&
            templates[`${tab}_templates`].length > 0 &&
            templates[`${tab}_templates`].map((template, ix) => (
              <li key={`templates-list-${ix}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <LiButton
                    onClick={() => {
                      setActiveTemplate({
                        ...template,
                      });
                      setShowSelect(false);
                    }}
                  >
                    {template.name}
                  </LiButton>
                  <IconButton></IconButton>
                </div>
              </li>
            ))}
          {(!templates ||
            (!templates[`${tab}_templates`].length &&
              !templates[`${tab}_folders`].length)) && (
            <li className="empty">
              No {source ? `${source}s` : ""} templates yet.
            </li>
          )}
        </ul>
      </FoldersContainer>
    </STSelectMenu>
  );
};

const filterTemplates = (templates, source) => {
  let personal_templates = [...templates.personal_templates];
  let company_templates = [...templates.company_templates];
  let personal_folders = [...templates.personal_folders];
  let company_folders = [...templates.company_folders];

  personal_templates = personal_templates.filter(
    (template) => template.source_type === source || !template.source_type
  );
  company_templates = company_templates.filter(
    (template) => template.source_type === source || !template.source_type
  );

  personal_folders = personal_folders.map((fold) => {
    return {
      ...fold,
      templates: fold.templates.filter(
        (template) => template.source_type === source || !template.source_type
      ),
    };
  });

  company_folders = company_folders.map((fold) => {
    return {
      ...fold,
      templates: fold.templates.filter(
        (template) => template.source_type === source || !template.source_type
      ),
    };
  });

  return {
    personal_templates,
    company_templates,
    personal_folders,
    company_folders,
  };
};

const Wrapper = styled.div`
  position: relative;
`;

const SelectButton = styled.button`
  color: ${COLORS.dark_4};
  font-weight: 500;
  font-size: 12px;

  div {
    padding: 0;
    width: 100%;

    span {
      margin-left: 15px;
    }
  }
`;

const STSelectMenu = styled(Menu)`
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 4px;
  bottom: 30px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  left: -10px;
  right: auto;
  top: auto;

  .tabs-container {
    padding-top: 15px;
    margin: 0px 15px;
    position: relative;
    width: 100%;

    button {
      height: 100%;
      padding-bottom: 10px;
      margin-right: 20px;
      font-size: 14px;
      color: #74767b;
      font-weight: 500;
      &.active {
        border-bottom: solid #2a3744 2px;
        color: #2a3744;
      }
    }
  }

  .edit-button {
    margin-right: 15px;
  }

  .save-button {
    margin-right: 15px;
    font-size: 10px;
    padding: 5px 10px;
  }
`;

const STSelectMenuHeader = styled.div`
  border-bottom: solid #eee 1px;
`;
