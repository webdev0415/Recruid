import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";

import ActivityTextPost from "sharedComponents/activities/ActivityTextPost.jsx";
import ActivityReviewPost from "sharedComponents/activities/ActivityReviewPost";
import JobSharePost from "sharedComponents/activities/JobSharePost";
// import PostModal from "sharedComponents/post/PostModal";
import { AWS_CDN_URL } from "constants/api";
import Spinner from "sharedComponents/Spinner";

class ProfileFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: {},
      activity: {},
      imageUrl: undefined,
      index: undefined,
      hasMoreActivities: false,
      totalNumberOfActivities: 0,
    };

    this.handlePostImageClick = this.handlePostImageClick.bind(this);
  }

  // hasMorePages = () => {
  //   if(this.state.activitiesList.length === this.state.totalNumberOfActivities) {
  //     return false;
  //   } else if(this.state.activitiesList.length < this.state.totalNumberOfActivities) {
  //     return true;
  //   }
  // };

  handlePostImageClick(activity, imageUrl, index) {
    this.setState({ activity, imageUrl, index, post: activity.subject });
  }

  renderActivities() {
    let elements = [];
    this.props.activitiesList &&
      this.props.activitiesList.length > 0 &&
      this.props.activitiesList.map((activity, index) => {
        if (activity.action === "post_created") {
          elements.push(
            <ActivityTextPost
              session={
                this.props.session && Object.keys(this.props.session).length
                  ? this.props.session
                  : undefined
              }
              followedProfessionals={this.props.followedProfessionals}
              followedCompanies={this.props.followedCompanies}
              key={index}
              index={index}
              activity={activity}
              handlePostDelete={this.props.handlePostDelete}
              handlePostUpdate={this.props.handlePostUpdate}
              handlePostImageClick={this.handlePostImageClick}
              handleCommentCreate={this.props.handleCommentCreate}
              handleCommentUpdate={this.props.handleCommentUpdate}
              handleCommentDelete={this.props.handleCommentDelete}
              handleLikeCreate={this.props.handleLikeCreate}
              handleLikeDelete={this.props.handleLikeDelete}
              handleHighlightCreate={this.props.handleHighlightCreate}
              moreComments={this.props.moreComments}
              authors={this.props.authors}
            />
          );
          return null;
        } else if (activity.action === "review_created") {
          elements.push(
            <ActivityReviewPost
              session={
                this.props.session && Object.keys(this.props.session).length
                  ? this.props.session
                  : undefined
              }
              key={index}
              index={index}
              activity={activity}
              followedProfessionals={this.props.followedProfessionals}
              followedCompanies={this.props.followedCompanies}
              handleCommentCreate={this.props.handleCommentCreate}
              handleCommentUpdate={this.props.handleCommentUpdate}
              handleCommentDelete={this.props.handleCommentDelete}
              handleLikeCreate={this.props.handleLikeCreate}
              handleLikeDelete={this.props.handleLikeDelete}
              moreComments={this.props.moreComments}
              authors={this.props.authors}
              onUpdate={(rating, body) =>
                this.props.onUpdate(activity.subject, rating, body)
              }
              onDelete={() => this.props.onDelete(activity.subject)}
            />
          );
          return null;
        } else if (activity.action === "job_post_shared") {
          elements.push(
            <JobSharePost
              session={
                this.props.session && Object.keys(this.props.session).length
                  ? this.props.session
                  : undefined
              }
              key={index}
              index={index}
              activity={activity}
              followedProfessionals={this.props.followedProfessionals}
              followedCompanies={this.props.followedCompanies}
              handleCommentCreate={this.props.handleCommentCreate}
              handleCommentUpdate={this.props.handleCommentUpdate}
              handleCommentDelete={this.props.handleCommentDelete}
              handleLikeCreate={this.props.handleLikeCreate}
              handleLikeDelete={this.props.handleLikeDelete}
              handleFollowButtonClick={this.props.handleFollowButtonClick}
              moreComments={this.props.moreComments}
              authors={this.props.authors}
              onUpdate={(rating, body) =>
                this.props.onUpdate(activity.subject, rating, body)
              }
              onDelete={() => this.props.onDelete(activity.subject)}
              handleJobPostDelete={this.props.handleJobPostDelete}
            />
          );
          return null;
        }
        return null;
      });
    return elements;
  }

  render() {
    return (
      <div>
        <div className="activity-feed">
          {this.props.activityReqCompleted ? (
            this.props.activitiesList &&
            this.props.activitiesList.length > 0 ? (
              <>
                <InfiniteScroll
                  pageStart={1}
                  hasMore={false}
                  loadMore={() => {}}
                >
                  {this.renderActivities()}
                </InfiniteScroll>
                {this.props.activitiesList.length > 10 && (
                  <div
                    style={{
                      marginTop: "20px",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Link
                      to={ROUTES.CompanyDashboard.url(
                        this.props.company.mention_tag
                      )}
                    >
                      See more activities
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="profile-content__description text-center">
                <div>
                  <img
                    alt=""
                    src={`${AWS_CDN_URL}/icons/empty-icons/feed.svg`}
                    title="You haven't posted anything yet"
                    style={{ margin: "20px 0", maxWidth: "200px" }}
                  />
                </div>
                {`You haven't posted anything yet.`}
              </div>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}

export default ProfileFeed;
