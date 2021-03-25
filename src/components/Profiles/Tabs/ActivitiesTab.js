import React from "react";
import spacetime from "spacetime";

import AvatarIcon from "sharedComponents/AvatarIcon";
import EmptyTab from "components/Profiles/components/EmptyTab";
import { EmptyActivity } from "assets/svg/EmptyImages";
import {
  ActivityItem,
  ActivityDetails,
  ActivityDate,
} from "components/Profiles/components/ProfileComponents.js";

const ActivityTab = ({ interactions, children }) => {
  return (
    <>
      <EmptyTab
        data={interactions}
        title={"This candidates has no activities."}
        copy={"Do something with it!"}
        image={<EmptyActivity />}
      >
        {interactions && interactions.length > 0 && <>{children}</>}
      </EmptyTab>
    </>
  );
};

export const ActivityItems = ({ interaction, children }) => {
  return (
    <ActivityItem>
      <AvatarIcon name={interaction.sender} size="50" />
      <ActivityDetails>
        <p>
          <strong>{interaction.sender}</strong>
          {children}
        </p>
        <ActivityDate>
          {spacetime(new Date(interaction.created_at)).format(
            "{time} {date} {month}, {year}"
          )}
        </ActivityDate>
      </ActivityDetails>
    </ActivityItem>
  );
};

export default ActivityTab;
