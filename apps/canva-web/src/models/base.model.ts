export type BaseResponseModel<T> = {
  success?: boolean;
  data?: T;
  error?: Error;
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type Error = {
  detail: unknown;
  message: string;
  name: string;
  status: number;
}


