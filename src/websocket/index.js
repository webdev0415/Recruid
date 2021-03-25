import { WS_ROOT_PATH } from "constants/api";
import actionCable from "actioncable";

export const CableApp = {};

//v2
//export const CableApp = { uncompleted_tasks: 0 };

export const connectWebSocket = () => {
  CableApp.cable = actionCable.createConsumer(`${WS_ROOT_PATH}/cable/`);
};
