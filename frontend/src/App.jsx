import "./App.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Login from "./admin/login.jsx";
import Admin from "./admin/admin.jsx";
import { CookiesProvider } from "react-cookie";

const router = createBrowserRouter([
  { path: "/", element: <Outlet /> },
  {
    index: true,
    element: <Login />,
  },

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
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 5, refetchOnWindowFocus: false, refetchOnMount: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <CookiesProvider defaultSetOptions={{ path: "/", sameSite: true }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  </QueryClientProvider>
);

export default App;
