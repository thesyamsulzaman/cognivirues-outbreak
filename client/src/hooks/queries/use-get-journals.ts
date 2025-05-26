import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getJournals = async () => {
  try {
    const { ok, data: resp }: any = await api().get("/api/journals");
    if (ok) {
      return resp?.data;
    } else {
      console.log("Something is wrong");
    }
  } catch (error) {
    console.log("errror.journals", error);
  }
};

const useGetJournals = () => {
  return useQuery({
    queryKey: ["journals"],
    queryFn: () => getJournals(),
    staleTime: 5000,
  });
};

export { getJournals };
export default useGetJournals;
