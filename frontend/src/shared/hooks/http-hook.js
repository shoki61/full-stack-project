import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async(url, method = 'GET', body = null, headers={}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url, {
                headers,
                method,
                body,
                signal: httpAbortCtrl.signal
            });
            const responseData = await response.json();
            if(!response.ok){
              throw new Error(responseData.message);
            };
            
            return responseData;
        } catch(e) {
            setError(e.message);
        };
        setIsLoading(true);
    }, []);

    const clearError = () => setError(null);

    useEffect(() => {
        return () => activeHttpRequests.current.forEach( abortCtrl => abortCtrl.abort());
    }, []);

    return { isLoading, error, sendRequest, clearError };
};