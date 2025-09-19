// A simple utility for using the browser's localStorage as a database.

export const loadFromStorage = (key) => {
   try {
       const serializedState = localStorage.getItem(key);
       if (serializedState === null) {
           return undefined; // No state saved
       }
       return JSON.parse(serializedState);
   } catch (err) {
       console.error("Error loading state from localStorage:", err);
       return undefined;
   }
};

export const saveToStorage = (key, state) => {
   try {
       const serializedState = JSON.stringify(state);
       localStorage.setItem(key, serializedState);
   } catch (err) {
       console.error("Error saving state to localStorage:", err);
   }
};
