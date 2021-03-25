import notify from "notifications";
export const grantAccess = (auth2, callback, scopeFor) => {
  if (auth2.current) {
    let scope =
      scopeFor === "email"
        ? "openid profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly"
        : "openid profile https://www.googleapis.com/auth/calendar";
    if (auth2 && auth2.current && auth2.current.grantOfflineAccess) {
      auth2.current
        .grantOfflineAccess({
          redirect_uri: "postmessage",
          approval_prompt: "force",
          include_granted_scopes: false,
          scope,
        })
        .then((data) => {
          if (data.code) callback(data.code);
          else
            notify("danger", "Failed to get the code from googleAuth server.");
        });
    }
  }
};
