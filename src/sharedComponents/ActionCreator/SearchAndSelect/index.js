import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchAllContacts } from "helpers/crm/contacts";
import notify from "notifications";

const SearchAndSelect = ({
  store,
  contactables = {},
  setContactables,
  totalSelected,
  hideSearch,
}) => {
  const [value, setValue] = useState(undefined);
  const [activeTab, setActiveTab] = useState(undefined);
  const [unselectedContacts, setUnselectedContacts] = useState(undefined);

  useEffect(() => {
    if (value?.length >= 2) {
      setUnselectedContacts(
        contactables.contacts?.filter((cont) => !cont.selected)
      );
      //separate unselected contacts
      fetchAllContacts(store.session, {
        get_all: true,
        company_id: store.company.id,
        search_term: value.length > 0 ? value : undefined,
      }).then((res) => {
        if (!res.err && res.length > 0) {
          let contCopy = { ...contactables };
          if (!contactables.contacts) {
            contCopy.contacts = [];
          } else {
            contCopy.contacts = contCopy.contacts.filter(
              (option) => option.selected
            );
          }
          res.map((cont) => {
            let foundIndex = contCopy.contacts.findIndex(
              (contact) => contact.source_id === cont.id
            );
            if (foundIndex === -1) {
              contCopy.contacts.push({
                name: cont.name,
                email: cont.email,
                source: "contact",
                source_id: cont.id,
                selected: false,
              });
            }
            return null;
          });
          setContactables(contCopy);
          if (activeTab !== "contacts") {
            setActiveTab("contacts");
          }
        } else if (res.err) {
          notify("danger", "Unable to fetch contacts");
        }
      });
    } else if (value === "") {
      let contCopy = { ...contactables };
      contCopy.contacts =
        contCopy.contacts?.filter((option) => option.selected) || [];
      if (unselectedContacts?.length > 0) {
        unselectedContacts.map((cont) => {
          let foundIndex = contCopy.contacts.findIndex(
            (contact) => contact.source_id === cont.source_id
          );
          if (foundIndex === -1) {
            contCopy.contacts.push(cont);
          }
          return null;
        });
      }
      setContactables(contCopy);
    }
  }, [value]);

  useEffect(() => {
    if (contactables && !activeTab) {
      if (contactables.contacts && contactables.contacts.length > 0) {
        setActiveTab("contacts");
      } else {
        setActiveTab("members");
      }
    }
  }, [contactables, activeTab]);

  const selectContactable = (index) => {
    let ctCopy = { ...contactables };
    let propCopy = [...ctCopy[activeTab]];
    propCopy[index] = {
      ...propCopy[index],
      selected: propCopy[index].selected ? false : true,
    };
    ctCopy[activeTab] = propCopy;
    setContactables(ctCopy);
  };

  return (
    <Wrapper>
      {!hideSearch ? (
        <InputWrapper>
          <input
            placeholder="Search contacts..."
            onChange={(e) => setValue(e.target.value)}
            value={value || ""}
          />
        </InputWrapper>
      ) : (
        <div style={{ marginTop: "10px" }} />
      )}
      <MenuWrapper>
        <TabsDiv>
          {contactables?.contacts?.length > 0 && (
            <button
              className={activeTab === "contacts" ? "active" : ""}
              onClick={() => setActiveTab("contacts")}
            >
              Contacts
            </button>
          )}

          {contactables?.members?.length > 0 && (
            <button
              className={activeTab === "members" ? "active" : ""}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>
          )}

          {contactables?.candidates?.length > 0 && (
            <button
              className={activeTab === "candidates" ? "active" : ""}
              onClick={() => setActiveTab("candidates")}
            >
              Candidate
            </button>
          )}
        </TabsDiv>
        <span>{totalSelected} attendees</span>
      </MenuWrapper>
      <ContactablesWrapper>
        {contactables && activeTab && contactables[activeTab] && (
          <SearchWrapper>
            {contactables[activeTab].map((option, index) => (
              <React.Fragment key={`option-select-checked-${index}`}>
                {option.selected && (
                  <SearchResult>
                    <input
                      type="checkbox"
                      checked={option.selected ? true : false}
                      onChange={() => selectContactable(index)}
                    />
                    <span>
                      {option.name} {option.email ? `(${option.email})` : ""}
                    </span>
                  </SearchResult>
                )}
              </React.Fragment>
            ))}
          </SearchWrapper>
        )}

        {contactables && activeTab && contactables[activeTab] && (
          <SearchWrapper>
            {contactables[activeTab].map((option, index) => (
              <React.Fragment key={`option-select-unchecked-${index}`}>
                {!option.selected && (
                  <SearchResult>
                    <input
                      type="checkbox"
                      checked={option.selected ? true : false}
                      onChange={() => selectContactable(index)}
                    />
                    <span>
                      {option.name} {option.email ? `(${option.email})` : ""}
                    </span>
                  </SearchResult>
                )}
              </React.Fragment>
            ))}
          </SearchWrapper>
        )}
      </ContactablesWrapper>
    </Wrapper>
  );
};

export default SearchAndSelect;

const Wrapper = styled.div`
  background: #ffffff;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
  position: absolute;
  top: 50px;
  width: 340px;
  z-index: 20;
`;

const InputWrapper = styled.div`
  background: rgba(31, 54, 83, 0.05);
  padding: 7px 10px;

  input {
    background-color: #ffffff !important;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    cursor: auto;
    font-size: 12px;
    padding: 9px 10px;
    width: 100%;
  }
`;

const MenuWrapper = styled.div`
  align-items: flex-start;
  border-bottom: 1px solid #e1e1e1;
  color: #74767b;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  margin: 0 20px;
  margin-bottom: 10px;
  padding: 10px 0 0;

  span {
    margin-top: 2px;
  }

  button {
    border-bottom: 2px solid transparent;
    color: #74767b;
    font-size: 15px;
    font-weight: 500;
    line-height: 1;
    padding: 0;
    padding-bottom: 10px;

    &:not(:last-child) {
      margin-right: 20px;
    }

    &.active {
      border-bottom: 2px solid #1e1e1e;
      color: #1e1e1e;
    }
  }
`;

const TabsDiv = styled.div``;

const SearchWrapper = styled.div``;

const SearchResult = styled.div`
  display: flex;
  padding: 5px 20px;

  input {
    font-size: 15px;
    margin-right: 10px;
  }

  span {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ContactablesWrapper = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;
