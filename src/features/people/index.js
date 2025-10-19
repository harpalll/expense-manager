import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { showNotification } from "../common/headerSlice";
import SuspenseContent from "../../containers/SuspenseContent.js";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const data = [
  {
    PeopleID: 1,
    PeopleCode: "SLACK01",
    Password: "Pass@123",
    PeopleName: "Slack",
    Email: "contact@slack.com",
    MobileNo: "+1234567890",
    Description:
      "Slack is an instant messaging program designed by Slack Technologies and owned by Salesforce.",
    UserID: 101,
    Created: new Date("2023-01-01T10:00:00"),
    Modified: new Date("2023-01-05T12:00:00"),
    IsActive: true,
  },
  {
    PeopleID: 2,
    PeopleCode: "FACEBOOK01",
    Password: "Fb@12345",
    PeopleName: "Facebook",
    Email: "support@facebook.com",
    MobileNo: "+1987654321",
    Description:
      "Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., and TheFacebook.",
    UserID: 102,
    Created: new Date("2023-02-01T11:00:00"),
    Modified: new Date("2023-02-03T09:00:00"),
    IsActive: false,
  },
  {
    PeopleID: 3,
    PeopleCode: "LINKEDIN01",
    Password: "Linked@123",
    PeopleName: "LinkedIn",
    Email: "support@linkedin.com",
    MobileNo: "+1122334455",
    Description:
      "LinkedIn is a business and employment-focused social media platform that works through websites and mobile apps.",
    UserID: 103,
    Created: new Date("2023-03-01T14:00:00"),
    Modified: new Date("2023-03-02T10:00:00"),
    IsActive: true,
  },
  {
    PeopleID: 4,
    PeopleCode: "GOOGLEADS01",
    Password: "GAds@123",
    PeopleName: "Google Ads",
    Email: "ads@google.com",
    MobileNo: "+1222333444",
    Description:
      "Google Ads is an online advertising platform developed by Google, where advertisers bid to display brief advertisements, service offerings.",
    UserID: 104,
    Created: new Date("2023-04-01T09:30:00"),
    Modified: new Date("2023-04-05T15:00:00"),
    IsActive: false,
  },
  {
    PeopleID: 5,
    PeopleCode: "GMAIL01",
    Password: "Gmail@123",
    PeopleName: "Gmail",
    Email: "support@gmail.com",
    MobileNo: "+1555666777",
    Description:
      "Gmail is a free email service provided by Google. As of 2019, it had 1.5 billion active users worldwide.",
    UserID: 105,
    Created: new Date("2023-05-01T13:00:00"),
    Modified: new Date("2023-05-02T14:00:00"),
    IsActive: false,
  },
  {
    PeopleID: 6,
    PeopleCode: "SALESFORCE01",
    Password: "SF@12345",
    PeopleName: "Salesforce",
    Email: "support@salesforce.com",
    MobileNo: "+1999888777",
    Description:
      "It provides customer relationship management software and applications focused on sales, customer service, marketing automation.",
    UserID: 106,
    Created: new Date("2023-06-01T12:00:00"),
    Modified: new Date("2023-06-03T10:00:00"),
    IsActive: false,
  },
  {
    PeopleID: 7,
    PeopleCode: "HUBSPOT01",
    Password: "Hub@12345",
    PeopleName: "Hubspot",
    Email: "support@hubspot.com",
    MobileNo: "+1444555666",
    Description:
      "American developer and marketer of software products for inbound marketing, sales, and customer service.",
    UserID: 107,
    Created: new Date("2023-07-01T08:00:00"),
    Modified: new Date("2023-07-02T09:00:00"),
    IsActive: false,
  },
];

const columns = [
  { accessorKey: "peopleID", header: "Id" },
  { accessorKey: "peopleCode", header: "Code" },
  { accessorKey: "peopleName", header: "Name" },
  { accessorKey: "emailAddress", header: "Email" },
  { accessorKey: "mobileNo", header: "Mobile" },
  {
    accessorKey: "IsActive",
    header: "Active",
    cell: ({ getValue }) => getStatusBadge(getValue()),
  },
];

const getStatusBadge = (isActive) => {
  return isActive ? (
    <div className="badge badge-success">Active</div>
  ) : (
    <div className="badge badge-error">Deleted</div>
  );
};

function People() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/People");
        toast.success(response.data.message);
        setPeople(response.data.data);
        console.log(people);
      } catch (error) {
        if (error.response) {
          toast.error(`ERROR: ${error.response.data.message}`);
          console.error(
            `ERROR: Status Code: ${error.response.status} || ERRORS:`,
            error.response.data
          );
        } else if (error.request) {
          // no response
          toast.error("ERROR: No response received from server");
          console.error(
            "ERROR: No response received from server",
            error.request
          );
        } else {
          // Something else went wrong
          toast.error("ERROR: Request setup failed");
          console.error("ERROR: Request setup failed", error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  const table = useReactTable({
    data: people,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const TopSideButtons = () => {
    return (
      <div className="inline-block float-right">
        <Link to={"/app/people/add"}>
          <button className="btn px-6 btn-sm normal-case btn-primary">
            Add New
          </button>
        </Link>
      </div>
    );
  };

  // const updateIntegrationStatus = (index) => {
  //   let people = people[index];
  //   setPeople(
  //     people.map((i, k) => {
  //       if (k === index) return { ...i, isActive: !i.IsActive };
  //       return i;
  //     })
  //   );
  //   dispatch(
  //     showNotification({
  //       message: `${people.PeopleName} ${
  //         people.IsActive ? "disabled" : "enabled"
  //       }`,
  //       status: 1,
  //     })
  //   );
  // };

  return (
    <>
      <TitleCard
        title="People"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {loading ? (
          <SuspenseContent />
        ) : (
          <div className="w-full">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="mb-4 p-2 rounded input input-bordered"
            />
            <table className="table w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-2 py-1 font-bold border"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-base-300 cursor-pointer "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-2 py-1 border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TitleCard>
    </>
  );
}

export default People;
