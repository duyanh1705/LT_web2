import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/public", // Adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});
async function callApi(endpoint, method = "GET", body, params) {
  const token = await AsyncStorage.getItem("authToken");

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
        // Handle unauthorized case, possibly navigate to the login screen
        // E.g., navigation.navigate("Login");
      } else {
        console.error("API call error:", error);
      }
      throw error;
    });
}

export function GET_ALL(endpoint, params) {
  return callApi(endpoint, "GET", null, params);
}

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

export async function LOGIN(body) {
  const API_URL_LOGIN = "http://localhost:8080/api/login";

  try {
    const response = await axios.post(API_URL_LOGIN, body, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const token = response.data.token || response.data["jwt-token"];
      if (token) {
        await AsyncStorage.setItem("authToken", token);
      } else {
        console.error("Token not found in response");
      }
    } else {
      console.error("Login failed with status:", response.status);
    }
    return response;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
}

export function searchProducts(keyword) {
  return callApi(`/products/search?keyword=${keyword}`, "GET");
}

export async function REGISTER(data, navigate) {
  const API_URL_REGISTER = "http://localhost:8080/api/register";

  const payload = {
    userId: 0,
    firstName: data.firstName,
    lastName: data.lastName,
    mobileNumber: data.mobileNumber,
    email: data.email,
    password: data.password,
    roles: [{ roleId: 0, roleName: data.roleName || "USER" }],
    address: {
      addressId: 0,
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

  try {
    const response = axios.post(API_URL_REGISTER, payload, {
      headers: { "Content-Type": "application/json" },
    });

    Alert.alert("Success", "Registration successful!");
    navigate("Login"); // Use the navigation function for redirect
    return {
      success: true,
      message: response.data.message || "Registration successful",
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "Registration failed. Please try again.";
    Alert.alert("Error", message);
    return { success: false, message };
  }
}
