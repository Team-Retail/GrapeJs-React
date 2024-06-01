import { useEffect, useRef } from 'react';

function useTimeout(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setTimeout(() => {
      // @ts-ignore
      savedCallback.current();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}

export default useTimeout;
