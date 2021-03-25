import React, { Suspense } from "react";
import { ROUTES, REDIRECTS } from "routes";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import MainPageFetcher from "PageWrappers/MainPageFetcher";
import InnerPage from "PageWrappers/InnerPage";
import retryLazy from "hooks/retryLazy";
//ATS PAGES

// const CompanyCreate = React.lazy(() => retryLazy(()=> import("containers/OnboardFlow/PayingOnboardFlow"))
//
// );

//USER PAGES

//GDPR PAGES
// const Cookies = React.lazy(() => retryLazy(()=> import("containers/Cookies")) );
// const Privacy = React.lazy(() => retryLazy(()=>import("containers/Privacy") ) );
// const Terms = React.lazy(() => retryLazy(()=> import("containers/Terms")) );

//OTHER PAGES
const NotFound = React.lazy(() =>
  retryLazy(() => import("containers/NotFound"))
);

const App = () => {
  return (
    <BrowserRouter>
      <MainPageFetcher>
        <Switch>
          <Route exact path="/" render={() => <InnerPage />} />
          {Object.values(REDIRECTS).map((red, ix) => (
            <Redirect to={red.to} from={red.from} key={`redirect-${ix}`} />
          ))}
          {Object.values(ROUTES).map((route, index) => (
            <Route
              exact
              path={route.path}
              render={route.render}
              key={`route-${index}`}
            />
          ))}
          <Route
            render={() => (
              <Suspense fallback={<div />}>
                <NotFound />
              </Suspense>
            )}
          />
        </Switch>
      </MainPageFetcher>
    </BrowserRouter>
  );
};

export default App;
