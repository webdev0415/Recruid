import React, { useEffect, useState } from "react";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import AvatarIcon from "sharedComponents/AvatarIcon";
import spacetime from "spacetime";
import notify from "notifications";
import { generateBody } from "constants/noteMentions";
import {
  STContainer,
  STTable,
  OverflowCell,
} from "modals/ViewProfilesListsModal/components";
import { fetchNotesList } from "helpersV2/notes";
import Spinner from "sharedComponents/Spinner";

const SLICE_LENGTH = 20;

const NotesTable = ({
  store,
  elasticIds,
  notes,
  setNotes,
  hasMore,
  setHasMore,
  loaded,
  setLoaded,
}) => {
  const [showBodyIndex, setShowBodyIndex] = useState(undefined);
  useEffect(() => {
    if (store.session) {
      fetchNotesList(store.session, {
        slice: [0, SLICE_LENGTH],
        ids: elasticIds,
      }).then((resNotes) => {
        if (!resNotes.err) {
          setNotes(resNotes);
          setLoaded(true);
          if (resNotes.length === SLICE_LENGTH) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", resNotes);
        }
      });
    }
  }, [store.session, elasticIds]);

  const fetchMore = () => {
    fetchNotesList(store.session, {
      slice: [notes.length, SLICE_LENGTH],
      ids: elasticIds,
    }).then((resNotes) => {
      if (!resNotes.err) {
        setNotes([...notes, ...resNotes]);
        if (resNotes.length === SLICE_LENGTH) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", resNotes);
      }
    });
  };

  return (
    <>
      {!loaded ? (
        <Spinner />
      ) : (
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={notes?.length || 0}
          scrollableTarget={"modal-container-scroll"}
        >
          <STContainer id="modal-container-scroll">
            <div className="table-responsive">
              <STTable className="table  ">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Note
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Created by
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Created
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Associated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notes &&
                    notes.map((note, index) => {
                      let noteBody = generateBody(note.body);
                      return (
                        <React.Fragment key={`note-row-${index}`}>
                          <tr className="table-row-hover">
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              <button
                                onClick={() => {
                                  if (note.body?.length > 0) {
                                    setShowBodyIndex(
                                      showBodyIndex === index
                                        ? undefined
                                        : index
                                    );
                                  }
                                }}
                              >
                                {note.body.length > 30 ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: generateBody(
                                        note.body.slice(0, 30)
                                      ),
                                    }}
                                  />
                                ) : (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: noteBody,
                                    }}
                                  />
                                )}
                              </button>
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {note.author_name}
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {spacetime(new Date(note.created_at)).format(
                                "{date} {month}, {year}"
                              )}
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {note.source && (
                                <div className="d-flex align-items-center">
                                  <AvatarIcon
                                    name={note.source.name}
                                    imgUrl={note.source.avatar}
                                    size={25}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  <OverflowCell
                                    to={
                                      note.source.type ===
                                      "ProfessionalTalentNetwork"
                                        ? ROUTES.CandidateProfile.url(
                                            store.company.mention_tag,
                                            note.source.id
                                          )
                                        : note.source.type === "Employer"
                                        ? ROUTES.ClientProfile.url(
                                            store.company.mention_tag,
                                            note.source.id
                                          )
                                        : note.source.type === "DealContact"
                                        ? ROUTES.ContactProfile.url(
                                            store.company.mention_tag,
                                            note.source.id
                                          )
                                        : note.source.type === "Deal"
                                        ? ROUTES.DealProfile.url(
                                            store.company.mention_tag,
                                            note.source.id
                                          )
                                        : ROUTES.ClientManager.url(
                                            store.company.mention_tag
                                          )
                                    }
                                    style={{ color: "#1e1e1e" }}
                                  >
                                    {note.source.name}
                                  </OverflowCell>
                                </div>
                              )}
                            </td>
                          </tr>
                          {showBodyIndex === index && (
                            <tr>
                              <td
                                colSpan="12"
                                className={sharedStyles.tableItem}
                                style={{ overflow: "hidden" }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: noteBody,
                                  }}
                                ></div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </STTable>
            </div>
          </STContainer>
        </InfiniteScroller>
      )}
    </>
  );
};

export default NotesTable;
