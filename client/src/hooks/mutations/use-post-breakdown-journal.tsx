import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

type Journal = {};

const onPostJournal = async (payload: Journal) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = (await api().post("/api/journal/breakdown", payload)) as any;

  if (!response.ok) {
    throw new Error("Something Went Wrong");
  }

  return response?.data;
};

const usePostBreakdownJournal = () => {
  return useMutation({
    mutationKey: ["breakdown-journal"],
    mutationFn: (params: Journal) => onPostJournal(params),
  });
};

export default usePostBreakdownJournal;
