import React, { useState, Suspense } from "react";
import notify from "notifications";
import styled from "styled-components";
import { PermissionChecker } from "constants/permissionHelpers";
import { handleCompanyPostCreate } from "helpersV2/posts";
import retryLazy from "hooks/retryLazy";
const ProfilePostBox = React.lazy(() =>
  retryLazy(() =>
    import("components/CompanyDashboard/DashboardTabs/ProfilePostBox")
  )
);

const Reviews = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/Reviews"))
);
const Activities = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/Activities"))
);

const ReviewsFeedContainer = ({ store }) => {
  const [activeModal, setActiveModal] = useState(undefined);
  const [feedTab, setFeedTab] = useState("feed");
  const [nextActivity, setNextActivity] = useState(undefined);

  const handlePostCreate = (activity) => {
    handleCompanyPostCreate(store.session, store.company.id, activity).then(
      (res) => {
        if (!res.err) {
          Promise.resolve(
            setNextActivity({
              action: "post_created",
              author: {
                avatar_url: store.company.avatar_url,
                id: store.company.id,
                localizations: store.company.localizations,
                name: store.company.name,
                type: store.company.type,
                mention_tag: store.company.mention_tag,
                owns: true,
              },
              comments: [],
              comments_count: 0,
              id: res.activityId,
              currentProfessionalIsConfirmed: true,
              likes: [],
              likes_count: 0,
              subject: { ...res },
              post_images: res.post_images,
              post_documents: res.post_documents,
              seen_by: [],
              time_ago: "Just now",
              written_by: {
                author_type: "Employer",
                avatar_url: store.company.avatar_url,
                id: store.session.id,
                name: store.company.name,
                type: store.company.type,
                username: store.company.username,
                localizations: store.company.localizations,
                mention_tag: store.company.mention_tag,
                time_ago: "Just now",
              },
            })
          );
          setActiveModal(undefined);
          // this.setState({ nextActivity: null, activeModal: null });
          return;
        } else {
          notify("danger", res);
        }
      }
    );
  };

  return (
    <>
      <Menu>
        <ul className="leo-flex">
          <li>
            <button
              className={`option ${feedTab === "feed" ? "active" : ""}`}
              onClick={() => setFeedTab("feed")}
            >
              Posts
            </button>
            <PermissionChecker type="view">
              <button
                className="post"
                onClick={() => setActiveModal("activityModal")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <g fill="none" fill-role="evenodd">
                    <rect fill="#9A9CA1" width="18" height="18" rx="2" />
                    <path
                      d="M14 8h-4V4a1 1 0 10-2 0v4H4a1 1 0 000 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2"
                      fill="#FFF"
                    />
                  </g>
                </svg>
              </button>
            </PermissionChecker>
          </li>

          <li>
            <button
              className={`option ${feedTab === "reviews" ? "active" : ""}`}
              onClick={() => setFeedTab("reviews")}
            >
              Reviews
            </button>
          </li>
        </ul>
      </Menu>
      {feedTab === "feed" && (
        <Suspense fallback={<div />}>
          <Activities
            companyId={store.company?.id}
            session={store.session}
            nextActivity={nextActivity}
          />
        </Suspense>
      )}
      {feedTab === "reviews" && (
        <Suspense fallback={<div />}>
          <Reviews company={store.company} session={store.session} />
        </Suspense>
      )}
      {activeModal === "activityModal" && (
        <Suspense fallback={<div />}>
          <ProfilePostBox
            ownedCompanies={store.allMyCompanies || []}
            handlePostCreate={handlePostCreate}
            company={store.company}
            session={store.session}
            hide={() => setActiveModal(undefined)}
          />
        </Suspense>
      )}
    </>
  );
};

export default ReviewsFeedContainer;

const Menu = styled.div`
  margin-bottom: 20px;

  ul {
    border-bottom: 1px solid #d8d8d8;
  }

  li {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }

    button {
      border-bottom: 2px solid transparent;
      color: #74767b !important;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: -1px;

      &.active {
        border-bottom: 2px solid #1e1e1e;
        color: #1e1e1e !important;
        padding-bottom: 10px;
      }

      &:hover {
        color: #1e1e1e !important;
      }

      &.post {
        margin-left: 10px;
      }
    }
  }
`;
