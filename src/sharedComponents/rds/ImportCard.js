import React from "react";
import styled from "styled-components";

const ImportCard = ({
  rdsPreviewData,
  handleDataImport,
  handleImportCancel
}) => (
  <div className="row" style={{ textAlign: "left" }}>
    <div className="col-sm-12 col-md-6">
      <p style={{ marginBottom: 20 }}>
        We’ve found the following person in our database, would you like to
        import them?
      </p>
      {!!rdsPreviewData && (
        <RdsDataMatchBox>
          <h3 className="rds-name">{rdsPreviewData.name}</h3>
          {!!rdsPreviewData.current && (
            <span className="rds-current">
              Current:{" "}
              {`${rdsPreviewData.current.title}` +
                ` at ` +
                `${rdsPreviewData.current.company}` +
                ` - ${rdsPreviewData.current.start}`}
            </span>
          )}
          {!!rdsPreviewData.previous && (
            <span className="rds-previous">
              Previous:{" "}
              {`${rdsPreviewData.previous.title}` +
                ` at ` +
                `${rdsPreviewData.previous.company}` +
                ` - ${rdsPreviewData.previous.start}` +
                `${
                  rdsPreviewData?.previous?.end
                    ? ` - ${rdsPreviewData.previous.end}`
                    : ``
                }`}
            </span>
          )}
          <span className="rds-email">{rdsPreviewData.email}</span>
        </RdsDataMatchBox>
      )}
      <button
        className="button button--default button--grey-light"
        style={{
          background: "#74767B",
          marginRight: "10px",
          minWidth: 130
        }}
        onClick={handleImportCancel}
      >
        Create New
      </button>
      <button
        className="button button--default button--blue-dark"
        style={{ minWidth: 130 }}
        onClick={handleDataImport(rdsPreviewData.id)}
      >
        Import
      </button>
    </div>
  </div>
);

export default ImportCard;

const RdsDataMatchBox = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 20px;
  max-width: 460px;
  min-width: 300px;
  padding: 15px 20px;

  .rds-name {
    color: #1e1e1e;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  .rds-current,
  .rds-previous {
    color: #74767b;
    font-size: 12px;
    line-height: 20px;
  }

  .rds-email {
    font-size: 12px;
    color: #2a3744;
    text-decoration: underline;
  }
`;
