import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProjectStats({}) {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProjectData = async () => {
      try {
        const res = await axios.get("api/Project");
        setProjectData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-ball loading-md"></span>
          <p className="ml-3"> Loading Project Stats...</p>
        </div>
      ) : (
        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Total Projects</div>
            <div className="stat-value">{projectData.length}</div>
            <div className="stat-actions">
              <Link to={"/admin/project"}>
                <button className="btn btn-xs">View Projects</button>
              </Link>
            </div>
          </div>

          {/* <div className="stat">
            <div className="stat-title">Total Sub Categories</div>
            <div className="stat-value">{subCategoryData.length}</div>
            <div className="stat-actions">
              <Link to={"/admin/sub-category"}>
                <button className="btn btn-xs">View Sub Category</button>
              </Link>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
}

export default ProjectStats;
