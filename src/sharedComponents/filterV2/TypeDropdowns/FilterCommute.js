import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  TextInput,
  SaveButton,
  Label,
  SelectContainer,
} from "sharedComponents/filterV2/StyledFilterComponents";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";
import { LocationInput } from "sharedComponents/filterV2/TypeDropdowns/FilterLocation";
import useDropdown from "hooks/useDropdown";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { fetchJobs } from "helpersV2/jobs";
import { fetchTempJobs } from "helpersV2/tempPlus";
import { TagsSubMenu } from "sharedComponents/TagsComponent/StyleTagsComponent";
import {
  CarIcon,
  TrainIcon,
  WalkIcon,
  BikeIcon,
} from "sharedComponents/filterV2/icons/commute";
const SLICE_LENGHT = 10;
let timeout = null;

const FilterNumber = ({
  option,
  setOption,
  saveFilter,
  index,
  store,
  showSelect,
  tempPlus,
}) => {
  const [value, setValue] = useState(undefined);
  const [modifier, setModifier] = useState("exactly");
  const [selectType, setSelectType] = useState("job");
  const [selectedJob, setSelectedJob] = useState(undefined);
  const {
    node,
    showSelect: showJobSelect,
    setShowSelect: setShowJobSelect,
  } = useDropdown();
  const {
    node: nodeLocation,
    showSelect: showLocationSelect,
    setShowSelect: setShowLocationSelect,
  } = useDropdown();
  const [jobs, setJobs] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const controller = new AbortController();
  const signal = controller.signal;
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [searchValue, setSearchValue] = useState("");
  const [updateValue, setUpdateValue] = useState(false);

  useEffect(() => {
    if (searchValue !== search) {
      timeout = setTimeout(() => setUpdateValue(true), 500);
    }
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (updateValue) {
      if (searchValue.length > 2) {
        setSearch(searchValue);
      } else if (search !== "") {
        setSearch("");
      }
      setUpdateValue(false);
    }
  }, [updateValue]);

  const saveAttributeFilter = () => {
    if (!option.prop_value) {
      notify("danger", "Select an option to filter by");
    } else if (!option.prop_value.destination) {
      notify("danger", "Select a location to filter by");
    } else if (
      option.prop_value.duration === undefined ||
      option.prop_value.duration === ""
    ) {
      notify("danger", "Input a number of minutes");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (value === undefined && option.prop_value?.duration) {
      setValue(option.prop_value.duration);
    }
  }, [value, option]);

  useEffect(() => {
    if (selectedLocation === undefined && option.prop_value?.destination) {
      setSelectedLocation(selectedLocation);
      setSelectType("location");
    }
  }, [selectedLocation, option]);

  useEffect(() => {
    if (showSelect && !option.prop_value) {
      setOption({
        ...option,
        prop_value: option.prop_value
          ? { ...option.prop_value, modifier: modifier, travel_mode: "driving" }
          : { modifier: modifier, travel_mode: "driving" },
      });
    }
  }, [option]);

  useEffect(() => {
    if (!option.display_text) {
      setOption({
        ...option,
        display_text: option.text_constructor(
          option.prop_value?.modifier || modifier,
          option.prop_value?.duration !== undefined
            ? option.prop_value.duration / 60
            : undefined,
          option.prop_value?.destination,
          transportExchanger[option.prop_value?.travel_mode]
        ),
      });
    }
  }, [option]);

  useEffect(() => {
    if (selectedJob) {
      if (selectedJob.localizations && selectedJob.localizations.length === 1) {
        setSelectedLocation(selectedJob.localizations[0].location.name);
      }
    }
  }, [selectedJob]);

  useEffect(() => {
    if (selectedLocation) {
      setOption({
        ...option,
        display_text: option.text_constructor(
          option.prop_value?.modifier,
          option.prop_value?.duration !== undefined
            ? option.prop_value.duration / 60
            : undefined,
          selectedLocation,
          transportExchanger[option.prop_value?.travel_mode]
        ),
        prop_value: option.prop_value
          ? { ...option.prop_value, destination: selectedLocation }
          : { destination: selectedLocation },
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    fethJobsCaller(
      store.session,
      store.company.id,
      {
        slice: [0, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length >= 2 ? [search] : undefined,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs(jbs);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
    return () => controller.abort();
  }, [search]);

  const fetchMore = () => {
    fethJobsCaller(
      store.session,
      store.company.id,
      {
        slice: [jobs.length, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length >= 2 ? [search] : undefined,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs([...jobs, ...jbs]);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
  };

  const fethJobsCaller = async (session, companyId, body, signal) =>
    !tempPlus
      ? fetchJobs(session, companyId, body, signal)
      : fetchTempJobs(session, companyId, body, signal);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer style={{ maxHeight: "inherit" }}>
          <TransportSelect option={option} setOption={setOption} />
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <OptionWrapper>
              <input
                type="radio"
                id="num-exactly"
                name="numeric-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "exactly"}
                onChange={() => {
                  setModifier("exactly");
                  setOption({
                    ...option,
                    display_text: option.text_constructor(
                      "exactly",
                      option.prop_value?.duration !== undefined
                        ? option.prop_value.duration / 60
                        : undefined,
                      option.prop_value?.destination,
                      transportExchanger[option.prop_value?.travel_mode]
                    ),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "exactly" }
                      : { modifier: "exactly" },
                  });
                }}
              />

              <label htmlFor="num-exactly">exactly</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="name-up-to"
                name="numeric-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "up to"}
                onChange={() => {
                  setModifier("up to");
                  setOption({
                    ...option,
                    display_text: option.text_constructor(
                      "up to",
                      option.prop_value?.duration !== undefined
                        ? option.prop_value.duration / 60
                        : undefined,
                      option.prop_value?.destination,
                      transportExchanger[option.prop_value?.travel_mode]
                    ),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "up to" }
                      : { modifier: "up to" },
                  });
                }}
              />

              <label htmlFor="name-up-to">up to</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="num-at-least"
                name="numeric-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "at least"}
                onChange={() => {
                  setModifier("at least");
                  setOption({
                    ...option,
                    display_text: option.text_constructor(
                      "at last",
                      option.prop_value?.duration !== undefined
                        ? option.prop_value.duration / 60
                        : undefined,
                      option.prop_value?.destination,
                      transportExchanger[option.prop_value?.travel_mode]
                    ),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "at least" }
                      : { modifier: "at least" },
                  });
                }}
              />

              <label htmlFor="num-at-least">at least</label>
            </OptionWrapper>
            <TextInput
              value={value / 60}
              type="number"
              onChange={(e) => {
                setValue(e.target.value * 60);
                setOption({
                  ...option,
                  display_text: option.text_constructor(
                    option.prop_value?.modifier,
                    Number(e.target.value),
                    option.prop_value?.destination,
                    transportExchanger[option.prop_value?.travel_mode]
                  ),
                  prop_value: option.prop_value
                    ? { ...option.prop_value, duration: e.target.value * 60 }
                    : { duration: e.target.value * 60 },
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveAttributeFilter();
                }
              }}
              placeholder="Type minutes..."
            />
          </TypeMenuContent>
          <TypeMenuContent>
            <Label>To</Label>
            <OptionWrapper>
              <input
                type="radio"
                id="job-individual"
                name="job-individual"
                value={selectType}
                checked={selectType === "job"}
                onChange={() => {
                  setSelectType("job");
                }}
              />

              <label htmlFor="job-individual">Job</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="select-type-modifier"
                name="select-type-modifier"
                value={selectType}
                checked={selectType === "location"}
                onChange={() => {
                  setSelectType("location");
                }}
              />
              <label htmlFor="location-individual">Location</label>
            </OptionWrapper>
            {selectType === "job" && (
              <SelectContainer ref={node} className="leo-relative">
                <ActionButton
                  onClick={() => setShowJobSelect(!showJobSelect)}
                  className="leo-flex-center-between"
                >
                  {selectedJob ? selectedJob.title : "Select Job"}
                  <svg width="7" height="4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h7L3.5 4z" fill="#353535" fill-role="evenodd" />
                  </svg>
                </ActionButton>
                {showJobSelect && (
                  <TagsSubMenu
                    id="add-jobs-dropdown"
                    style={{
                      top: "52px",
                      width: "230px",
                      boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.38)",
                    }}
                  >
                    <Input
                      placeholder="Search jobs..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <InfiniteScroller
                      fetchMore={fetchMore}
                      hasMore={hasMore}
                      dataLength={jobs?.length || 0}
                      scrollableTarget={"add-jobs-dropdown"}
                    >
                      <ul>
                        {jobs &&
                          jobs.map((job, index) => (
                            <li
                              key={`job-list-${index}`}
                              onClick={() => {
                                setSelectedJob({ ...job });
                                setShowJobSelect(false);
                              }}
                            >
                              <span>{job.title}</span>
                            </li>
                          ))}
                      </ul>
                    </InfiniteScroller>
                  </TagsSubMenu>
                )}
              </SelectContainer>
            )}
            {selectType !== "location" &&
              selectedJob?.localizations.length === 0 && (
                <Label style={{ marginTop: "10px" }}>
                  The job you selected does not have any locations
                </Label>
              )}
            {selectType !== "location" &&
              selectedJob?.localizations.length > 1 && (
                <Label style={{ marginTop: "10px" }}>
                  The job you selected has more than one location, please select
                  one
                </Label>
              )}
            {(selectType === "location" ||
              selectedJob?.localizations.length === 0) && (
              <SelectContainer>
                <LocationInput
                  value={option.prop_value.destination}
                  onSelect={(selected) => setSelectedLocation(selected)}
                />
              </SelectContainer>
            )}
            {selectType !== "location" &&
              selectedJob &&
              selectedJob.localizations.length > 1 && (
                <SelectContainer ref={nodeLocation} className="leo-relative">
                  <ActionButton
                    onClick={() => setShowLocationSelect(!showLocationSelect)}
                  >
                    {selectedLocation || "Select Location"}
                    <svg
                      width="7"
                      height="4"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0h7L3.5 4z"
                        fill="#353535"
                        fill-role="evenodd"
                      />
                    </svg>
                  </ActionButton>
                  {showLocationSelect && (
                    <TagsSubMenu
                      id="add-jobs-dropdown"
                      style={{
                        top: "52px",
                        width: "230px",
                        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.38)",
                      }}
                    >
                      <ul>
                        {selectedJob.localizations.map((loc, index) => (
                          <li
                            key={`job-list-${index}`}
                            onClick={() => {
                              setSelectedLocation(loc.location.name);
                              setShowLocationSelect(false);
                            }}
                          >
                            <span>{loc.location.name}</span>
                          </li>
                        ))}
                      </ul>
                    </TagsSubMenu>
                  )}
                </SelectContainer>
              )}
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterNumber;

const TransportSelect = ({ option, setOption }) => {
  return (
    <TransportContainer className="leo-flex-center-evenly">
      <button
        onClick={() => {
          setOption({
            ...option,
            display_text: option.text_constructor(
              option.prop_value?.modifier,
              option.prop_value?.duration !== undefined
                ? option.prop_value.duration / 60
                : undefined,
              option.prop_value?.destination,
              "car"
            ),
            prop_value: option.prop_value
              ? { ...option.prop_value, travel_mode: "driving" }
              : { travel_mode: "driving" },
          });
        }}
      >
        <CarIcon active={option?.prop_value?.travel_mode === "driving"} />
      </button>
      <button
        onClick={() => {
          setOption({
            ...option,
            display_text: option.text_constructor(
              option.prop_value?.modifier,
              option.prop_value?.duration !== undefined
                ? option.prop_value.duration / 60
                : undefined,
              option.prop_value?.destination,
              "train"
            ),
            prop_value: option.prop_value
              ? { ...option.prop_value, travel_mode: "train" }
              : { travel_mode: "train" },
          });
        }}
      >
        <TrainIcon active={option?.prop_value?.travel_mode === "train"} />
      </button>
      <button
        onClick={() => {
          setOption({
            ...option,
            display_text: option.text_constructor(
              option.prop_value?.modifier,
              option.prop_value?.duration !== undefined
                ? option.prop_value.duration / 60
                : undefined,
              option.prop_value?.destination,
              "walking"
            ),
            prop_value: option.prop_value
              ? { ...option.prop_value, travel_mode: "walking" }
              : { travel_mode: "walking" },
          });
        }}
      >
        <WalkIcon active={option?.prop_value?.travel_mode === "walking"} />
      </button>
      <button
        onClick={() => {
          setOption({
            ...option,
            display_text: option.text_constructor(
              option.prop_value?.modifier,
              option.prop_value?.duration !== undefined
                ? option.prop_value.duration / 60
                : undefined,
              option.prop_value?.destination,
              "bike"
            ),
            prop_value: option.prop_value
              ? { ...option.prop_value, travel_mode: "bicycling" }
              : { travel_mode: "bicycling" },
          });
        }}
      >
        <BikeIcon active={option?.prop_value?.travel_mode === "bicycling"} />
      </button>
    </TransportContainer>
  );
};

const OptionWrapper = styled.div`
  margin-bottom: 5px;

  &:last-of-type {
    margin-bottom: 12px;
  }

  label {
    font-size: 14px;
    margin-left: 8px;
  }
`;

const ActionButton = styled.button`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 15px;
  height: 40px;
  padding: 0 10px;
  width: 100%;
  text-align: left;
  margin-top: 5px;
  color: #353535;
`;

const Input = styled.input`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  padding-left: 15px;
  width: 90%;
  margin-left: 10px;
  margin-top: 10px;
`;

const TransportContainer = styled.div`
  padding: 18px;
  border-bottom: solid #dde2e6 1px;
`;

const transportExchanger = {
  bicycling: "bike",
  walking: "walking",
  driving: "car",
  train: "train",
};
