import React, { Suspense } from "react";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
const AsyncTable = React.lazy(() =>
  retryLazy(() => import("components/Calendar/components/Table/CalendarTable"))
);
const AsyncList = React.lazy(() =>
  retryLazy(() => import("components/Calendar/components/List/CalendarList"))
);

const AsyncRender = ({
  week,
  openModal,
  prevWeek,
  nextWeek,
  months,
  generateWeek,
  diplayEventOverview,
  globalView,
  eventType,
  setEventType,
}) => {
  if (!week || !week.length) {
    return <Spinner />;
  } else {
    return (
      <>
        {globalView === "list" ? (
          <Suspense fallback={<Spinner />}>
            <AsyncList
              months={months}
              monthsList={months}
              diplayEventOverview={diplayEventOverview}
              openModal={openModal}
              eventType={eventType}
              setEventType={setEventType}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<Spinner />}>
            <AsyncTable
              week={week}
              openModal={openModal}
              prevWeek={prevWeek}
              nextWeek={nextWeek}
              months={months}
              diplayEventOverview={diplayEventOverview}
              generateWeek={generateWeek}
              eventType={eventType}
              setEventType={setEventType}
            />
          </Suspense>
        )}
      </>
    );
  }
};

export default AsyncRender;
