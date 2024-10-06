export interface ToastContextType {
  content: string;
  updateContent: (newContent: string, duration?: number) => void;
}
