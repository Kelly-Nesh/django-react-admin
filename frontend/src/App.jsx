import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CookiesProvider } from "react-cookie";

import Login from "./admin/login.jsx";
import Admin from "./admin/admin.jsx";
import AdminEdit from "./admin/adminEdit.jsx";
import AdminAdd from "./admin/adminAdd.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Outlet /> },
  {
    index: true,
    element: <Login />,
  },

  {
    path: "admin",
    children: [
      { path: "", element: <Admin /> },
      {
        path: ":model/",
        children: [
          { path: "add", element: <AdminEdit /> },
          { path: ":slug", element: <AdminEdit /> },
        ],
      },
    ],
  },
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 5, refetchOnWindowFocus: true, refetchOnMount: true },
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
