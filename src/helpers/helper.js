import React from "react";
import { currentExperience } from "./professional/helper";
import { AWS_CDN_URL } from "constants/api";

export const fullStarIcon = (
  <div className="rating__star rating__star--active">
    <img src={`${AWS_CDN_URL}/icons/FullStarIcon.svg`} alt="Full Star" />
  </div>
);

export const emptyStarIcon = (
  <div className="rating__star rating__star--active">
    <img src={`${AWS_CDN_URL}/icons/EmptyStarIcon.svg`} alt="Empty Star" />
  </div>
);

export const halfStarIcon = (
  <div className="rating__star rating__star--inactive">
    <img src={`${AWS_CDN_URL}/icons/HalfStarIcon.svg`} alt="Half Star" />
  </div>
);

export function findManageable(manageableMentionTag, ownedManageables) {
  let foundManageable = undefined;

  for (let manageable of ownedManageables) {
    if (manageableMentionTag === manageable.mentionTag) {
      foundManageable = manageable;
      break;
    }
  }

  return foundManageable;
}

export function isManager(manageableMentionTag, ownedManageables) {
  let isManager = false;

  for (let manageable of ownedManageables) {
    isManager = manageableMentionTag === manageable.mentionTag;
    if (isManager) break;
  }
  // if(notifyCompletion){
  //   notifyCompletion({managerCheck: true})
  // }
  return isManager;
}

export function isCurrentJob(company, professional) {
  let currentJob = currentExperience(professional.experiences);
  let currentContractor = currentJob ? currentJob.contractor : undefined;

  if (
    currentContractor &&
    currentContractor.id === company.id &&
    currentContractor.type === company.type
  ) {
    return true;
  } else {
    return false;
  }
}

export function sameAsTheLoggedIn(fromProfile, fromSession) {
  let professional = fromSession;

  if (!objIsValid(professional)) return false;
  if (!objIsValid(fromProfile)) return false;

  let bool =
    fromProfile["email"] === professional["uid"] &&
    fromProfile["id"] === Number.parseInt(professional["id"]);

  return bool;
}

export function extractDataList(list, fields) {
  let extractedList = [];
  let fieldKeys = Object.keys(fields);

  for (let item of list) {
    let itemKeys = Object.keys(item);
    let extractedObject = {};

    for (let itemKey of itemKeys) {
      if (fieldKeys.includes(itemKey)) {
        extractedObject[fields[itemKey].newName] = item[itemKey];
      } else {
        extractedObject[itemKey] = item[itemKey];
      }
    }

    extractedList.push(extractedObject);
  }

  return extractedList;
}

export function objIsValid(object) {
  return object !== undefined && Object.keys(object).length > 0;
}

export function toArray(array) {
  if (array === undefined) return [];
  return array;
}

export function categoriesToString(categorizations) {
  if (categorizations === undefined || categorizations.length === 0) {
    return;
  }

  let categoriesNames = categorizations.map((categorization) => {
    if (categorization.name !== undefined) {
      return categorization.name;
    } else {
      return categorization.category.name;
    }
  });

  return categoriesNames.join(" / ");
}

export function localizationsToString(localizations) {
  if (localizations === undefined || localizations.length === 0) {
    return;
  }

  let locationsNames = localizations
    .filter((localization) => localization.location !== undefined)
    .map((localization) => localization.location.name);

  return locationsNames.join(" / ");
}

export function arrayToString(array, property) {
  if (array === undefined || array.length === 0) {
    return;
  }

  let list = array.map((element) => {
    return element[property];
  });

  return list.join(" / ");
}

export function objectToUrlParams(params) {
  if (params === undefined || Object.keys(params).length === 0) {
    return "";
  }

  let query = "?";
  query += Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");

  return query;
}

export function getStatistics(subject, receivedReviews) {
  let following = subject ? subject.followingCount : 0;
  let followers = subject ? subject.followersCount : 0;
  let reviews = receivedReviews ? receivedReviews.length : 0;
  let fiveStarReviews =
    (receivedReviews &&
      receivedReviews.filter((review) => {
        return review.rating === 5;
      }).length) ||
    0;

  return {
    following: following,
    followers: followers,
    reviews: reviews,
    fiveStarReviews: fiveStarReviews,
  };
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function mentionToId(mention) {
  // switch (mention.type) {
  //   case 'Professional':
  //     return mention.username
  //   case 'Employer':
  //     return `company/${mention.mentionTag}`
  //   case 'Agency':
  //     return `company/${mention.mentionTag}`
  //   default:
  //     throw new Error(`unsupported type '${mention.type}'`)
  //   }
  if (mention && mention.type) {
    switch (mention.type) {
      case "Professional":
        return mention.username;
      case "Employer":
        return `company/${mention.mentionTag}`;
      case "Agency":
        return `company/${mention.mentionTag}`;
      default:
        throw new Error(`unsupported type '${mention.type}'`);
    }
  } else {
    return mention.username;
  }
}

export const extractMentions = (mentions) =>
  mentions.map((mention) => ({
    id: mentionToId(mention),
    display: mention.name,
  }));
