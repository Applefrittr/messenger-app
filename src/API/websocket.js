import { io } from "socket.io-client";
import URL from "./apiURL";

const socket = io(`${URL}`, {
  autoConnect: false,
  auth: { token: null },
  reconnectionDelay: 5000,
  reconnectionDelayMax: 5000,
});

export default socket;
