import { useMutation } from "@tanstack/react-query";
import { parseResume } from "../api/parse-resume-client";

export function useParseResumeMutation() {
  return useMutation({ mutationFn: parseResume });
}
