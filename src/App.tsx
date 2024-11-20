import { createHashRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import routes from "./roots";
import "./App.css";

function App() {
  const router = createHashRouter(routes as any);
  return <RouterProvider router={router} />;
}

export default App;
