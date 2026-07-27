export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  status: string;
  message: string;
  timestamp: string;
  errors?: ApiFieldError[];
}
