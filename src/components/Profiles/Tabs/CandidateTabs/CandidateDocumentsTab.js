import React, { useEffect } from "react";
import DocumentsTab from "components/Profiles/Tabs/DocumentsTab";
import notify from "notifications";
import useForceUpdate from "hooks/useForceUpdate";
import {
  deleteDocumentCall,
  fetchDocuments,
  fetchTogglePrimaryCv,
} from "helpersV2/CandidateProfile";

const CandidateDocumentsTab = ({
  documents,
  setDocuments,
  store,
  tnProfile,
  uploadFilesToProfile,
}) => {
  const { shouldUpdate, triggerUpdate } = useForceUpdate();
  useEffect(() => {
    if (tnProfile && (documents === undefined || shouldUpdate)) {
      fetchDocuments(tnProfile.ptn_id, store.session).then((docs) => {
        if (docs !== "err" && !docs.message) {
          setDocuments(docs);
        } else {
          notify("danger", "Unable to fetch documents");
          setDocuments(false);
        }
      });
    }
     
  }, [tnProfile, shouldUpdate]);

  const deleteDocument = (docId, index) => {
    deleteDocumentCall(docId, store.session).then((res) => {
      if (res.status !== 405) {
        let newDocuments = [...documents];
        newDocuments.splice(index, 1);
        setDocuments(newDocuments);
      } else {
        alert("Could not delete this file");
      }
    });
  };

  const togglePrimaryCv = (index) => {
    fetchTogglePrimaryCv(
      tnProfile.ptn_id,
      documents[index],
      store.session
    ).then((res) => {
      if (!res.err) {
        return triggerUpdate();
      }
      return notify("danger", "Unable to change primary CV");
    });
  };

  return (
    <DocumentsTab
      documents={documents}
      setDocuments={setDocuments}
      deleteDocument={deleteDocument}
      uploadFilesToProfile={uploadFilesToProfile}
      origin="candidate"
      togglePrimaryCv={togglePrimaryCv}
      canEdit={
        store.role.role_permissions.owner ||
        store.role.role_permissions.recruiter
      }
    />
  );
};

export default CandidateDocumentsTab;
