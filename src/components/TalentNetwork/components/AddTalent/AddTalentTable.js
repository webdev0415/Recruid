import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Tooltip from "react-simple-tooltip";
import Toggle from "sharedComponents/Toggle";
import { API_ROOT_PATH } from "constants/api";
import TagsComponent from "sharedComponents/TagsComponent";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { AWS_CDN_URL } from "constants/api";

export const AddTalentTable = ({
  closeModal,
  addedProfessionals,
  session,
  setAddedProfessionals,
  concatInvitedProfessionals,
  triggerBatchUpdate,
}) => {
  const store = useContext(GlobalContext);
  const [sources, setSources] = useState({});
  const [consents, setConsents] = useState({});
  // const [emails, setEmails] = useState({});

  // const handleEmailChange = (event, id) => {
  //   let results = {};
  //   results[id] = event.target.value;
  //   setEmails({...emails, ...results});
  // };

  const handleSourceChange = (event, id) => {
    let results = {};
    results[id] = Number(event.target.value);
    setSources({ ...sources, ...results });
  };

  const handleConsentChange = (event, id) => {
    let results = {};
    results[id] = event.target.checked;
    setConsents({ ...consents, ...results });
  };

  const batchUpdate = async (postBody, session) => {
    let body = { candidates: [...postBody], company_id: store.company.id };
    const url = `${API_ROOT_PATH}/v1/talent_network/batch_update`;
    try {
      const postData = await fetch(url, {
        method: `POST`,
        headers: session,
        body: JSON.stringify(body),
      });
      const data = await postData.json();
      concatInvitedProfessionals(
        addedProfessionals.map((prof) => {
          return {
            ...prof,
            status: consents[prof.professional_id] ? "passive" : "invited",
          };
        })
      );
      return data;
    } catch (err) {
      console.error(`Error updating candidates: ${err}`);
    }
  };

  useEffect(() => {
    if (triggerBatchUpdate) {
      handleBatchUpdate();
    }
  }, [triggerBatchUpdate]);

  const handleBatchUpdate = () => {
    let results = [];

    for (let n = 0; n < addedProfessionals.length; n++) {
      let id = addedProfessionals[n].professional_id;
      results.push({
        professional_id: id,
        cv_id: addedProfessionals[n].cv_id,
        cv_document_id: addedProfessionals[n].cv_document_id,
        name: addedProfessionals[n].name,
        tn_email: addedProfessionals[n].email,
        custom_source_id: sources[id] ? sources[id] : "",
        consent: consents[id] ? consents[id] : false,
        competencies_attributes: addedProfessionals[n].competencies_attributes,
        categorizations_attributes:
          addedProfessionals[n].categorizations_attributes,
      });
    }
    batchUpdate(results, session);
    closeModal();
  };

  return (
    <>
      {addedProfessionals &&
        addedProfessionals.map((candidate, index) => (
          <ProfessionalTable
            key={`candidate#-${index}`}
            index={index}
            addedProfessionals={addedProfessionals}
            handleConsentChange={handleConsentChange}
            handleSourceChange={handleSourceChange}
            candidate={candidate}
            setCandidate={(cand) => {
              let candsCopy = [...addedProfessionals];
              candsCopy[index] = cand;
              setAddedProfessionals(candsCopy);
            }}
            store={store}
          />
        ))}
    </>
  );
};

