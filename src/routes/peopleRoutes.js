// All components mapping with path for internal routes

import { lazy } from "react";

// const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
// * People Routes
const PeopleProfile = lazy(() => import("../pages/protected/PeopleProfile.js"));
const Dashboard = lazy(() =>
  import("../pages/protected/people/PeopleDashboard.js")
);
// * Category Routes
const Category = lazy(() => import("../pages/protected/Category.js"));

const routes = [
  {
    path: "/people-dashboard",
    component: Dashboard,
  },
  // people routes
  {
    path: "/people-profile",
    component: PeopleProfile,
  },
  // category routes
  {
    path: "/category",
    component: Category,
  },
  // sub-category routes
  {
    path: "/sub-category",
    component: Category,
  },
  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
