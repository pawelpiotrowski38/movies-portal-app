import { useEffect, useRef } from "react";

export function useClickOutside(callback) {
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref && ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);

    return ref;
}
