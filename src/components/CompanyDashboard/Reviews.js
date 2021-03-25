import React, { useEffect, useState } from "react";
import ReviewPost from "./DashboardTabs/ReviewPost";
import styled from "styled-components";
import { fetchCompanyReviews } from "helpers/company/company.helpers";
import InfiniteScroller from "sharedComponents/InfiniteScroller";

const Reviews = ({ session, company }) => {
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsTotal, setReivewsTotal] = useState(-1);
  const [reviewsPage, setReviewsPage] = useState(1);

  const getCompanyReviews = async (companyId, reviewsPage) => {
    const reviews = await fetchCompanyReviews(companyId, reviewsPage, session);
    let nextPage = reviewsPage;
    if (reviews && reviews.list) {
      let nextReviews = [...reviewsList, ...reviews.list];
      nextPage = reviewsPage + 1;
      setReviewsList([...nextReviews]);
      setReivewsTotal(reviews.total);

      if (nextReviews.length === reviews.total) {
        return false;
      }
    }
    return nextPage;
  };

  useEffect(() => {
    if (reviewsPage < 3)
      getCompanyReviews(company.id, reviewsPage).then((newPage) =>
        newPage === 2 ? setReviewsPage(newPage) : false
      );
    // eslint-disable-next-line
  }, [company.id, reviewsPage]);

  const onFeedScroll = () => {
    getCompanyReviews(company.id, reviewsPage).then((response) =>
      response ? setReviewsPage(response) : false
    );
  };

  return (
    <>
      <InfiniteScroller
        fetchMore={onFeedScroll}
        hasMore={reviewsList && reviewsList.length < reviewsTotal}
        dataLength={reviewsList.length}
      >
        <ActivitiesGrid>
          {reviewsList?.length > 0 &&
            reviewsList.map((review) => (
              <ReviewPost key={review.id} review={review} company={company} />
            ))}
        </ActivitiesGrid>
      </InfiniteScroller>
    </>
  );
};

export default Reviews;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  // grid-auto-rows: minmax(200px, 1fr);
  grid-auto-rows: auto;
  padding-bottom: 5px;
  grid-auto-flow: dense;
`;
