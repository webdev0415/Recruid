import React, { useState, useEffect } from "react";
import spacetime from "spacetime";
import { Base64 } from "js-base64";
import styled from "styled-components";
import { variableReplacer } from "sharedComponents/TemplateEditor/variableReplacer";
import { buildHtmlBody } from "helpersV2/marketing/emails";

const EmailPreview = ({ email, marketingSettings, store }) => {
  const [parsedBody, setParsedBody] = useState(undefined);

  useEffect(() => {
    if (email && email.body) {
      const decodedBody = Base64.decode(email.body);
      if (email.is_draft) {
        setParsedBody(
          buildHtmlBody(
            variableReplacer(decodedBody),
            marketingSettings?.marketing_logo || store.company.avatar_url,
            marketingSettings?.email_footer
          )
        );
      } else {
        setParsedBody(variableReplacer(decodedBody));
      }
    }
  }, [email]);
  return (
    <Preview>
      <Subject className="preview-header leo-flex-center">
        {email.subject}
      </Subject>
      <From className="preview-header leo-flex-center-between">
        <div>
          From: {email.from_name} {"<"}
          {email.from_email}
          {">"}
        </div>
        {!email.is_draft && (
          <div>{spacetime(email.updated_at).format("nice")}</div>
        )}
      </From>
      <Content dangerouslySetInnerHTML={{ __html: parsedBody }} />
    </Preview>
  );
};

const Preview = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-size: 12px;
  max-height: 500px;
  overflow: auto;
  width: 100%;

  .preview-header {
    background: #ffffff;
    border-bottom: solid 1px #eeeeee;
    font-weight: 500;
    font-size: 12px;
    height: 34px;
    padding: 0 15px;
    white-space: nowrap;
  }

  .variable {
    background: #dfe9f4;
    border-radius: 4px;
    display: inline-block;
    padding: 2px 5px;
    width: max-content;
  }
`;

const Subject = styled.div`
  font-weight: 500;
`;

const From = styled.div`
  color: #74767b;
`;

const Content = styled.div`
  font-size: 15px;
  padding: 20px;

  img {
    &:first-child {
      margin-top: 0 !important;
    }
  }
`;

export default EmailPreview;
