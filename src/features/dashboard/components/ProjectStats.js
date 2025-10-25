import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProjectStats({}) {
  const [projectData, setProjectData] = useState([]);
  const [totalPeople, setTotalPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTotalUsers = async () => {
    try {
      const res = await axios.get("api/People/");
      setTotalPeople(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    setLoading(true);
    const fetchProjectStat = async () => {
      try {
        await fetchProjectData();
        await fetchTotalUsers();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchProjectStat();
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

          <div className="stat">
            <div className="stat-title">Total People</div>
            <div className="stat-value">{totalPeople.length}</div>
            <div className="stat-actions">
              <Link to={"/admin/people"}>
                <button className="btn btn-xs">View People</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectStats;
