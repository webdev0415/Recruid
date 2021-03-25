import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import { fetchGetEmails } from "helpersV2/marketing/emails";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import spacetime from "spacetime";

const LatestEmails = ({ store }) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const [emails, setEmails] = useState(undefined);

  useEffect(() => {
    //fetch emails
    if (
      store.company &&
      (store.role?.role_permissions.owner ||
        store.role?.role_permissions.admin ||
        store.role?.role_permissions.marketer)
    ) {
      fetchGetEmails(
        store.session,
        store.company.id,
        { archive: false, is_draft: "sent" },
        [0, 10],
        signal
      ).then((res) => {
        if (!res.err) {
          setEmails(res);
        } else if (!signal.aborted) {
          setEmails(false);
          notify("danger", "Unable to fetch emails");
        }
      });
    }
    return () => controller.abort();
     
  }, [store.session, store.company, store.role]);

  return (
    <>
      {emails && (
        <>
          <HeaderText>Latest Emails</HeaderText>
          <div className={styles.container}>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Email
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Status
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Open Rate
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Click Rate
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Recipients
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Sent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emails &&
                    emails.map((email, index) => {
                      // const emailSentAt = new Date(
                      //   email.email.created_at
                      // );
                      // const emailCategory =
                      //   emailSentAt.getTime() > UPDATE_BOUNDARY.getTime()
                      //     ? `${ENV}-email-${email.email.uuid}`
                      //     : `email-${email.email.id}`;
                      return (
                        <tr
                          key={`row-email-${index}`}
                          className="table-row-hover"
                        >
                          <td className={sharedStyles.tableItemFirst}>
                            <STlink
                              to={ROUTES.EmailProfile.url(
                                store.company.mention_tag,
                                email.email.id
                              )}
                            >
                              {email.email.subject}
                            </STlink>
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {email.email.is_draft ? (
                              <DraftButton className="label-draft">
                                Draft
                              </DraftButton>
                            ) : (
                              <DraftButton>Sent</DraftButton>
                            )}
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {!email.email.is_draft && (
                              <>
                                {email?.stats?.unique_opens &&
                                email?.email.receivers?.length
                                  ? Math.floor(
                                      (email?.stats?.unique_opens * 100) /
                                        email?.email.receivers?.length
                                    )
                                  : 0}
                                %
                              </>
                            )}
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {!email.email.is_draft && (
                              <>
                                {email?.stats?.unique_clicks &&
                                email?.email.receivers?.length
                                  ? Math.floor(
                                      (email?.stats?.unique_clicks * 100) /
                                        email?.email.receivers?.length
                                    )
                                  : 0}
                                %
                              </>
                            )}
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {!email.email.is_draft && (
                              <>{email?.email.receivers?.length}</>
                            )}
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {email.email.is_draft
                              ? ""
                              : `${spacetime(email.email.updated_at).format(
                                  "{date} {month-short}, {year}"
                                )}`}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const STlink = styled(Link)`
  color: black;
  text-decoration: none;

  &:hover {
    color: black;
    text-decoration: none;
  }
`;

const DraftButton = styled.div`
  background: #35c3ae;
  border-radius: 15px;
  color: white;
  display: inline;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;

  &.label-draft {
    background: #74767b;
  }
`;

const HeaderText = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: #74767b;
  margin-bottom: 0px;
`;

export default LatestEmails;
