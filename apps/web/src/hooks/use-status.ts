import { useState } from "react";

/**An abstraction of useState for keeping track of asynchronous action statuses. Provides convenience variables for loading, error and success-states. */
export function useStatus(initialStatus?: string) {
  const [status, setStatus] = useState<string>(initialStatus);
  const loading = status === "loading";
  const success = status === "success";
  const error = status !== "success" && status !== "loading";
  return { status, loading, success, error, setStatus };
}
