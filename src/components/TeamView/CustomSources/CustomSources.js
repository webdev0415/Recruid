import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  Title,
  SubTitle,
  ButtonsContainer,
  StyledInput,
  ButtonsWrapper,
  ContentWrapper,
  ExpandButton,
} from "components/TeamView/Customisation/sharedComponents";
import notify from "notifications";

import {
  fetchAddCompanySources,
  fetchUpdateCompanySources,
  fetchDeleteCompanySources,
} from "helpersV2/sources";

import { getCompanySources } from "contexts/globalContext/GlobalMethods";
import AppButton from "styles/AppButton";

const CustomSources = () => {
  const store = useContext(GlobalContext);
  const [sources, setSources] = useState(undefined);
  const [expand, setExpand] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (store.sources) {
      let sourcesCopy = [];
      store.sources.map((source) =>
        source.source !== "Alaska" ? sourcesCopy.push(source) : null
      );
      setSources(sourcesCopy);
    }
  }, [store.sources]);

  const updateSourcesMethod = () => {
    let toAdd = [];
    let toDelete = [];
    let toChange = [];
    let noName;

    sources.map((source, index) => {
      if (source.source === "" && index !== sources.length - 1) {
        noName = true;
      }
      if (source._destroy === true) {
        toDelete.push(source.id);
      } else if (source.id === undefined && index !== sources.length - 1) {
        toAdd.push({ source: source.source });
      } else if (source._updated === true) {
        toChange.push({ source: source.source, id: source.id });
      }
      return null;
    });

    if (noName) {
      notify("danger", "Sources must have a name");
      return;
    }
    let calls = [];
    if (toAdd?.length > 0) {
      calls.push(
        fetchAddCompanySources(store.session, store.company.id, toAdd)
      );
    }
    if (toChange?.length > 0) {
      calls.push(
        fetchUpdateCompanySources(store.session, store.company.id, toChange)
      );
    }
    if (toDelete?.length > 0) {
      calls.push(
        fetchDeleteCompanySources(store.session, store.company.id, toDelete)
      );
    }
    if (calls?.length > 0) {
      Promise.all(calls).then((responses) => {
        if (responses.every((res) => !res.err)) {
          notify("info", "Sources succesfully updated");
          getCompanySources(store.dispatch, store.session, store.company.id);
        } else {
          notify("danger", "unable to update sources");
          if (responses.some((res) => !res.err)) {
            getCompanySources(store.dispatch, store.session, store.company.id);
          }
        }
      });
    } else {
      notify("info", "Nothing to update at the moment");
    }
  };

  const deleteSource = (index) => {
    let sourcesCopy = [...sources];
    if (sourcesCopy[index].id) {
      sourcesCopy[index] = { ...sourcesCopy[index], _destroy: true };
    } else {
      sourcesCopy.splice(index, 1);
    }
    setSources(sourcesCopy);
  };

  const addSource = () => setSources([...sources, { source: "" }]);

  //ADD A NEW STAGE WHEN  A NAME IS TYPED
  useEffect(() => {
    if (sources?.length > 0) {
      let lastSource = sources[sources.length - 1];
      if (lastSource.source !== "") {
        addSource();
      }
    } else if (sources?.length === 0) {
      addSource();
    }
     
  }, [sources]);

  const onChangeInput = (value, index) => {
    let text = value.replace(/[^a-z0-9\s]/gi, "");
    if (text.length > 50) return;
    let sourcesCopy = [...sources];
    sourcesCopy[index] = {
      ...sourcesCopy[index],
      source: text,
      _updated: sourcesCopy[index].id ? true : undefined,
    };
    setSources(sourcesCopy);
  };

  return (
    <>
      <div
        className="row"
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        <div className="col-md-12">
          <ContentWrapper>
            <Header>
              <div>
                <Title>Custom Sources</Title>
                <SubTitle>
                  Add your own sources to better match your internal process.
                </SubTitle>
              </div>
              <ExpandButton expand={expand} setExpand={setExpand} />
            </Header>
            {expand && (
              <Body>
                <SourcesWrapper>
                  {sources?.length > 0 &&
                    sources.map((source, index) => (
                      <React.Fragment key={`source-${index}`}>
                        {!source._destroy && (
                          <div className="sourceRow">
                            <StyledInput
                              value={source.source}
                              placeholder={"Type the source name..."}
                              onChange={(e) =>
                                onChangeInput(e.target.value, index)
                              }
                            />
                            <ButtonsContainer>
                              {index !== sources.length - 1 &&
                                sources.filter((source) => !source._destroy)
                                  .length > 2 && (
                                  <button
                                    className="button button--default button--orange"
                                    onClick={() => deleteSource(index)}
                                  >
                                    Remove
                                  </button>
                                )}
                            </ButtonsContainer>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                </SourcesWrapper>
                {over && (
                  <ButtonsWrapper>
                    <AppButton
                      theme="grey"
                      size="small"
                      onClick={() => setSources(store.sources)}
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      theme="primary"
                      size="small"
                      onClick={() => updateSourcesMethod()}
                    >
                      Save
                    </AppButton>
                  </ButtonsWrapper>
                )}
              </Body>
            )}
          </ContentWrapper>
        </div>
      </div>
    </>
  );
};

export default CustomSources;

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  position: relative;
  top: -5px;
  width: 100%;
`;

const Body = styled.div`
  display: grid;
  grid-column-gap: 80px;
  grid-template-columns: 500px 1fr;
  height: 450px;
  padding-top: 20px;
  position: relative;
  margin-bottom: 40px;
`;

const SourcesWrapper = styled.div`
  border-radius: 4px;
  border: solid #eeeeee 1px;
  height: 360px;
  position: relative;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;

  .sourceRow {
    border-bottom: solid #eeeeee 1px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
  }
`;
