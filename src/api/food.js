import { api, getWithRetry } from "./client.js";

export const createFoodListParams = ({ page, limit, category }) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category && category !== "All") params.set("category", category);
  return params;
};

export const fetchFoodPage = async ({ page, limit, category, signal }) => {
  const params = createFoodListParams({ page, limit, category });
  const response = await getWithRetry(
    (requestSignal) => api.get(`/api/food/list?${params}`, { signal: requestSignal }),
    signal,
  );
  return response.data;
};
