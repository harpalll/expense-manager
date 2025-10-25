/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import CubeIcon from "@heroicons/react/24/outline/CubeIcon";
import CubeTransparentIcon from "@heroicons/react/24/outline/CubeTransparentIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import BanknotesIcon from "@heroicons/react/24/outline/BanknotesIcon";

const iconClasses = `h-6 w-6`;

const routes = [
  {
    path: "/people/people-dashboard", // url
    icon: <Squares2X2Icon className={iconClasses} />, // icon component
    name: "Dashboard", // name that appear in Sidebar
  },
  // {
  //   path: "/people/category",
  //   icon: <CubeIcon className={iconClasses} />,
  //   name: "Category",
  // },
  // {
  //   path: "/people/sub-category",
  //   icon: <CubeTransparentIcon className={iconClasses} />,
  //   name: "Sub Category",
  // },
  {
    path: "/people/expense",
    icon: <CreditCardIcon className={iconClasses} />,
    name: "Expense",
  },
  {
    path: "/people/income",
    icon: <BanknotesIcon className={iconClasses} />,
    name: "Income",
  },
  // {
  //   path: "/people/charts",
  //   icon: <ChartBarIcon className={iconClasses} />,
  //   name: "Analytics",
  // },
];

export default routes;
