import axios from "axios";

const api = axios.create({
  baseURL: "https://userpost-management-icse.onrender.com/",
});

export const addUser = (user) => api.post("/users", user);

export const addPost = (post) => api.post("/posts", post);

export const getPosts = () => api.get("/posts");
export const getUsers = () => api.get("/users");