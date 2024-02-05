import { io } from "socket.io-client";
import URL from "./apiURL";

const socket = io(`${URL}`, { autoConnect: false, auth: { token: null } });

export default socket;
