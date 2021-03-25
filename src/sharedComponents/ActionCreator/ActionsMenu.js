import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

import useDropdown from "hooks/useDropdown";

const MENU_OPTIONS = [
  {
    name: "note",
    label: "Note",
    icon: `${AWS_CDN_URL}/icons/action-icons/icon-note.svg`,
  },
  {
    name: "call",
    label: "Call",
    icon: `${AWS_CDN_URL}/icons/action-icons/icon-call.svg`,
  },
  {
    name: "task",
    label: "Task",
    icon: `${AWS_CDN_URL}/icons/action-icons/icon-task.svg`,
  },
  {
    name: "meet",
    label: "Meet",
    icon: `${AWS_CDN_URL}/icons/action-icons/icon-meet.svg`,
    dropdown: [
      { name: "meet", label: "Create Meet" },
      { name: "meet-log", label: "Log Meet" },
    ],
  },
];

const ActionsMenu = ({
  actionType,
  setActionType,
  actionTotals,
  sendToOverview,
  showDropdown,
  onlyNotes,
}) => {
  const {
    node,
    showSelect: activeDropdown,
    setShowSelect: setActiveDropdown,
  } = useDropdown();

  return (
    <ActionsMenuContainer ref={node}>
      {[...(onlyNotes ? MENU_OPTIONS.slice(0, 1) : MENU_OPTIONS)].map(
        (option, index) => (
          <ActionButton
            key={`option-${index}`}
            option={option}
            actionType={actionType}
            setActionType={setActionType}
            index={index}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            total={actionTotals[option.name]}
            sendToOverview={sendToOverview}
            showDropdown={showDropdown}
          />
        )
      )}
      {}
    </ActionsMenuContainer>
  );
};

export default ActionsMenu;

const ActionButton = ({
  option,
  actionType,
  setActionType,
  index,
  setActiveDropdown,
  activeDropdown,
  total,
  sendToOverview,
  showDropdown,
}) => {
  return (
    <IconWrapper
    // className={`${actionType !== option.name && "active" : ""}`}
    >
      {total > 0 && <NumberIcon>{total}</NumberIcon>}
      <IconButton
        className={
          actionType !== undefined && actionType !== option.name
            ? "unselected"
            : ""
        }
        onClick={() => {
          setActionType(option.name);
          if (sendToOverview) sendToOverview();
          if (activeDropdown !== undefined) setActiveDropdown(undefined);
          if (option.dropdown && showDropdown) {
            setActiveDropdown(index);
          }
        }}
      >
        <img src={option.icon} alt={option.label} />
      </IconButton>
      <span>{option.label}</span>
      {option.dropdown && index === activeDropdown && (
        <SubMenu>
          {option.dropdown.map((subOption, ix) => (
            <button
              key={`sub-option-${ix}`}
              onClick={() => {
                setActionType(subOption.name);
                if (sendToOverview) sendToOverview();
                setActiveDropdown(undefined);
              }}
            >
              {subOption.label}
            </button>
          ))}
        </SubMenu>
      )}
    </IconWrapper>
  );
};

const ActionsMenuContainer = styled.div`
  align-items: center;
  display: grid;
  grid-column-gap: 10px;
  grid-auto-flow: column;
`;

const IconWrapper = styled.div`
  position: relative;
  text-align: center;

  span {
    color: #74767b;
    font-size: 12px;
  }
`;

const SubMenu = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  right: -5px;
  margin-top: 5px;
  width: max-content;
  z-index: 20;

  button {
    display: block;
    font-size: 12px;
    padding: 5px 15px;
    width: 100%;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }

    &:hover {
      background: #f9f9f9;
    }
  }
`;

const IconButton = styled.button`
  background: #dfe9f4;
  border-radius: 50%;
  height: 38px;
  margin-bottom: 8px;
  width: 38px;

  &.unselected {
    opacity: 0.25;
  }
`;

const NumberIcon = styled.div`
  align-items: center;
  background: #2a3744;
  border-radius: 50%;
  color: #fff !important;
  display: flex;
  font-size: 10px;
  font-weight: 600;
  height: 20px;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: -5px;
  top: -5px;
  width: 20px;
  z-index: 1;
`;
