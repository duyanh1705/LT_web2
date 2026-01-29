
import Slider from "../pages/home/Slider";

import Request from "../pages/home/Service";

import Service from "../pages/home/Service";
import Subscribe from "../pages/home/Subcrise";
import Region from "../pages/home/Region";
import Section1 from "../pages/home/Section1";
import React, { useEffect, useState } from "react";
import { GET_ALL } from "../api/apiService";

function Home(props) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "categoryId",
      sortOrder: "asc",
    };

    GET_ALL("categories", params)
      .then((response) => {
        setCategories(response.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

    return (
        <div class = "container">
        <Slider/>
        {categories.length > 0 &&
        categories.map((category) => (
          <Section1
            key={category.categoryId}
            categoryId={category.categoryId}
            categoryName={category.categoryName}
          />
        ))}
{/* <Request/>

<Service/> */}
<Region/>
<Subscribe/>
        </div>
    )
}
export default Home;