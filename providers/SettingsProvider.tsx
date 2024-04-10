import { PropsWithChildren, createContext, useContext, useState } from "react";

type Settings = {
  isSideMenuOpen: boolean;
};

type ContextType = {
  settings: Settings;
  updateSettings: (updatedSettings: Partial<Settings>) => void;
};

const initialSettings: Settings = {
  isSideMenuOpen: false,
};

export const SettingsContext = createContext<ContextType | undefined>(
  undefined,
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

const SettingsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const updateSettings = (updatedSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...updatedSettings });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
