import "./App.css";
import Admin from "./admin/admin.jsx";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./admin/login.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Layout /> },
  {
    index: true,
    element: <Login />,
    children: [
      {
        path: "admin",
        element: <Admin />,
        children: [
          {
            path: ":model/",
            children: [
              { path: "add", element: <Outlet /> },
              { path: ":item", element: <Outlet /> },
            ],
          },
        ],
      },
    ],
  },
]);

export const queryClient = new QueryClient({ retry: 5 });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default App;
