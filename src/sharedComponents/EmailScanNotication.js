import React from "react";
import styled from "styled-components";
import Spinner from "sharedComponents/Spinner";

export default function EmailScanNotifications() {
  return (
    <EmailScanNoticationSC>
      <EmailScanNoticationHeader className="leo-flex-center-between">
        <h3>Importing Gmail Inbox</h3>
        <Spinner size="sm" style={{ padding: "0" }} />
      </EmailScanNoticationHeader>
      <span>
        Awesome{" "}
        <span role="img" aria-label="clap emoji">
          👏
        </span>{" "}
        Your inbox is currently being imported so we can show all emails that
        you have sent to candidate, clients and contacts.
      </span>
    </EmailScanNoticationSC>
  );
}

const EmailScanNoticationSC = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  bottom: 20px;
  font-size: 0.8em;
  position: fixed;
  right: 120px;
  width: 330px;
  z-index: 3;

  span {
    padding: 10px 15px;
  }
`;

const EmailScanNoticationHeader = styled.div`
  border-bottom: 1px solid #e1e1e1;
  padding: 8px 15px;

  h3 {
    font-weight: 500;
  }
`;
