import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState<ConversationType[]>([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:5000/api/messages/conversations", {
                    method: "GET",
                    credentials: "include", // 👈 sends jwt cookie
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch conversations");
                }

                const data = await res.json();
                setConversations(data);
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error("Unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
};

export default useGetConversations;
