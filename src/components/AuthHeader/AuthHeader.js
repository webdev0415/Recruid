import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { checkLastCompany } from "contexts/globalContext/GlobalMethods";
import { ROUTES } from "routes";
import ElasticSearch from "containers/ElasticSearch/ElasticSearch";
import UserDropMenu from "components/AuthHeader/UserMenu";
import { AWS_CDN_URL } from "constants/api";
import Spinner from "sharedComponents/Spinner";
// import HeaderSearch from "sharedComponents/layout/HeaderSearch";
import { ATSContainer } from "styles/PageContainers";

const AuthHeader = () => {
  const store = useContext(GlobalContext);
  const location = useLocation();
  const [atsLink, setAtsLink] = useState(ROUTES.MyCompanies.url());
  const [elasticSearchActive, setElasticSearchActive] = useState(false);

  const changeElasticSearchState = (state) => () =>
    setElasticSearchActive(state);

  useEffect(() => {
    if (store.allMyCompanies) {
      if (!store.allMyCompanies.length) {
        setAtsLink(ROUTES.MyCompanies.url());
      } else if (store.allMyCompanies.length === 1) {
        if (
          (store.allMyCompanies[0].invited_by_agency ||
            store.allMyCompanies[0].invited_by_employer) &&
          store.allMyCompanies[0].trial !== "upgraded"
        ) {
          setAtsLink(ROUTES.Vendors.url(store.allMyCompanies[0].mention_tag));
        } else {
          setAtsLink(
            ROUTES.CompanyDashboard.url(store.allMyCompanies[0].mention_tag)
          );
        }
      } else {
        let lastCompanyId = checkLastCompany();
        let companyMatch;
        let companyObject;
        store.allMyCompanies.map((comp) =>
          comp.id === lastCompanyId
            ? ((companyMatch = comp.mention_tag), (companyObject = comp))
            : null
        );
        if (
          (companyObject?.invited_by_agency ||
            companyObject?.invited_by_employer) &&
          companyObject?.trial !== "upgraded"
        ) {
          setAtsLink(
            ROUTES.Vendors.url(
              companyMatch || store.allMyCompanies[0].mention_tag
            )
          );
        } else {
          setAtsLink(
            ROUTES.CompanyDashboard.url(
              companyMatch || store.allMyCompanies[0].mention_tag
            )
          );
        }
      }
    } else if (atsLink !== ROUTES.MyCompanies.url()) {
      setAtsLink(ROUTES.MyCompanies.url());
    }
  }, [store.allMyCompanies]);

  return (
    <>
      <Header>
        <ATSContainer>
          <HeaderWrapper className="leo-flex">
            <HeaderLogo className="leo-flex">
              <Link to={atsLink} style={{ marginTop: "5px" }}>
                <img
                  src={`${AWS_CDN_URL}/icons/BrandLogo.svg`}
                  alt="BrandLogo"
                />
              </Link>
              <SearchLink
                className="leo-flex"
                to={{
                  pathname: `/${
                    store?.company?.mention_tag ||
                    store.allMyCompanies[0]?.mention_tag
                  }/search`,
                  state: { prevLocation: location.pathname },
                }}
              >
                <img src={`${AWS_CDN_URL}/icons/ElasticMagnifier.svg`} alt="" />
                <SearchInput placeholder={`Search...`} />
              </SearchLink>
            </HeaderLogo>
            <HeaderMenu className="leo-flex">
              {store.session && store.user && (
                <>
                  {/*<HeaderNotifications
                      userId={store.session.id}
                      session={store.session}
                    />*/}
                  {/* {store.user && store.user.user_status !== "private" && (
                <UserProfileLink
                  name={store.user.name}
                  username={store.user.username}
                  avatarUrl={store.user.avatar_url}
                />
              )} */}
                  <UserDropMenu
                    store={store}
                    companyMentionTag={store.company?.mention_tag}
                    avatarUrl={store.user.avatar_url}
                    name={store.user.name}
                    username={store.user.username}
                    ownedCompanies={store.allMyCompanies}
                  />
                </>
              )}
            </HeaderMenu>
          </HeaderWrapper>
        </ATSContainer>
      </Header>
      <HeaderPlaceholder />
      {!store.session && !store.user && <Spinner />}
      {elasticSearchActive && (
        <ElasticSearch changeElasticSearchState={changeElasticSearchState} />
      )}
    </>
  );
};

export default AuthHeader;

const Header = styled.header`
  background: #2a3744;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
`;

const HeaderWrapper = styled.div`
  align-items: center;
  height: 50px;
  justify-content: space-between;
`;

const HeaderLogo = styled.div`
  align-items: center;

  img {
    height: auto;
    width: 46px;
  }
`;

const HeaderMenu = styled.div`
  align-items: center;
`;

const SearchLink = styled(Link)`
  margin-left: 25px;
  align-items: center;

  img {
    height: 12px;
    width: 12px;
  }

  &:hover,
  &:active {
    text-decoration: none;
  }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  margin-left: 9px;
  font-size: 14px;
  width: 350px;
  color: #fff;
`;

const HeaderPlaceholder = styled.div`
  height: 50px;
`;
