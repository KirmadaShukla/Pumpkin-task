import instance from "./axios";

const getAuthConfig = (config = {}) => {
  const token = localStorage.getItem("token");
  const headers = { ...config.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { ...config, headers };
};

export const postRequest = (url, data, config) => {
  return instance.post(url, data, getAuthConfig(config));
};

export const getRequest = (url, config) => {
  return instance.get(url, getAuthConfig(config));
};

export const putRequest = (url, data, config) => {
  return instance.put(url, data, getAuthConfig(config));
};

export const deleteRequest = (url, config) => {
  return instance.delete(url, getAuthConfig(config));
};
