import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getTittle = async () => {
  try {
    const { ok, data: resp } = await api().get("/");
    if (ok) {
      return resp;
    } else {
      console.log("Something is wrong");
    }
  } catch (error) {
    console.log("errror.utilities", error);
  }
};

const useGetTittle = () => {
  return useQuery({
    queryKey: ["title"],
    queryFn: () => getTittle(),
    staleTime: 5000,
  });
};

export { getTittle };
export default useGetTittle;
