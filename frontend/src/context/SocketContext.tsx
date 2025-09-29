import {
    createContext,
    useState,
    useEffect,
    useContext,
    type ReactNode,
    useRef,
} from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within a SocketContextProvider");
    }
    return context;
};

const socketURL =
    import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { authUser, isLoading } = useAuthContext();

    useEffect(() => {
        // connect only if we have a valid userId
        if (authUser?.id && !isLoading) {
            const socket = io(socketURL, {
                query: { userId: authUser.id },
            });
            socketRef.current = socket;

            socket.on("getOnlineUsers", (users: string[]) => {
                setOnlineUsers(users);
            });

            return () => {
                socket.close();
                socketRef.current = null;
            };
        }

        // cleanup if user logs out
        if (!authUser && !isLoading && socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    }, [authUser?.id, isLoading]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContextProvider;
