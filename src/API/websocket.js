import { io } from "socket.io-client";
import URL from "./apiURL";

const socket = io(`${URL}`, { autoConnect: false });

export default socket;
