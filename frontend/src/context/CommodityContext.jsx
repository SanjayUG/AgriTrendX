import React, { createContext, useContext } from 'react';

const CommodityContext = createContext();

export const useCommodity = () => {
  const context = useContext(CommodityContext);
  if (!context) {
    throw new Error('useCommodity must be used within a CommodityProvider');
  }
  return context;
};

export const CommodityProvider = ({ children, value }) => {
  return (
    <CommodityContext.Provider value={value}>
      {children}
    </CommodityContext.Provider>
  );
}; 