const limit = 3;
const ProfessionalTable = ({
  index,
  addedProfessionals,
  handleConsentChange,
  handleSourceChange,
  candidate,
  setCandidate,
  store,
}) => {
  const [editSkills, setEditSkills] = useState(false);
  const [editIndustries, setEditIndustries] = useState(false);

  return (
    <Table topBorder={index !== 0}>
      <TableHeader>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Source</th>
          <th>
            Consent
            <Tooltip
              content="Do you have the users permission to hold their data? If you do not have consent the user will be emailed a request to be a part of your talent network."
              placement="bottom"
              fontSize="12px"
              padding={10}
              style={{
                lineHeight: "16px",
              }}
            >
              <TooltipIcon>
                <svg
                  width="14"
                  height="14"
                  xmlns="http://www.w3.org/2000/svg"
                  xlinkHref="http://www.w3.org/1999/xlink"
                >
                  <g fill="none" fill-role="evenodd">
                    <circle fill="#3F3F3F" cx="7" cy="7" r="7" />
                    <path
                      d="M7.264 8.253h-.94c0-1.742 1.25-1.66 1.25-2.577 0-.46-.248-.702-.671-.702-.347 0-.676.214-.682.745h-1.07c.005-1.1.775-1.617 1.752-1.617 1.082 0 1.727.583 1.727 1.549 0 1.304-1.346 1.335-1.366 2.602zm-.46 1.81c-.381 0-.648-.27-.648-.62 0-.352.267-.625.648-.625a.62.62 0 0 1 .642.625c0 .35-.273.62-.642.62z"
                      fill="#FFF"
                      fill-role="nonzero"
                    />
                  </g>
                </svg>
              </TooltipIcon>
            </Tooltip>
          </th>
        </tr>
      </TableHeader>
      <TableBody>
        <tr>
          <th>
            <input
              className="form-control"
              style={{ marginBottom: "0px" }}
              type="text"
              placeholder="Candidate name"
              value={candidate.name || ""}
              onChange={(e) =>
                setCandidate({ ...candidate, name: e.target.value })
              }
            />
          </th>
          <td>
            <input
              className="form-control"
              style={{ marginBottom: "0px" }}
              type="text"
              placeholder="Candidate email"
              value={candidate.email || ""}
              onChange={(e) =>
                setCandidate({ ...candidate, email: e.target.value })
              }
            />
          </td>
          <td>
            <select
              onChange={(event) =>
                handleSourceChange(
                  event,
                  addedProfessionals[index].professional_id
                )
              }
              className="form-control form-control-select"
              style={{ margin: 0, maxWidth: "200px" }}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Please select a source
              </option>
              {store.sources &&
                store.sources.map((source, index) => (
                  <option key={`source-${index}`} value={source.id}>
                    {source.source}
                  </option>
                ))}
            </select>
          </td>
          <td>
            <Toggle
              name={`consent-${index}`}
              toggle={(event) =>
                handleConsentChange(
                  event,
                  addedProfessionals[index].professional_id
                )
              }
            />
          </td>
        </tr>
        <tr>
          <th>Skills</th>
          <td colSpan="2">
            <Content>
              <ul>
                {candidate.skills &&
                  candidate.skills?.length > 0 &&
                  candidate.skills.map((ind, i) => {
                    if (i < limit) {
                      return <li key={i}>{ind.name}</li>;
                    } else return null;
                  })}
                {candidate.skills?.length > limit && (
                  <li> + {candidate.skills.length - limit} more</li>
                )}
                {(!candidate ||
                  !candidate.skills ||
                  candidate.skills.length === 0) && (
                  <li>Candidate has no skills yet</li>
                )}
              </ul>
            </Content>
          </td>
          <td>
            <button
              onClick={() => {
                if (editSkills) {
                  let cand = { ...candidate };
                  delete cand.competencies_attributes;
                  setCandidate(cand);
                }
                setEditSkills(!editSkills);
              }}
            >
              {!editSkills ? (
                <img src={`${AWS_CDN_URL}/icons/EditPen.svg`} alt="Edit" />
              ) : (
                <img src={`${AWS_CDN_URL}/icons/CancelIcon.svg`} alt="" />
              )}
            </button>
          </td>
        </tr>
        {editSkills && (
          <tr>
            <td colSpan="4">
              <TagsComponent
                label={`${candidate.name} skills`}
                type="skills"
                originalTags={candidate.skills || []}
                returnTags={(competencies_attributes) =>
                  setCandidate({ ...candidate, competencies_attributes })
                }
              />
            </td>
          </tr>
        )}
        <tr>
          <th>Industries</th>
          <td colSpan="2">
            <Content>
              <ul>
                {candidate.industries &&
                  candidate.industries?.length > 0 &&
                  candidate.industries.map((ind, i) => {
                    if (i < limit) {
                      return <li key={i}>{ind.name}</li>;
                    } else return null;
                  })}
                {candidate.industries?.length > limit && (
                  <li> + {candidate.industries.length - limit} more</li>
                )}
                {(!candidate ||
                  !candidate.industries ||
                  candidate.industries.length === 0) && (
                  <li>Candidate has no industries yet</li>
                )}
              </ul>
            </Content>
          </td>
          <td>
            <button
              onClick={() => {
                if (editIndustries) {
                  let cand = { ...candidate };
                  delete cand.categorizations_attributes;
                  setCandidate(cand);
                }
                setEditIndustries(!editIndustries);
              }}
            >
              {!editIndustries ? (
                <img src={`${AWS_CDN_URL}/icons/EditSvg.svg`} alt="" />
              ) : (
                <img src={`${AWS_CDN_URL}/icons/CancelSvg.svg`} alt="" />
              )}
            </button>
          </td>
        </tr>
        {editIndustries && (
          <tr>
            <td colSpan="4">
              <TagsComponent
                label={`${candidate.name} Industries`}
                type="industries"
                originalTags={candidate.industries || []}
                returnTags={(categorizations_attributes) =>
                  setCandidate({ ...candidate, categorizations_attributes })
                }
              />
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  margin-bottom: 50px;
  border-top: ${(props) => (props.topBorder ? "1px solid #eee" : "none")};
`;

const TableHeader = styled.thead`
  border-bottom: 1px solid #eee;

  th {
    color: #9a9ca1;
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 1.67px;
    padding: 10px 15px;
    text-transform: uppercase;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #eee;

    th {
      font-weight: 500;
      padding: 10px 15px;
    }

    td {
      padding: 10px 15px;
    }
  }
`;

const TooltipIcon = styled.div`
  position: absolute;
  right: -20px;
  top: -11px;

  .css-87d0xn-BaseToolTop {
  }
`;

export const Content = styled.div`
  font-size: 14px;

  ul {
    display: flex;
    list-style: none;
    flex-wrap: wrap;
    padding: 0;

    li {
      &:not(:last-child) {
        margin-right: 3px;

        &:after {
          content: ", ";
        }
      }
    }
  }
`;
