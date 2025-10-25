import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CategoryStats({}) {
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get("api/Category");
      setCategoryData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubCategoryData = async () => {
    try {
      const res = await axios.get("api/SubCategory");
      setSubCategoryData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchCategoryStats = async () => {
      try {
        await fetchCategoryData();
        await fetchSubCategoryData();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryStats();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-ball loading-md"></span>
          <p className="ml-3"> Loading Category Stats...</p>
        </div>
      ) : (
        <div className="stats bg-base-100 shadow">
          <div className="stat">
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">{categoryData.length}</div>
            <div className="stat-actions">
              <Link to={"/admin/category"}>
                <button className="btn btn-xs">View Category</button>
              </Link>
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Total Sub Categories</div>
            <div className="stat-value">{subCategoryData.length}</div>
            <div className="stat-actions">
              <Link to={"/admin/sub-category"}>
                <button className="btn btn-xs">View Sub Category</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryStats;
