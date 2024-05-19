import Guard from "./Guard";
import store from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-4xl font-bold underline">Hello, world!</div>
        <div className="h-24"></div>
        <Guard />
      </div>
    </Provider>
  );
}

export default App;
