import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL,
  timeout: 60_000,
});

const wait = (milliseconds, signal) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, milliseconds);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new axios.CanceledError("Request aborted"));
    }, { once: true });
  });

const canRetry = (error, signal) =>
  !signal?.aborted &&
  !axios.isCancel(error) &&
  !(error.response?.status >= 400 && error.response?.status < 500);

export const getWithRetry = async (request, signal) => {
  try {
    return await request(signal);
  } catch (error) {
    if (!canRetry(error, signal)) throw error;
    await wait(400, signal);
    return request(signal);
  }
};
