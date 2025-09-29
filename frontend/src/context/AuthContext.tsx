import {
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";

export type AuthUserType = {
    id: string;
    fullName: string;
    email: string;
    profilePic: string;
    gender: string;
};

interface AuthContextType {
    authUser: AuthUserType | null;
    setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    authUser: null,
    setAuthUser: () => {},
    isLoading: true,
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // AuthContext.tsx
    useEffect(() => {
        const fetchAuthUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return; // no user logged in
            }

            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await res.json();
                        throw new Error(data.error || `HTTP error ${res.status}`);
                    } else {
                        throw new Error(`Unexpected response: ${res.status} ${res.statusText}`);
                    }
                }

                const data = await res.json();
                setAuthUser(data);
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error("An unexpected error occurred");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthUser();
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
