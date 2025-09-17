import api from "./auth_api";

export type CreateProductPayload = {
  barcode: string;
  product_name: string;
  description?: string;
  price1: string | number;
  price2?: string | number;
  price3?: string | number;
  quantity?: number;
  production_date?: Date | string | null;
  expiration_date?: Date | string | null;
  image_path?: string | null;
  unitId: number;
  categoryId: number;
};

export const productService = {
  create: async (payload: CreateProductPayload) => {
    const res = await api.post("/add", payload);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get("/all");
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/${id}`);
    return res.data;
  },
  update: async (id: string, payload: Partial<CreateProductPayload>) => {
    const res = await api.put(`/${id}`, payload);
    return res.data;
  },
  remove: async (id: string) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },
};

export default productService;

