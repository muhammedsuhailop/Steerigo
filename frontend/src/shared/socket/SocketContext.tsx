import { createContext, useContext } from "react";

export type SocketContextType = {
  socketReady: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socketReady: false,
});

export const useSocketContext = () => useContext(SocketContext);
