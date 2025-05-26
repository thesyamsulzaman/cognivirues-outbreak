import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

type Journals = Array<any>;

const onPostUpdateJournals = async (payload: Journals) => {
  const response = (await api().put("/api/journals/batch-update", {
    journals: payload,
  })) as any;

  if (!response.ok) {
    throw new Error("Something Went Wrong");
  }

  return response?.data;
};

const usePostUpdateJournals = () => {
  return useMutation({
    mutationKey: ["update-journals"],
    mutationFn: (params: Journals) => onPostUpdateJournals(params),
  });
};

export default usePostUpdateJournals;
