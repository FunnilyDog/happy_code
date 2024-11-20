//路由表配置：src/routes/index.jsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const routes = [
  // Navigate 重定向
  {
    path: "/",
    element: <Navigate to="/test" />
  },
  {
    path: "/testContext",
    Component: lazy(() => import("../pages/test"))
  },
  {
    path: "/test",
    Component: lazy(() => import("../pages/test"))
  }
];

export default routes;
