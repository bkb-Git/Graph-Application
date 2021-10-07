import { useEffect, useRef } from "react";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    return (ref.current = value);
  }, [value]);

  return ref.current;
};

export default usePrevious;
