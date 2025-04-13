import React, { createContext, useContext } from 'react';

const StateContext = createContext();

export const useState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useState must be used within a StateProvider');
  }
  return context;
};

export const StateProvider = ({ children, value }) => {
  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
}; 