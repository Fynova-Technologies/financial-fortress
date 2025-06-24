
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type SaveFn = () => Promise<void>;

interface SaveContextType {
  /** The current page’s save function */
  save: SaveFn;
  /** Pages call this to register their own save handler */
  registerSave: (fn: SaveFn) => void;
}

const SaveContext = createContext<SaveContextType>({
  save: async () => {
    console.warn("No save handler registered");
  },
  registerSave: () => {},
});

export function SaveProvider({ children }: { children: ReactNode }) {
  const [saveFn, setSaveFn] = useState<SaveFn>(() => async () => {
    console.warn("no save handler");
  });

  const registerSave = useCallback((fn: SaveFn) => {
    setSaveFn(() => fn);
  }, []);

  return (
    <SaveContext.Provider value={{ save: saveFn, registerSave }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  return useContext(SaveContext);
}
