import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import Spinner from "sharedComponents/Spinner";
const InfiniteScroller = ({
  fetchMore,
  hasMore,
  children,
  dataLength,
  height,
  scrollableTarget,
}) => (
  <InfiniteScroll
    height={height}
    dataLength={dataLength} //This is important field to render the next data
    next={fetchMore}
    hasMore={hasMore}
    // loader={<Spinner />}
    endMessage={""}
    scrollableTarget={scrollableTarget}
    // below props only if you need pull down functionality
    // refreshFunction={fetchMore}
    // pullDownToRefresh={true}
    // pullDownToRefreshContent={
    //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
    // }
    // releaseToRefreshContent={
    //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
    // }
  >
    {children}
  </InfiniteScroll>
);

export default InfiniteScroller;
