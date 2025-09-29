import { useEffect, useRef } from "react";

function useChatScroll(dep: any) {
    const ref = useRef<HTMLElement | null>(null); // ✅ initialize with null

    useEffect(() => {
        const timer = setTimeout(() => {
            if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, 100);

        return () => clearTimeout(timer); // clean up
    }, [dep]);

    return ref;
}

export default useChatScroll;
