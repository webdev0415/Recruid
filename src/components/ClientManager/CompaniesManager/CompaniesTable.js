import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import spacetime from "spacetime";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import MarketingEmailModal from "modals/MarketingEmailModal";

import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import Marquee from "sharedComponents/Marquee";
import StatusSelect from "sharedComponents/StatusSelect";
import { clientStatusOptions } from "constants/statusOptions";
import { permissionChecker } from "constants/permissionHelpers";
import { changeClientStatus } from "helpersV2/vendors/clients";
import notify from "notifications";

const CompaniesTable = ({
  companies,
  setCompanies,
  loadMore,
  hasMore,
  openModal,
  setCompanyIndex,
  selectedCompanies,
  closeModal,
  activeModal,
}) => {
  const store = useContext(GlobalContext);
  const [selectAll, setSelectAll] = useState(false);

  const selectContact = (index) => {
    let newContacts = [...companies];
    newContacts[index].selected = newContacts[index].selected ? false : true;
    setCompanies(newContacts);
  };

  useEffect(() => {
    if (companies) {
      let newContacts = [...companies];
      newContacts = newContacts.map((company) => {
        company.selected = selectAll;
        return company;
      });
      setCompanies(newContacts);
    }
  }, [selectAll]);

  const clearSelected = () => {
    let newContacts = [...companies];
    newContacts = newContacts.map((contact) => {
      contact.selected = false;
      return contact;
    });
    setSelectAll(false);
    setCompanies(newContacts);
  };

  const changeStatus = (status, index) => {
    changeClientStatus(store.session, companies[index].layer_id, {
      status,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Status succesfully changed");
        let newCompanies = [...companies];
        newCompanies[index] = { ...newCompanies[index], status };
        setCompanies(newCompanies);
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className="table-responsive">
          <InfiniteScroller
            fetchMore={loadMore}
            hasMore={hasMore}
            dataLength={companies.length}
          >
            <table className="table table-borderless">
              <thead>
                <tr>
                  {(store.role?.role_permissions.owner ||
                    (store.role?.role_permissions.admin &&
                      store.role?.role_permissions.business)) && (
                    <th scope="col" className={sharedStyles.tableItemCheckBox}>
                      <button
                        className={styles.professionalCheckbox}
                        style={{
                          background: selectAll ? "#60CCA7" : "none",
                        }}
                        onClick={() => setSelectAll(!selectAll)}
                      >
                        {selectAll && (
                          <span className={styles.professionalCheckboxActive} />
                        )}
                      </button>
                    </th>
                  )}
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Company Name
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Location
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Industry
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Status
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Created
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader} />
                </tr>
              </thead>
              <tbody>
                {companies &&
                  companies.map((company, index) => {
                    return (
                      <tr key={`company_${index}`} className="table-row-hover">
                        {(store.role?.role_permissions.owner ||
                          (store.role?.role_permissions.admin &&
                            store.role?.role_permissions.business)) && (
                          <td className={sharedStyles.tableItem}>
                            <button
                              className={styles.professionalCheckbox}
                              style={{
                                background: company.selected
                                  ? "#60CCA7"
                                  : "none",
                              }}
                              onClick={() => selectContact(index)}
                            >
                              {company.selected && (
                                <span
                                  className={styles.professionalCheckboxActive}
                                />
                              )}
                            </button>
                          </td>
                        )}
                        <th scope="row" className={sharedStyles.tableItemFirst}>
                          <Link
                            className={styles.name}
                            to={ROUTES.ClientProfile.url(
                              store.company.mention_tag,
                              company.client_id
                            )}
                          >
                            <Marquee
                              height="25"
                              width={{
                                s: 100,
                                m: 150,
                                l: 200,
                                xl: 250,
                              }}
                            >
                              {company.company_name}
                            </Marquee>
                          </Link>
                        </th>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          <Marquee
                            height="25"
                            width={{
                              s: 100,
                              m: 100,
                              l: 150,
                              xl: 200,
                            }}
                          >
                            {company.location}
                          </Marquee>
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          <Marquee
                            height="25"
                            width={{
                              s: 100,
                              m: 100,
                              l: 150,
                              xl: 200,
                            }}
                          >
                            {company.industry}
                          </Marquee>
                        </td>
                        <td className={sharedStyles.tableItem}>
                          <StatusSelect
                            selectedStatus={company.status}
                            statusOptions={clientStatusOptions}
                            onStatusSelect={(status) => {
                              changeStatus(status, index);
                            }}
                            disabled={
                              !permissionChecker(store.role?.role_permissions, {
                                business: true,
                              }).edit
                            }
                          />
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {spacetime(company.created_at).format(
                            "{date} {month-short}, {year}"
                          )}
                        </td>
                        <td className={sharedStyles.tableItemStatus}>
                          <ExtensionMenu>
                            <ExtensionMenuOption>
                              <Link
                                to={ROUTES.ClientProfile.url(
                                  store.company.mention_tag,
                                  company.client_id
                                )}
                              >
                                View Company
                              </Link>
                            </ExtensionMenuOption>
                            {(store.role?.role_permissions.owner ||
                              (store.role?.role_permissions.admin &&
                                store.role?.role_permissions.business)) && (
                              <ExtensionMenuOption
                                onClick={() => {
                                  setCompanyIndex(index);
                                  openModal("delete_company");
                                }}
                              >
                                Delete Company
                              </ExtensionMenuOption>
                            )}
                          </ExtensionMenu>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </InfiniteScroller>
        </div>
      </div>
      {activeModal === "create-email" && (
        <MarketingEmailModal
          hide={() => {
            closeModal();
            clearSelected();
          }}
          receivers={selectedCompanies}
          source="client"
        />
      )}
    </>
  );
};
export default CompaniesTable;
