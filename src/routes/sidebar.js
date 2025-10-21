/** Icons are imported separatly to reduce build time */
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import CubeIcon from "@heroicons/react/24/outline/CubeIcon";
import CubeTransparentIcon from "@heroicons/react/24/outline/CubeTransparentIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/app/dashboard", // url
    icon: <Squares2X2Icon className={iconClasses} />, // icon component
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/app/admins",
    icon: <UserCircleIcon className={iconClasses} />,
    name: "Admins",
  },
  {
    path: "/app/people",
    icon: <UserIcon className={iconClasses} />,
    name: "People",
  },
  {
    path: "/app/category",
    icon: <CubeIcon className={iconClasses} />,
    name: "Category",
  },
  {
    path: "/app/sub-category",
    icon: <CubeTransparentIcon className={iconClasses} />,
    name: "Sub Category",
  },
  {
    path: "/app/transactions",
    icon: <CurrencyDollarIcon className={iconClasses} />,
    name: "Transactions",
  },
  {
    path: "/app/charts",
    icon: <ChartBarIcon className={iconClasses} />,
    name: "Analytics",
  },

  {
    path: "/app/calendar",
    icon: <CalendarDaysIcon className={iconClasses} />,
    name: "Calendar",
  },

  {
    path: "", //no url needed as this has submenu
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />, // icon component
    name: "Pages", // name that appear in Sidebar
    submenu: [
      {
        path: "/login",
        icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
        name: "Login",
      },
      {
        path: "/register",
        icon: <UserIcon className={submenuIconClasses} />,
        name: "Register",
      },
      {
        path: "/forgot-password",
        icon: <KeyIcon className={submenuIconClasses} />,
        name: "Forgot Password",
      },
      {
        path: "/app/blank",
        icon: <DocumentIcon className={submenuIconClasses} />,
        name: "Blank Page",
      },
      {
        path: "/app/404",
        icon: <ExclamationTriangleIcon className={submenuIconClasses} />,
        name: "404",
      },
    ],
  },
  {
    path: "",
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />,
    name: "Settings",
    submenu: [
      {
        path: "/app/admin-profile",
        icon: <UserIcon className={submenuIconClasses} />,
        name: "Profile",
      },
      {
        path: "/app/settings-billing",
        icon: <WalletIcon className={submenuIconClasses} />,
        name: "Billing",
      },
      {
        path: "/app/settings-team",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Team Members",
      },
    ],
  },
  {
    path: "",
    icon: <DocumentTextIcon className={`${iconClasses} inline`} />,
    name: "Documentation",
    submenu: [
      {
        path: "/app/getting-started",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Getting Started",
      },
      {
        path: "/app/features",
        icon: <TableCellsIcon className={submenuIconClasses} />,
        name: "Features",
      },
      {
        path: "/app/components",
        icon: <CodeBracketSquareIcon className={submenuIconClasses} />,
        name: "Components",
      },
    ],
  },
];

export default routes;
