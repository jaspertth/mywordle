import React, { useContext } from "react";
import { ToastContext } from "../../providers/toast-provider";

export const Toast: React.FC = () => {
  const { content } = useContext(ToastContext);
  return content ? <div className="toast">{content}</div> : null;
};
