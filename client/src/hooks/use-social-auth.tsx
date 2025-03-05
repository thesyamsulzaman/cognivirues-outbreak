import { useGoogleLogin } from "@react-oauth/google";

const Scopes: Record<any, string> = {
  GOOGLE: "profile email",
};

const useSocialAuth = () => {
  const loginWithGoogle = useGoogleLogin({
    scope: Scopes["GOOGLE"],
    flow: "auth-code",
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL,
    ux_mode: "redirect",
    onError: () => {
      console.log("Failed to signup with Google");
    },
  });

  return { loginWithGoogle };
};

export default useSocialAuth;
