// import React from "react";
import { store } from "react-notifications-component";
// import styled from "styled-components";

// const StyleNot = styled.span`
//   background: red;
//   width: 100%;
//   border-radius: 5px;
//   padding: 5px;
// `;

// const Comp = props => <StyleNot id="hhhhh">{props.children}</StyleNot>;
let notificationObject = {
  title: "",
  message: "",
  type: "default",
  insert: "top",
  container: "top-right",

  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "fadeOut"],
  // content: <Comp>{message}</Comp>,
  dismiss: {
    duration: 3000,
    pauseOnHover: true,
    showIcon: true,
    click: true,
  },
  width: 400,
};
const notify = (type, message, title) => {
  if (typeof message === "string") {
    let ntCopy = { ...notificationObject };
    ntCopy.type = type;
    ntCopy.message = message;
    ntCopy.title = title || "";
    store.addNotification(ntCopy);
  } else if (typeof message === "object") {
    if (Array.isArray(message)) {
      message.map((mss) => {
        let ntCopy = { ...notificationObject };
        ntCopy.type = type;
        ntCopy.message = mss;
        ntCopy.title = title || "";
        store.addNotification(ntCopy);
        return null;
      });
    } else {
      if (typeof message.error === "string") {
        let ntCopy = { ...notificationObject };
        ntCopy.type = type;
        ntCopy.message = message.error;
        ntCopy.title = title || "";
        store.addNotification(ntCopy);
      } else if (Array.isArray(message.error)) {
        message.error.map((mss) => {
          let ntCopy = { ...notificationObject };
          ntCopy.type = type;
          ntCopy.message = mss;
          ntCopy.title = title || "";
          store.addNotification(ntCopy);
          return null;
        });
      } else if (Array.isArray(message.errors)) {
        message.errors.map((mss) => {
          let ntCopy = { ...notificationObject };
          ntCopy.type = type;
          ntCopy.message = mss;
          ntCopy.title = title || "";
          store.addNotification(ntCopy);
          return null;
        });
      } else if (message.customError) {
        let ntCopy = { ...notificationObject };
        ntCopy.type = type;
        ntCopy.message = `${message.customError}`;
        ntCopy.title = title || "";
        store.addNotification(ntCopy);
      }
    }
  }
};

export default notify;
