import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Cookie from "js-cookie";

const getProfile = async () => {
  try {
    const { ok, data: resp, status } = await api().get("/api/profile");
    if (ok) {
      return {
        profile: (resp as any)?.profile,
      };
    } else {
      if (status === 401 || status === 403) {
        Cookie.remove(import.meta.env.VITE_COOKIE_TOKEN as string);
        window.location.href = "/auth/login";
      }
      // console.log('Something is wrong');
    }
  } catch (error) {
    // console.log('errror.utilities', error);
  }
};

const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 5000,
  });
};

export { getProfile };
export default useProfile;
