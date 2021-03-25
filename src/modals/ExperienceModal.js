import React, { useState, useEffect } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import AvatarIcon from "sharedComponents/AvatarIcon";
import notify from "notifications";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import AppButton from "styles/AppButton";
import Checkbox from "sharedComponents/Checkbox";
import { fetchAllCompanies } from "helpers/crm/clientCompanies";
import useDropdown from "hooks/useDropdown";
import helpers from "helpersV2/CandidateProfile";
// import { vendorIndex } from "components/Vendors/helpers/vendorsHelpers";

const ExperienceModal = ({
  editingExperience,
  hide,
  store,
  tnProfileId,
  refreshProfile,
}) => {
  const [experience, setExperience] = useState({
    title: "",
    company_name: "",
    contractor_id: undefined,
    start_month: undefined,
    start_year: undefined,
    end_month: undefined,
    end_year: undefined,
    current_job: false,
    location: undefined,
    description: "",
  });
  const [years, setYears] = useState([]);
  const [locationVal, setLocationVal] = useState("");
  const [allCompanies, setAllCompanies] = useState(undefined);
  const [companySuggestions, setCompanySuggestions] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown();
  const [companyAvatar, setCompanyAvatar] = useState(undefined);
  useEffect(() => {
    if (editingExperience) {
      setExperience({
        title: editingExperience.title,
        company_name:
          editingExperience.client?.name || editingExperience.company_name,
        contractor_id: editingExperience.client?.id,
        start_month: editingExperience.start_month,
        start_year: editingExperience.start_year,
        end_month: editingExperience.end_month,
        end_year: editingExperience.end_year,
        current_job: false,
        location: editingExperience.location,
        description: editingExperience.description,
      });
      if (editingExperience.location) {
        setLocationVal(editingExperience.location);
      }
      if (editingExperience.client) {
        setCompanyAvatar(editingExperience.client.avatar);
      }
    }
  }, [editingExperience]);

  //FETCH ALL COMPANIES AND SET THEM
  useEffect(() => {
    if (store.company?.type === "Agency") {
      fetchAllCompanies(store.session, {
        company_id: store.company.id,
        get_all: true,
      }).then((res) => {
        if (!res.err) {
          setAllCompanies(res);
        }
      });
    } else if (store.company.type === "Employer") {
      // vendorIndex(store.company.id, 1, store.session).then((vendors) => {
      //   if (vendors !== "err") {
      //     console.log(vendors);
      //     setAllCompanies(
      //       vendors.list.map((vend) => {
      //         return {
      //           company_name: vend.name,
      //           company_avatar: vend.avatar,
      //           client_id: vend.id,
      //         };
      //       })
      //     );
      //   }
      // });
    }
  }, [store.session, store.company]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYears(
      Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i)
    );
  }, []);

  useEffect(() => {
    if (experience.company_name !== "" && allCompanies) {
      let suggestions = allCompanies.filter((comp) =>
        comp.company_name
          ? comp.company_name
              .toLowerCase()
              .includes(experience.company_name?.toLowerCase())
          : false
      );
      setCompanySuggestions(suggestions);
    } else {
      setCompanySuggestions(undefined);
    }
  }, [experience.company_name, allCompanies]);

  const callDeleteExperience = () => {
    helpers
      .editTalentNetworkProfile(tnProfileId, store.company.id, store.session, {
        experiences_attributes: [
          { ...experience, _destroy: true, id: editingExperience.id },
        ],
      })
      .then((res) => {
        if (!res.err) {
          notify("info", "Experience succesfully deleted");
          refreshProfile();
          hide();
        } else {
          notify("info", "Unable to delete experience at this moment");
        }
      });
  };

  const addNewExperience = () => {
    if (experience.title === "" || !experience.title) {
      return notify("danger", "you must at least add a job title");
    }
    helpers
      .editTalentNetworkProfile(tnProfileId, store.company.id, store.session, {
        experiences_attributes: [experience],
      })
      .then((res) => {
        if (!res.err) {
          notify("info", "Experience succesfully added");
          refreshProfile();
          hide();
        } else {
          notify("info", "Unable to add experience at this moment");
        }
      });
  };

  const editExperienceCall = () => {
    if (experience.title === "" || !experience.title) {
      return notify("danger", "you must at least add a job title");
    }
    helpers
      .editTalentNetworkProfile(tnProfileId, store.company.id, store.session, {
        experiences_attributes: [{ ...experience, id: editingExperience.id }],
      })
      .then((res) => {
        if (!res.err) {
          notify("info", "Experience succesfully edited");
          refreshProfile();
          hide();
        } else {
          notify("info", "Unable to edit experience at this moment");
        }
      });
  };

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="edit-experience-modal"
      width={480}
    >
      <MinimalHeader
        title={editingExperience ? "Edit Experience" : "Add Experience"}
        hide={hide}
      />
      <STModalBody className="no-footer">
        <Container>
          <DepContainer>
            <Label>Title</Label>
            <Input
              value={experience.title}
              onChange={(e) =>
                setExperience({ ...experience, title: e.target.value })
              }
              placeholder="Position held"
            />
          </DepContainer>
          <DepContainer>
            <Label>Company</Label>
            <FalseInput className="autocomplete-container" ref={node}>
              {(companyAvatar || experience.contractor_id) && (
                <div style={{ height: "min-content", marginLeft: "10px" }}>
                  <AvatarIcon
                    name={experience.company_name}
                    imgUrl={companyAvatar}
                    size={15}
                  />
                </div>
              )}
              <input
                value={experience.company_name}
                placeholder="Company name"
                onChange={(e) => {
                  setExperience({
                    ...experience,
                    company_name: e.target.value,
                    contractor_id: undefined,
                    contractor_type: undefined,
                  });
                  setCompanyAvatar(undefined);
                  if (!showSelect) {
                    setShowSelect(true);
                  }
                }}
              />
              {showSelect &&
                companySuggestions &&
                companySuggestions.length > 0 && (
                  <MenuContainer className="autocomplete-dropdown-container">
                    {companySuggestions.map((suggestion, index) => {
                      return (
                        <CompanyMenuItem
                          key={`company-suggestion-${index}`}
                          className="suggestion-item"
                          onClick={() => {
                            setExperience({
                              ...experience,
                              company_name: suggestion.company_name,
                              contractor_id: suggestion.client_id,
                              contractor_type: "Client",
                            });
                            setCompanyAvatar(suggestion.avatar_url);
                            setShowSelect(false);
                          }}
                        >
                          <AvatarIcon
                            name={suggestion.company_name}
                            imgUrl={suggestion.avatar_url}
                            size={15}
                          />
                          <span>{suggestion.company_name}</span>
                        </CompanyMenuItem>
                      );
                    })}
                  </MenuContainer>
                )}
            </FalseInput>
          </DepContainer>
          <DepContainer>
            <Label>Location</Label>
            <PlacesAutocomplete
              value={locationVal}
              onChange={setLocationVal}
              onSelect={(value) => {
                setLocationVal(value);
                setExperience({ ...experience, location: value });
              }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                <div className="autocomplete-container">
                  <Input
                    {...getInputProps({
                      placeholder: "Location",
                    })}
                  />
                  {suggestions && suggestions.length > 0 && (
                    <MenuContainer className="autocomplete-dropdown-container">
                      {suggestions.map((suggestion, inx) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        const style = suggestion.active
                          ? { backgroundColor: "#fafafa", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          <MenuItem
                            key={`menu-item-${inx}`}
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </MenuItem>
                        );
                      })}
                    </MenuContainer>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          </DepContainer>
          <DepContainer>
            <CheckboxContainer>
              <Checkbox
                active={experience.current_job}
                onClick={() =>
                  setExperience({
                    ...experience,
                    current_job: !experience.current_job,
                  })
                }
              />
              <span>Currently working in this role </span>
            </CheckboxContainer>
          </DepContainer>
          <DepContainer>
            <Label>Start Date</Label>
            <SelectWrapper>
              <SelectComp
                className="form-control form-control-select"
                value={experience.start_month}
                onChange={(e) =>
                  setExperience({ ...experience, start_month: e.target.value })
                }
              >
                <option hidden>Month</option>
                {months.map((month, index) => (
                  <option value={month.prop} key={`start-month-${index}`}>
                    {month.value}
                  </option>
                ))}
              </SelectComp>
              <SelectComp
                className="form-control form-control-select"
                value={experience.start_year}
                onChange={(e) =>
                  setExperience({ ...experience, start_year: e.target.value })
                }
              >
                <option hidden>Year</option>
                {years.map((year, index) => (
                  <option value={year} key={`start-year-${index}`}>
                    {year}
                  </option>
                ))}
              </SelectComp>
            </SelectWrapper>
          </DepContainer>
          <DepContainer>
            <Label>End Date</Label>
            {experience.current_job ? (
              <div className="leo-flex">
                <Input
                  value="Present"
                  disabled
                  readOnly
                  style={{ maxWidth: "128px" }}
                />
              </div>
            ) : (
              <SelectWrapper>
                <SelectComp
                  className="form-control form-control-select"
                  value={experience.end_month}
                  onChange={(e) =>
                    setExperience({ ...experience, end_month: e.target.value })
                  }
                >
                  <option hidden>Month</option>
                  {months.map((month, index) => (
                    <option value={month.prop} key={`end-month-${index}`}>
                      {month.value}
                    </option>
                  ))}
                </SelectComp>
                <SelectComp
                  className="form-control form-control-select"
                  value={experience.end_year}
                  onChange={(e) =>
                    setExperience({ ...experience, end_year: e.target.value })
                  }
                >
                  <option hidden>Year</option>
                  {years.map((year, index) => (
                    <option value={year} key={`end-year-${index}`}>
                      {year}
                    </option>
                  ))}
                </SelectComp>
              </SelectWrapper>
            )}
          </DepContainer>
          <DepContainer>
            <Label>Description</Label>
            <TextArea
              rows="10"
              value={experience.description}
              onChange={(e) =>
                setExperience({ ...experience, description: e.target.value })
              }
              placeholder="Description"
            />
          </DepContainer>
        </Container>
        <Footer>
          <div>
            {editingExperience && (
              <DeleteButton onClick={() => callDeleteExperience()}>
                Delete
              </DeleteButton>
            )}
          </div>
          {editingExperience ? (
            <AppButton size="small" onClick={() => editExperienceCall()}>
              Save
            </AppButton>
          ) : (
            <AppButton size="small" onClick={() => addNewExperience()}>
              Save
            </AppButton>
          )}
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

export default ExperienceModal;

const STModalBody = styled(ModalBody)`
  padding: 20px !important;
  text-align: center;
`;

const Container = styled.div`
  margin: auto;
  max-width: 395px;
`;

const DepContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #74767b;
  margin-bottom: 10px;
  display: block;
  text-align: left;
`;

const Input = styled.input`
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: 5px 12px;
  width: 100%;
  height: 30px;
  font-size: 12px;
  line-height: 15px;
  color: #2a3744;
`;

const TextArea = styled.textarea`
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: 5px 12px;
  width: 100%;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
`;

const Footer = styled.div`
  max-width: 395px;
  margin: auto;
  border-top: solid 1px #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
`;

const DeleteButton = styled.button`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: #f27881;
`;

const months = [
  { prop: 1, value: "January" },
  { prop: 2, value: "February" },
  { prop: 3, value: "March" },
  { prop: 4, value: "April" },
  { prop: 5, value: "May" },
  { prop: 6, value: "June" },
  { prop: 7, value: "July" },
  { prop: 8, value: "August" },
  { prop: 9, value: "September" },
  { prop: 10, value: "October" },
  { prop: 11, value: "November" },
  { prop: 12, value: "December" },
];

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 280px;
  justify-content: space-between;
`;

const SelectComp = styled.select`
  margin-bottom: 0px;
  font-size: 12px;
  max-width: 128px;
  padding: 5px 10px;
  height: 30px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;

  span {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #74767b;
    margin-left: 5px;
  }
`;

const MenuContainer = styled.div`
  border: solid #c4c4c4 1px;
  max-width: 300px;
  max-height: 300px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  overflow: scroll;
`;

const MenuItem = styled.div`
  font-size: 12px;

  &:hover {
    background: #eee;
    cursor: pointer;
  }
`;

const CompanyMenuItem = styled(MenuItem)`
  display: flex;
  align-items: center;

  span {
    margin-left: 10px;
  }
`;

const FalseInput = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;

  input {
    height: 100%;
    border: none;
    font-size: 12px;
    color: #2a3744;
    font-size: 12px;
    line-height: 15px;
    padding: 5px 12px;
  }
`;
