import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/public", // Adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});
function callApi(endpoint, method = "GET", body, params) {
  const token = localStorage.getItem("authToken");

  const queryString = params ? new URLSearchParams(params).toString() : "";
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  const config = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    data: body ? JSON.stringify(body) : null,
  };

  return axiosInstance(config)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized. Redirecting to login.");
        // Check if the current path is not already /login to avoid infinite redirects
        // if (window.location.pathname !== "/login") {
        //   window.location.href = "/login"; // Redirect to login
        // }
      } else {
        console.error("API call error:", error);
      }
      throw error;
    });
}

export function GET_ALL(endpoint, params) {
  return callApi(endpoint, "GET", null, params);
}
GET_ALL("products/search", {
  pageNumber: 0,
  pageSize: 10,
  sortBy: "productId",
  sortOrder: "asc",
  search: "hoa",
})
  .then((data) => {
    console.log("Search results:", data);
  })
  .catch((error) => {
    console.error("Failed to fetch search results:", error);
  });
export function GET_ID(endpoint, id) {
  return callApi(`${endpoint}/${id}`, "GET");
}

export function POST_ADD(endpoint, data) {
  return callApi(endpoint, "POST", data);
}

export function PUT_EDIT(endpoint, data) {
  return callApi(endpoint, "PUT", data);
}

export function DELETE_ID(endpoint) {
  return callApi(endpoint, "DELETE");
}

export function LOGIN(body) {
  const API_URL_LOGIN = "http://localhost:8080/api/login";

  console.log("Sending login request:", body); // Log the credentials being sent

  return axiosInstance
    .post(API_URL_LOGIN, body, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("Login successful, response:", response); // Log the successful response
        const token = response.data.token || response.data["jwt-token"];
        if (token) {
          localStorage.setItem("authToken", token);
        } else {
          console.error("Token not found in response");
        }
      } else {
        console.error("Login failed with status:", response.status);
      }
      return response;
    })
    .catch((error) => {
      console.log("Login error:", error);
      throw error;
    });
}
export function searchProducts(keyword) {
  return callApi(`/products/search?keyword=${keyword}`, "GET");
}
export function REGISTER(data, navigate) {
  const API_URL_REGISTER = "http://localhost:8080/api/register";

  // Construct the payload with default values
  const payload = {
    userId: 0, // Assuming userId is auto-generated or not required during registration
    firstName: data.firstName,
    lastName: data.lastName,
    mobileNumber: data.mobileNumber,
    email: data.email,
    password: data.password,
    roles: [
      {
        roleId: 0, // Assuming roleId should be provided or can be defaulted to 0
        roleName: data.roleName || "USER", // Default role can be USER or according to your needs
      },
    ],
    address: {
      addressId: 0, // Assuming addressId should be provided or can be defaulted to 0
      street: data.street || "Default Street",
      buildingName: data.buildingName || "Default Building",
      city: data.city || "Default City",
      state: data.state || "Default State",
      country: data.country || "Default Country",
      pincode: data.pincode || "000000",
    },
    cart: {
      cartId: 0,
      totalPrice: 0,
      products: [
        {
          productId: 0,
          productName: "Default Product",
          image: "default.png",
          description: "Default Description",
          quantity: 1,
          price: 0,
          discount: 0,
          specialPrice: 0,
          categoryId: 0,
        },
      ],
    },
  };

  // Log the payload for debugging
  console.log("Register payload:", payload);

  return axiosInstance
    .post(API_URL_REGISTER, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      navigate("/login");
      return {
        success: true,
        message: response.data.message || "Registration successful",
      };
    })
    .catch((error) => {
      if (error.response) {
        console.error("Registration failed:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(message); // Show an error alert
      return {
        success: false,
        message,
      };
    });
}
