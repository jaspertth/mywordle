import React, { createContext, useState, ReactNode } from "react";
import { ToastContextType } from "./interface";

export const ToastContext = createContext<ToastContextType>({
  content: "",
  updateContent: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<string>("");

  const updateContent = (newContent: string, duration: number = 0) => {
    console.log(newContent, duration);
    setContent(newContent);
    if (duration > 0) {
      setTimeout(() => {
        setContent("");
      }, duration);
    }
  };
  return (
    <ToastContext.Provider value={{ content, updateContent }}>
      {children}
    </ToastContext.Provider>
  );
};
