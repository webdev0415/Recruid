import React, { useContext, useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import AvatarIcon from "sharedComponents/AvatarIcon";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import EmptyTab from "components/Profiles/components/EmptyTab";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { deleteDocumentCall } from "helpersV2/CandidateProfile";
import { fetchDocumentsList } from "helpersV2/documents";
import { ATSContainer } from "styles/PageContainers";
import { EmptyDeals } from "assets/svg/EmptyImages";
const SLICE_LENGHT = 20;
const DocumentsTable = ({ elastic_ids }) => {
  const store = useContext(GlobalContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [selectedDocIx, setSelectedDocIx] = useState(undefined);
  const [documents, setDocuments] = useState(undefined);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (store.company && store.session) {
      fetchDocumentsList(store.session, {
        company_id: store.company.id,
        slice: [0, SLICE_LENGHT],
        elastic_ids,
      }).then((docs) => {
        if (!docs.err) {
          setDocuments(docs);
          if (docs.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", docs);
        }
      });
    }
  }, [store.company, store.session, elastic_ids]);

  const fetchMore = () => {
    fetchDocumentsList(store.session, {
      company_id: store.company.id,
      slice: [documents.length, SLICE_LENGHT],
      elastic_ids,
    }).then((docs) => {
      if (!docs.err) {
        setDocuments([...documents, ...docs]);
        if (docs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", docs);
      }
    });
  };

  const deleteDocument = () => {
    deleteDocumentCall(documents[selectedDocIx].id, store.session).then(
      (res) => {
        if (res.status !== 405) {
          let newDocuments = [...documents];
          newDocuments.splice(selectedDocIx, 1);
          setDocuments(newDocuments);
        } else {
          alert("Could not delete this file");
        }
      }
    );
  };

  return (
    <ATSContainer>
      <EmptyTab
        data={documents}
        title={"The company has no documents."}
        copy={"Visit a profile to add one!"}
        image={<EmptyDeals />}
        // action={() =>
        //   setRedirect(ROUTES.ClientManager.url(store.company.mention_tag))
        // }
        // actionText={"Go to CRM"}
      >
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={documents?.length || 0}
        >
          <div className={styles.container}>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Name
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Date Added
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Added by
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Source
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader} />
                  </tr>
                </thead>
                <tbody>
                  {documents &&
                    documents.map((doc, index) => (
                      <tr
                        className="table-row-hover"
                        key={`documents-row-${index}`}
                      >
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {" "}
                          <OptionLink
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.title}
                          </OptionLink>
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {spacetime(new Date(doc.created_at)).format(
                            "{date} {month}, {year}"
                          )}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {doc.added_by && (
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={doc.added_by.name}
                                imgUrl={doc.added_by.avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {doc.added_by.name}
                            </div>
                          )}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {doc.source && (
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={doc.source.name}
                                imgUrl={doc.source.avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              <OverflowCell
                                to={
                                  doc.source.type ===
                                  "professional_talent_network"
                                    ? ROUTES.CandidateProfile.url(
                                        store.company.mention_tag,
                                        doc.source.professional_id ||
                                          doc.source.id,
                                        "documents"
                                      )
                                    : doc.source.type === "client"
                                    ? ROUTES.ClientProfile.url(
                                        store.company.mention_tag,
                                        doc.source.id,
                                        "documents"
                                      )
                                    : doc.source.type === "contact"
                                    ? ROUTES.ContactProfile.url(
                                        store.company.mention_tag,
                                        doc.source.id,
                                        "documents"
                                      )
                                    : doc.source.type === "deal"
                                    ? ROUTES.DealProfile.url(
                                        store.company.mention_tag,
                                        doc.source.id,
                                        "documents"
                                      )
                                    : ROUTES.ClientManager.url(
                                        store.company.mention_tag,
                                        crmTabs[doc.source.type]
                                      )
                                }
                                style={{ color: "#1e1e1e" }}
                              >
                                {doc.source.name}
                              </OverflowCell>
                            </div>
                          )}
                        </td>
                        <td className={sharedStyles.tableItemStatus}>
                          <ExtensionMenu>
                            <ExtensionMenuOption
                              onClick={() => {
                                window.open(doc.url);
                              }}
                            >
                              Download
                            </ExtensionMenuOption>
                            <ExtensionMenuOption
                              onClick={() => {
                                setSelectedDocIx(index);
                                setActiveModal("delete-document");
                              }}
                            >
                              Delete Document
                            </ExtensionMenuOption>
                          </ExtensionMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </InfiniteScroller>
      </EmptyTab>
      {redirect && <Redirect to={redirect} />}
      {activeModal === "delete-document" && selectedDocIx !== undefined && (
        <>
          <ConfirmModalV2
            id="confirm-delete-document"
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setSelectedDocIx(undefined);
            }}
            header="Delete this document"
            text="Are you sure you want to delete this document?"
            actionText="Delete"
            actionFunction={deleteDocument}
          />
        </>
      )}
    </ATSContainer>
  );
};

export default DocumentsTable;

const crmTabs = {
  deal: "deals",
  contact: "contacts",
  client: "companies",
};

const OverflowCell = styled(Link)`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const OptionLink = styled.a`
  color: black;
  text-decoration: none;

  &:hover,
  &:active {
    color: black;
    text-decoration: none;
  }
`;
