import { loadEnvVariable } from "@pondfm/server-utils";

export function getDomainUrl() {
  return loadEnvVariable("FRONT_END_URL", false) || "http://localhost:5173";
}
