import { createContext, useEffect, useState } from "react";

export const UiContext = createContext();

export const UiProvider = ({ children }) => {
  const [isSlideCartOpen, setIsSlideCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const openSlideCart = () => setIsSlideCartOpen(true);
  const closeSlideCart = () => setIsSlideCartOpen(false);
  const openCategories = () => setIsCategoriesOpen(true);
  const closeCategories = () => setIsCategoriesOpen(false);

  useEffect(() => {
    console.log(isCategoriesOpen)
  },[isCategoriesOpen])

  return (
    <UiContext.Provider value={ {isSlideCartOpen, openSlideCart, closeSlideCart,openCategories,closeCategories,isCategoriesOpen} }>
      {children}
    </UiContext.Provider>
  );
};
