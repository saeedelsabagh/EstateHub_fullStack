
import { createContext, useContext, useReducer } from "react";
import estateReducer from "./Reducer";
import { initialState } from "./arrays";

const EstateContext = createContext();

export function EstateProvider({ children }) {
  const [state, dispatch] = useReducer(
    estateReducer,
    initialState
  );

  return (
    <EstateContext.Provider value={{ state, dispatch }}>
      {children}
    </EstateContext.Provider>
  );
}

export function useEstate() {
  return useContext(EstateContext);
}
