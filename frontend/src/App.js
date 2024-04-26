import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./components/navbar";
import { AuthProvider } from "./context/";
import { useRoutes } from "react-router-dom";
import Home from "./pages";
import HistoryPage from "./pages/history";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/history",
      element: <HistoryPage />,
    },

  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div>{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
