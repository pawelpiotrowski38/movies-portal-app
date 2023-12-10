import { useEffect, useState } from "react";

export function useSessionStorageState(urlState, initialState, key) {
    const [value, setValue] = useState(function() {
        const storedValue = urlState.length > 0 ? urlState : JSON.parse(sessionStorage.getItem(key));
        return storedValue ? storedValue : initialState;
    });

    useEffect(function() {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}
