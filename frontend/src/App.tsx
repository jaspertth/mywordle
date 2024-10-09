import { Wordle } from "./components/wordle";
import { SocketProvider } from "./providers/socket-provider";
import { ToastProvider } from "./providers/toast-provider";

function App() {
  return (
    <SocketProvider>
      <ToastProvider>
        <div className="App">
          <Wordle />
        </div>
      </ToastProvider>
    </SocketProvider>
  );
}

export default App;
