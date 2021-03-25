import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";

import { fullStarIcon, halfStarIcon, emptyStarIcon } from "helpers/helper";

class ProfileRating extends Component {
  render() {
    if (this.props.averageRating === 0) {
      return <div></div>;
    } else {
      return (
        <div className="profile-info__rating">
          <span className="info-rating__number">
            {this.props.averageRating}
          </span>
          <div className="info-rating__stars">
            <StarRatingComponent
              name={"profileRating"}
              value={this.props.averageRating}
              editing={false}
              renderStarIcon={(index, value) =>
                index <= value ? fullStarIcon : emptyStarIcon
              }
              renderStarIconHalf={() => halfStarIcon}
            />
          </div>
        </div>
      );
    }
  }
}

export default ProfileRating;
