import { createContext, useContext } from "react";
import ChatScreen from "./screens/chatScreen";

const DataContext = createContext();

let initialData = {
  user: {}
}

function App() {
  return (
    <ChatScreen />
  );
}

export default App;
