// All components mapping with path for internal routes

import { lazy } from "react";

// const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
// * People Routes
const PeopleProfile = lazy(() => import("../pages/protected/PeopleProfile.js"));
const Dashboard = lazy(() =>
  import("../pages/protected/people/PeopleDashboard.js")
);

// * Expense Routes
const Expense = lazy(() => import("../pages/protected/people/Expense.js"));
const AddExpense = lazy(() =>
  import("../features/peopleSide/expense/components/AddExpense.jsx")
);
const EditExpense = lazy(() =>
  import("../features/peopleSide/expense/components/EditExpense.jsx")
);

// * Income Routes
const Income = lazy(() => import("../pages/protected/people/Income.js"));
const AddIncome = lazy(() =>
  import("../features/peopleSide/income/components/AddIncome.jsx")
);
const EditIncome = lazy(() =>
  import("../features/peopleSide/income/components/EditIncome.jsx")
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
  // expense routes
  {
    path: "/expense",
    component: Expense,
  },
  {
    path: "/expense/add",
    component: AddExpense,
  },
  {
    path: "/expense/edit/:expenseId",
    component: EditExpense,
  },
  // income routes
  {
    path: "/income",
    component: Income,
  },
  {
    path: "/income/add",
    component: AddIncome,
  },
  {
    path: "/income/edit/:incomeId",
    component: EditIncome,
  },
  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
