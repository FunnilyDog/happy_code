//路由表配置：src/routes/index.jsx
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import TestContext from "../pages/testContext";
// import Test from "../pages/test";

// const TestContext = lazy(() => import("../pages/testContext"));
const Test = lazy(() => import("../pages/test"));

const routes = [
  // Navigate 重定向
  {
    path: "/",
    element: <Navigate to="/test" />
  },
  {
    path: "/testContext",
    element: (
      <Suspense>
        <TestContext />
      </Suspense>
    )
  },
  {
    path: "/test",
    element: (
      <Suspense>
        <Test />
      </Suspense>
    )
  }
];

export default routes;
