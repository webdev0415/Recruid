import React from "react";

import EmptyTab from "components/Profiles/components/EmptyTab";
import InfoCard from "components/Profiles/components/InfoCard";
import { ROUTES } from "routes";
import { EmptyContacts } from "assets/svg/EmptyImages";
const ContactsTab = ({
  contacts,
  store,
  setInnerModal,
  setRedirect,
  removeContact,
  canEdit,
}) => {
  //here is a comment for merge
  return (
    <EmptyTab
      data={contacts}
      title={"We couldn't find contacts for this profile."}
      copy={"Why don't you create one?"}
      image={<EmptyContacts />}
      action={canEdit ? () => setInnerModal("create_contact") : undefined}
      actionText="Create Contact"
    >
      {canEdit && (
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            className="button button--default button--blue-dark"
            onClick={() => setInnerModal("create_contact")}
          >
            Create Contact
          </button>
        </div>
      )}

      {contacts &&
        contacts.length > 0 &&
        contacts.map((contact, index) => {
          return (
            <InfoCard
              remove={removeContact}
              removeId={contact.id}
              key={index}
              header={contact.name}
              subText={contact.title}
              email={contact.email}
              avatar={contact.avatar}
              setRedirectToProfile={() => {
                setRedirect(
                  ROUTES.ContactProfile.url(
                    store.company.mention_tag,
                    contact.id
                  )
                );
              }}
            />
          );
        })}
    </EmptyTab>
  );
};

export default ContactsTab;
