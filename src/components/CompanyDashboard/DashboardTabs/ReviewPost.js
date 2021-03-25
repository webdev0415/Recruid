import React from "react";
// import { Link } from "react-router-dom";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";
import ProfileRating from "sharedComponents/profile/ProfileRating";

const ReviewContainer = styled.div`
  padding: 15px;
`;

const ReviewHeader = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center leo-relative",
}))`
  margin-bottom: 15px;

  h4 {
    color: #1f1f1f;
    font-size: 16px;
    font-weight: 500;
  }

  p {
    color: #74767b;
    font-size: 12px;

    span {
      color: #1f1f1f;
      display: inline;
      /* font-weight: 500; */
    }
  }
`;

const ReviewAvatar = styled.div`
  margin-right: 15px;
`;

const ReviewTime = styled.div`
  font-size: 10px;
  position: absolute;
  right: 0;
  top: 0;

  a {
    color: #9a9ca1;
  }
`;

const ReviewBody = styled.div`
  p {
    border-bottom: 1px solid #eee;
    margin-bottom: 15px !important;
    margin-top: 5px !important;
    padding-bottom: 15px !important;
  }
`;

const ReviewPost = ({ review, company }) => {
  return (
    <Container>
      <ReviewContainer>
        <ReviewHeader>
          <ReviewAvatar>
            <AvatarIcon
              name={review.author.name}
              imgUrl={review.author.avatarUrl}
              size={50}
            />
          </ReviewAvatar>
          <div>
            <h4>{review.author.name}</h4>
            <p>
              {review.affiliate && review.affiliate.name ? (
                company.name === review.affiliate.name ? (
                  <>
                    Reviewed <span>{review.reviewable.name}</span> from your
                    company
                  </>
                ) : (
                  <>
                    Reviewed <span>{review.affiliate.name}</span> from your
                    company
                  </>
                )
              ) : (
                "Reviewed your company"
              )}
            </p>
          </div>
          <ReviewTime>{review.timeAgo}</ReviewTime>
        </ReviewHeader>
        <ReviewBody>
          <p>{review.body}</p>
          <ProfileRating averageRating={review.rating} />
        </ReviewBody>
      </ReviewContainer>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;

  @media screen and (min-width: 768px) {
    margin-bottom: 0;
  }
`;

export default ReviewPost;
