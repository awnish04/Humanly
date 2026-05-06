"use client";

import { useState, useCallback } from "react";

export function useDiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback(() => {
    setIsOpen(true);
    // Clear session storage to allow popup to show again
    sessionStorage.removeItem("discount-popup-shown");
    sessionStorage.removeItem("discount-popup-dismissed");
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem("discount-popup-dismissed", "true");
  }, []);

  const resetPopup = useCallback(() => {
    sessionStorage.removeItem("discount-popup-shown");
    sessionStorage.removeItem("discount-popup-dismissed");
  }, []);

  return {
    isOpen,
    openPopup,
    closePopup,
    resetPopup,
  };
}
