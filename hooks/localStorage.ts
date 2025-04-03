export const useLocalStorage = () => {
  const getFromLocalStorage = (itemName: string): any | null => {
    const savedData = localStorage.getItem(itemName);

    if (savedData) {
      return JSON.parse(savedData);
    } else {
      return null;
    }
  };
  const setToLocalStorage = (itemName: string, data: any) => {
    localStorage.setItem(itemName, JSON.stringify(data));
  };
  return { getFromLocalStorage, setToLocalStorage };
};
