import { Dispatch, SetStateAction, useState, useEffect } from "react";

const usePersistedState = <T>(
  stateKey: string,
  initialState: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setInternalState] = useState<T>(() => {
    const existedState = localStorage.getItem(stateKey);
    return existedState ? JSON.parse(existedState) : initialState;
  });

  useEffect(() => {
    const existedState = localStorage.getItem(stateKey);
    if (existedState) {
      setInternalState(JSON.parse(existedState));
    }
  }, [stateKey]);

  const setState: Dispatch<SetStateAction<T>> = (params) => {
    setInternalState(params);
    localStorage.setItem(stateKey, JSON.stringify(params));
  };

  return [state, setState];
};

export default usePersistedState;
