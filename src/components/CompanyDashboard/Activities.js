import React, { useEffect, useState, Fragment } from "react";
import { Media, Player } from "react-media-player";
import { PermissionChecker } from "constants/permissionHelpers";
import { handlePostEdit } from "helpers/company/company.helpers";
import styled from "styled-components";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { PDFReader } from "reactjs-pdf-reader";

import {
  fetchCompanyActivities,
  handlePostDelete,
} from "helpers/company/company.helpers";

import ConfirmModalV2 from "modals/ConfirmModalV2";

import AvatarIcon from "sharedComponents/AvatarIcon";
import notify from "notifications";

const Activities = ({ companyId, session, nextActivity }) => {
  const [activitiesList, setActivitiesList] = useState([]);
  const [activitiesTotal, setActivitiesTotal] = useState(-1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (companyId) {
      getCompanyActivities(companyId, activitiesPage).then((response) =>
        response ? setActivitiesPage(response) : false
      );
    }
  }, [companyId]);

  const onModalOpen = async (postId) => {
    await Promise.resolve(setDeleteTargetId(postId));
    await Promise.resolve(setShowConfirmation(true));
  };

  const onModalClose = () => {
    setShowConfirmation(false);
    setDeleteTargetId(null);
  };

  const getCompanyActivities = async (companyId, activitiesPage) => {
    const activities = await fetchCompanyActivities(
      companyId,
      activitiesPage,
      session
    );
    if (!activities?.list)
      return notify(
        "danger",
        "Failed to get the list of activities from the server"
      );
    let nextActivities = [...activitiesList, ...activities.list];
    let nextPage = activitiesPage + 1;

    setActivitiesList([...nextActivities]);
    setActivitiesTotal(activities.total);

    if (nextActivities.length === activities.total) {
      return false;
    }
    return nextPage;
  };

  useEffect(() => {
    if (nextActivity) {
      setActivitiesList([nextActivity, ...activitiesList]);
    }
  }, [nextActivity]);

  const onFeedScroll = () => {
    getCompanyActivities(companyId, activitiesPage).then((response) =>
      response ? setActivitiesPage(response) : false
    );
  };

  const onPostDelete = () => {
    if (!deleteTargetId) return false;
    handlePostDelete(companyId, deleteTargetId, session).then((res) => {
      if (res.id) {
        setActivitiesList((posts) =>
          posts.filter((post) => post.subject.id !== deleteTargetId)
        );
        onModalClose();
      } else notify("danger", res.error);
    });
  };

  const handlePostBodyChange = (e) => {
    let value = e.target.value;
    setEditTarget((target) => {
      return {
        ...target,
        subject: { ...target.subject, body: value },
      };
    });
  };

  const enableEditMode = (post) => setEditTarget({ ...post });

  const disableEditMode = () => setEditTarget(null);

  const updateActivities = (updatedActivity, idx) =>
    setActivitiesList((activities) => {
      let nextActivities = [...activities];
      nextActivities[idx].subject.body = updatedActivity.body;
      return nextActivities;
    });

  const onPostEdit = async (companyId, editTarget, session, index) => {
    if (!editTarget.subject.body.length) {
      notify("danger", "Post content can not be blank");
      return false;
    }
    const editResponse = await handlePostEdit(
      companyId,
      editTarget.subject.id,
      editTarget.subject.body,
      session
    );
    if (!editResponse.error) {
      updateActivities(editResponse, index);
      return disableEditMode();
    }
    return notify("danger", editResponse.error);
  };

  return (
    <>
      <InfiniteScroller
        fetchMore={onFeedScroll}
        hasMore={activitiesList && activitiesList.length < activitiesTotal}
        dataLength={activitiesList.length}
      >
        <ActivitiesGrid>
          {activitiesList?.length > 0 &&
            activitiesList.map((post, i) => (
              <ActivityPost
                post={post}
                i={i}
                key={`post-${i}`}
                enableEditMode={enableEditMode}
                disableEditMode={disableEditMode}
                onModalOpen={onModalOpen}
                editTarget={editTarget}
                handlePostBodyChange={handlePostBodyChange}
                onPostEdit={onPostEdit}
                companyId={companyId}
                session={session}
              />
            ))}
        </ActivitiesGrid>
      </InfiniteScroller>
      {showConfirmation && (
        <ConfirmModalV2
          show={true}
          hide={onModalClose}
          header="Delete Post"
          text="Are you sure you want to delete this post? You can not undo this action."
          actionText="Delete"
          actionFunction={onPostDelete}
        />
      )}
    </>
  );
};

export default Activities;

