// TYPES
import { ApiError } from "@/types";

export async function handleError(response: Response): Promise<never> {
  let error: ApiError;

  try {
    error = (await response.json()) as ApiError;
  } catch {
    error = {
      status: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, Please try again later.",
      timestamp: new Date().toISOString(),
    };
  }

  throw error;
}
