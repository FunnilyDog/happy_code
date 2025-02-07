//路由表配置：src/routes/index.jsx
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import TestContext from "../pages/testContext";
import path from "path";

// import Test from "../pages/test";

// const TestContext = lazy(() => import("../pages/testContext"));
const Test = lazy(() => import("../pages/test"));
const TestStore = lazy(() => import("../pages/testStore"));
const TestFormily = lazy(() => import("../pages/testFormily"));
const VideoPlay = lazy(() => import("../pages/videoPlay"));

const routes = [
  // Navigate 重定向
  {
    path: "/",
    element: <Navigate to="test" />
  },
  {
    path: "testContext",
    element: (
      <Suspense>
        <TestContext />
      </Suspense>
    )
  },
  {
    path: "testStore",
    element: (
      <Suspense>
        <TestStore />
      </Suspense>
    )
  },
  {
    path: "test",
    element: (
      <Suspense>
        <Test />
      </Suspense>
    )
  },
  {
    path: "testFormily",
    element: <TestFormily />
    // children: [
    //   {
    //     path: "formController",
    //     element: <FormController />
    //   }
    // ]
  },
  {
    path: "VideoPlay",
    element: <VideoPlay />
  }
];

export default routes;
