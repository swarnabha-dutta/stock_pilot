"use client";

import { useCallback, useRef } from "react";

export function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);

    return useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback();
        }, delay);
    }, [callback, delay]);
}