const ActivityPost = ({
  post,
  i,
  enableEditMode,
  disableEditMode,
  onModalOpen,
  editTarget,
  handlePostBodyChange,
  onPostEdit,
  companyId,
  session,
}) => {
  return (
    <PostContainer
      className={`${
        post.subject.post_images?.length > 0 || post.subject.meta_data?.url
          ? "large"
          : ""
      } ${post.subject.post_documents?.length > 0 ? "pdf" : 0} leo-relative`}
    >
      {post.subject?.post_images?.length > 0 &&
        (post.subject.post_images[0].type === "image" ? (
          <ActivityImage>
            <img
              src={post.subject.post_images[0].media.original_url}
              alt={post.author.name}
            />
          </ActivityImage>
        ) : (
          <ActivityVideo className="leo-relative">
            <Media>
              <div className="media">
                <PlayerWrapper className="media-player leo-flex">
                  <Player
                    defaultMuted={true}
                    autoPlay={true}
                    src={post.subject.post_images[0].media.original_url}
                  />
                </PlayerWrapper>
              </div>
            </Media>
          </ActivityVideo>
        ))}
      {post.subject?.post_images?.length === 0 &&
        post.subject?.post_documents?.length > 0 && (
          // eslint-disable-next-line
          <a
            href={post.subject?.post_documents[0].media_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FileWrapper className="leo-flex">
              <PDFReader
                key={post.subject?.post_documents[0].media_url}
                url={post.subject?.post_documents[0].media_url}
                scale={0.6}
              />
            </FileWrapper>
          </a>
        )}
      <ActivityWrapper>
        <ActivityHeader
          className={
            (!!post.subject &&
            !!post.subject.post_images &&
            !!post.subject.post_images.length &&
            post.subject.post_images[0].type === "video"
              ? "video"
              : "") + " leo-flex"
          }
        >
          <div style={{ marginRight: "15px" }}>
            <AvatarIcon
              name={post.author.name}
              imgUrl={post.author.avatar_url}
              size="40"
            />
          </div>
          <div>
            <h5>{post.author.name}</h5>
            <span>
              {post.author.localizations &&
                post.author.localizations.length > 0 && (
                  <>{post.author.localizations[0].location.name} · </>
                )}
              <span>{post.time_ago}</span>
            </span>
          </div>
          <PermissionChecker type="view">
            <ExtensionMenu style={{ marginRight: 0 }}>
              <ExtensionMenuOption onClick={() => enableEditMode(post)}>
                Edit Post
              </ExtensionMenuOption>
              <ExtensionMenuOption onClick={() => onModalOpen(post.subject.id)}>
                Delete Post
              </ExtensionMenuOption>
            </ExtensionMenu>
          </PermissionChecker>
        </ActivityHeader>
        {(!editTarget || editTarget.id !== post.id) && (
          <ActivityPostBody
            className={`${
              !!post.subject &&
              !!post.subject.meta_data &&
              !!post.subject.meta_data.url &&
              "link"
            } ${
              !!post.subject &&
              !!post.subject.post_images &&
              !!post.subject.post_images.length &&
              !!post.subject.post_images[0] &&
              "image"
            }`}
          >
            {post.subject.body}
          </ActivityPostBody>
        )}
        {!!editTarget && editTarget.id === post.id && (
          <Fragment>
            <TextArea
              value={editTarget.subject.body}
              onChange={handlePostBodyChange}
              className="form-control"
            />
            <div>
              <div>
                <button
                  key={2}
                  className="edit-post__button button button--small button--primary"
                  onClick={() => onPostEdit(companyId, editTarget, session, i)}
                >
                  Save
                </button>
                <button
                  className="button button--small button--grey"
                  onClick={disableEditMode}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Fragment>
        )}
        {!!post.subject &&
          !!post.subject.meta_data &&
          post.subject.meta_data.url && (
            <LinkPreview>
              <a
                target="_blank"
                href={post.subject.meta_data.url}
                rel="noopener noreferrer"
              >
                <img
                  src={post.subject.meta_data.image_url}
                  alt="Preview"
                  className="leo-relative"
                />
                <LinkPreviewDetails className="leo-relative">
                  <p>{post.subject.meta_data.description}</p>
                  <span className="link">{post.subject.meta_data.url}</span>
                </LinkPreviewDetails>
              </a>
            </LinkPreview>
          )}
      </ActivityWrapper>
    </PostContainer>
  );
};

const LinkPreview = styled.div`
  background: #ffffff;
  box-shadow: 0 0 2px 0px #a8abb1;
  border-radius: 4px;
  margin-top: 15px;

  a {
    &:hover {
      text-decoration: none;
    }
  }

  img {
    background: #ffffff;
    border-bottom: 1px solid #f4f5f5;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    max-height: 140px;
    object-fit: cover;
    left: -1px;
    right: -1px;
    top: -1px;
    width: calc(100% + 2px);
  }
`;

const LinkPreviewDetails = styled.div`
  border-top: 0;
  color: #1e1e1e;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  padding: 10px 10px;
  top: -2px;

  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  .link {
    color: #74767b;
    font-size: 12px;
    font-weight: 400;
    margin-top: 5px;
  }
`;

const PlayerWrapper = styled.div`
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ActivityHeader = styled.div`
  align-items: center;
  line-height: 1;
  margin-bottom: 15px;

  h5 {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 1px;
  }

  span {
    color: #9a9ca1;
    font-size: 12px;

    a {
      color: #9a9ca1;
    }
  }

  &.video {
    background: rgba(255, 255, 255, 1);
    width: 100%;
  }
`;

const ActivityWrapper = styled.div`
  padding: 15px;
`;

const ActivityImage = styled.div`
  max-height: 350px;
  overflow: hidden;
  border-radius: 4px 4px 0px 0px;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;

const ActivityVideo = styled.div`
  background: #000;
  overflow: hidden;
  border-radius: 4px 4px 0px 0px;

  video {
    height: 100%;
    // min-height: 220px;
    // max-height: 220px;
    max-height: 300px;
    object-fit: cover;
    object-position: center;
  }
`;

const ActivityPostBody = styled.p`
  // -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  white-space: pre-wrap;

  &.link {
    display: -webkit-box;
    // -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &.image {
    // -webkit-line-clamp: 5;
  }
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  // grid-auto-rows: minmax(200px, 1fr);
  grid-auto-rows: auto;
  padding-bottom: 5px;
  grid-auto-flow: dense;
`;

const PostContainer = styled.div`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  grid-row: span 1;
  width: 100%;

  &.large {
    // grid-row: span 2;
  }
  &.pdf {
    // grid-row: span 3;
  }
`;

const TextArea = styled.textarea`
  resize: none;
`;

const FileWrapper = styled.div`
  align-items: center;
  justify-content: center;
  min-height: 300px;
  max-height: 300px;
  // overflow: scroll;
  overflow: hidden;
  border-radius: 4px 4px 0px 0px;
`;
