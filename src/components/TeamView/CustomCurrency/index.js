import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import { updateCompany } from "contexts/globalContext/GlobalMethods";
import {
  fetchCompanyCurrencies,
  fetchChangeCurrency,
} from "helpersV2/currency";

import {
  Title,
  SubTitle,
  ButtonsWrapper,
  ContentWrapper,
  ExpandButton,
} from "components/TeamView/Customisation/sharedComponents";
import AppButton from "styles/AppButton";

const currenciesObj = {
  $: "Dollar",
  "£": "Pound",
  "€": "Euro",
};

const CustomCurrency = () => {
  const store = useContext(GlobalContext);
  const [selectedCurrency, setSelectedCurrency] = useState(undefined);
  const [companyCurrencies, setCompanyCurrencies] = useState(undefined);
  const [expand, setExpand] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (store.company) {
      fetchCompanyCurrencies(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setCompanyCurrencies(res);
          res.map((curr) =>
            curr.default ? setSelectedCurrency(curr.id) : null
          );
        } else {
          notify("danger", "Unable to get currencies");
        }
      });
    }
  }, [store.company, store.session]);

  const changeCurrency = () => {
    fetchChangeCurrency(
      store.session,
      store.company.id,
      Number(selectedCurrency)
    ).then((res) => {
      if (!res.err) {
        notify("info", "Currency succesfully changed");
        updateCompany(store, store.company.mention_tag);
      } else {
        notify("danger", "Unable to change currencies");
      }
    });
  };

  const resetCurrency = () => {
    companyCurrencies.map((curr) =>
      curr.default ? setSelectedCurrency(curr.id) : null
    );
  };
  return (
    <div
      className="row"
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      <div className="col-md-12">
        <ContentWrapper>
          <Header>
            <div>
              <Title>Currency</Title>
              <SubTitle>Select your company currency.</SubTitle>
            </div>
            <ExpandButton expand={expand} setExpand={setExpand} />
          </Header>
          {expand && (
            <Body>
              <select
                style={{ maxWidth: "200px" }}
                className="form-control"
                type="text"
                name="type"
                placeholder="Company Type"
                onChange={(e) => setSelectedCurrency(e.target.value)}
                value={selectedCurrency}
              >
                <option value="" disabled hidden>
                  Select a type
                </option>
                {companyCurrencies &&
                  companyCurrencies.map((currency, index) => (
                    <option
                      value={currency.id}
                      key={`currency-option-${index}`}
                    >
                      {currency.currency_name}{" "}
                      {currenciesObj[currency.currency_name]}
                    </option>
                  ))}
              </select>
              {over && (
                <ButtonsWrapper>
                  <AppButton
                    theme="grey"
                    size="small"
                    onClick={() => resetCurrency()}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    theme="primary"
                    size="small"
                    onClick={() => changeCurrency()}
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
  );
};

export default CustomCurrency;

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
  display: flex;
  padding-top: 20px;
  position: relative;
  margin-bottom: 40px;
`;
