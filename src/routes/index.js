// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Charts = lazy(() => import("../pages/protected/Charts"));

// * Admin Routes
const Admins = lazy(() => import("../pages/protected/Admin.js"));
const AdminProfile = lazy(() => import("../pages/protected/AdminProfile.js"));

// * People Routes
const People = lazy(() => import("../pages/protected/People"));
const AddPeople = lazy(() =>
  import("../features/people/components/AddPeople.jsx")
);
const EditPeople = lazy(() =>
  import("../features/people/components/EditPeople.jsx")
);

// * Category Routes
const Category = lazy(() => import("../pages/protected/Category.js"));

const Calendar = lazy(() => import("../pages/protected/Calendar"));
const Team = lazy(() => import("../pages/protected/Team"));
const Transactions = lazy(() => import("../pages/protected/Transactions"));
const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const DocFeatures = lazy(() => import("../pages/DocFeatures"));
const DocComponents = lazy(() => import("../pages/DocComponents"));

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  // admin routes
  {
    path: "/admins",
    component: Admins,
  },
  {
    path: "/admin-profile",
    component: AdminProfile,
  },
  // people routes
  {
    path: "/people",
    component: People,
  },
  {
    path: "/people/add",
    component: AddPeople,
  },
  {
    path: "/people/edit/:peopleId",
    component: EditPeople,
  },
  // category routes
  {
    path: "/category",
    component: Category,
  },
  // {
  //   path: "/category/add",
  //   component: AddPeople,
  // },
  // {
  //   path: "/people/edit/:peopleId",
  //   component: EditPeople,
  // },
  // sub-category routes
  {
    path: "/sub-category",
    component: Category,
  },
  {
    path: "/settings-team",
    component: Team,
  },
  {
    path: "/calendar",
    component: Calendar,
  },
  {
    path: "/transactions",
    component: Transactions,
  },

  {
    path: "/getting-started",
    component: GettingStarted,
  },
  {
    path: "/features",
    component: DocFeatures,
  },
  {
    path: "/components",
    component: DocComponents,
  },

  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
