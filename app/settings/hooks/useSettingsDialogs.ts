import { useState } from "react";

export default function useSettingsDialogs() {
  const [dialogs, setDialogs] = useState({
    save: false,
    addField: false,
    editField: false,
    addApiKey: false,
    editApiKey: false,
    editAdmin: false,
    confirm: false,
  });

  const openDialog = (dialogName: string) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: true }));
  };

  const closeDialog = (dialogName: string) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  return { dialogs, openDialog, closeDialog };
}
