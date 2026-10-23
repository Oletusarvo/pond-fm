import { useState } from "react";

type TStatus = "loading" | "error" | "success" | "idle" | "exception";
/**An abstraction of useState for keeping track of asynchronous action statuses. Provides convenience variables for loading, error and success-states. */
export function useStatus<T extends string>(initialStatus?: T | TStatus) {
  const [status, setStatus] = useState<T | TStatus>(initialStatus);
  const loading = status === "loading";
  const success = status === "success";
  const error = status !== "success" && status !== "loading";
  return { status, loading, success, error, setStatus };
}
