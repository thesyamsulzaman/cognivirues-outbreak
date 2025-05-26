import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

type Journal = any;

const onPostUpdateJournal = async (payload: Journal) => {
  const response = (await api().put(
    `/api/journals/${payload?.id}`,
    payload
  )) as any;

  if (!response.ok) {
    throw new Error("Something Went Wrong");
  }

  return response?.data;
};

const usePostUpdateJournal = () => {
  return useMutation({
    mutationKey: ["update-journal"],
    mutationFn: (params: Journal) => onPostUpdateJournal(params),
  });
};

export default usePostUpdateJournal;
