import React from "react";
import Col from "react-bootstrap/Col";
import styled from "styled-components";

const receiverTypes = [
  { name: "Candidates", controller: "ProfessionalTalentNetwork" },
  { name: "Contacts", controller: "Contact" },
  // { name: "Clients", controller: "Client" },
];
const ListDetails = ({ list, setList, modalType, originalReceivers }) => {
  return (
    <div>
      <div>
        <label className="form-label form-heading form-heading-small">
          List Name
        </label>
        <input
          className="form-control"
          type={`text`}
          value={list.name}
          onChange={(e) => setList({ ...list, name: e.target.value })}
          placeholder={`Type in the list email`}
        />
      </div>
      <div>
        <label className="form-label form-heading form-heading-small">
          List Type
        </label>
        <select
          name="hiring-managers"
          className={"form-control"}
          value={list.receiver_type}
          onChange={(e) => setList({ ...list, receiver_type: e.target.value })}
          style={{ margin: 0, maxWidth: 200 }}
          disabled={
            (modalType === "edit_list" && originalReceivers.length > 0) ||
            modalType === "create_with_candidates" ||
            modalType === "create_with_contacts"
          }
        >
          <option value="" disabled hidden>
            Select...
          </option>
          {receiverTypes.map((type, index) => (
            <option value={type.controller} key={`reject-option-${index}`}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const StyledCol = styled(Col)`
  text-align: left;

  &.left-padding {
    padding-right: 40px;
  }
  &.right-padding {
    padding-left: 40px;
  }
`;

export default ListDetails;
