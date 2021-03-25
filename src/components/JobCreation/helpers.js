export const isHtmlStringEmpty = (string) => {
  return string.replace(/(<([^>]+)>)/gi, "") === "";
};

export const findSomeLocation = (
  originalLocations,
  localizations_attributes
) => {
  let location;
  if (originalLocations) {
    let i = -1;
    while (i < originalLocations.length - 1 && location === undefined) {
      i++;
      let deleteMatch;
      if (localizations_attributes && localizations_attributes.length > 0) {
         
        localizations_attributes.map((loc) => {
          if (
            loc.id === originalLocations[i]?.localization_id &&
            loc._destroy === true
          ) {
            deleteMatch = true;
          }
          return null;
        });
      }
      if (!deleteMatch) {
        location = originalLocations[i];
      }
    }
  }
  if (
    !location &&
    localizations_attributes &&
    localizations_attributes.length > 0
  ) {
    let ind = -1;
    while (
      location === undefined &&
      ind < localizations_attributes.length - 1
    ) {
      ind++;
      if (!localizations_attributes[ind]._destroy) {
        location = localizations_attributes[ind];
      }
    }
  }
  return location ? location.name || location.location_attributes?.name : "";
};
