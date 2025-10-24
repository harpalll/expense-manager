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

// * Category Routes
const Category = lazy(() => import("../pages/protected/Category.js"));

// * Sub Category Routes
const SubCategory = lazy(() => import("../pages/protected/SubCategory.js"));

// * Project Routes
const Project = lazy(() => import("../pages/protected/Project.js"));
const AddProject = lazy(() =>
  import("../features/project/components/AddProject.jsx")
);
const EditProject = lazy(() =>
  import("../features/project/components/EditProject.jsx")
);

const Calendar = lazy(() => import("../pages/protected/Calendar"));
const Team = lazy(() => import("../pages/protected/Team"));
const Transactions = lazy(() => import("../pages/protected/Transactions"));
const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const DocFeatures = lazy(() => import("../pages/DocFeatures"));
const DocComponents = lazy(() => import("../pages/DocComponents"));

const routes = [
  {
    path: "/app/dashboard",
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
  // category routes
  {
    path: "/category",
    component: Category,
  },
  // sub-category routes
  {
    path: "/sub-category",
    component: SubCategory,
  },
  // project routes
  {
    path: "/project",
    component: Project,
  },
  {
    path: "/project/add",
    component: AddProject,
  },
  {
    path: "/project/edit/:projectId",
    component: EditProject,
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
