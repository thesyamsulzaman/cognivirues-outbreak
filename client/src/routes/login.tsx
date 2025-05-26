/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, TextInput } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import JSCookie from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import GoogleLogo from "@/assets/icons/google-logo.svg";
import useSocialAuth from "@/hooks/use-social-auth";
import { useEffect } from "react";
import useQueryParams from "@/hooks/use-query-params";
import { api, setCookie } from "@/utils/api";

const Login = () => {
  const navigate = useNavigate();
  const { queryParams } = useQueryParams();
  const { loginWithGoogle } = useSocialAuth();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginData) => {
      const response: any = await api().post("/auth/login", loginData);

      if (!response.ok) {
        throw new Error(response?.data?.message);
      }

      return response.data;
    },
  });

  const methods = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (loginData) => {
    loginMutation.mutate(loginData, {
      onSuccess: (response) => {
        const token = response?.token;
        setCookie(import.meta.env.VITE_COOKIE_TOKEN as string, token);
        navigate("/");
      },
      onError: (error) => {
        methods.setError("root", { type: "custom", message: error.message });
      },
    });
  };

  useEffect(() => {
    const token = queryParams.get("token");

    if (token) {
      setCookie(import.meta.env.VITE_COOKIE_TOKEN as string, token);
      navigate("/");
    }
  }, [navigate, queryParams]);

  return (
    <div className="w-full">
      <div className="max-w-[600px] mx-auto min-h-[800px] py-4 flex justify-center items-center">
        <div className="w-full">
          <h1 className="text-8xl font-bold text-center mb-5">
            Cognivirues <br /> <span className="text-red-500">Outbreak</span>
          </h1>

          <FormProvider {...methods}>
            <form
              className="px-5"
              method="POST"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {!!methods?.formState?.errors?.root?.message && (
                <div className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">
                      {methods?.formState?.errors?.root?.message}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                <div className="flex flex-col mt-3">
                  <label htmlFor="email" className="font-medium">
                    Email Address
                  </label>

                  <TextInput
                    placeholder="Enter email address"
                    type="email"
                    id="signin-email"
                    error={methods.formState.errors.email?.message}
                    {...methods.register("email", {
                      required: "Email field is required",
                    })}
                  />
                </div>

                <div className="flex flex-col mt-3">
                  <label htmlFor="password" className="font-medium">
                    Password
                  </label>

                  <TextInput
                    placeholder="*****"
                    type="password"
                    id="signin-password"
                    error={methods.formState.errors.password?.message}
                    {...methods.register("password", {
                      required: "Please fill in password",
                    })}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Button
                  classNames={{ root: "bg-dark" }}
                  fullWidth
                  size="md"
                  radius="lg"
                  type="submit"
                  loading={loginMutation.isPending}
                >
                  LOGIN
                </Button>

                <Button
                  variant="filled"
                  leftSection={
                    <img
                      height={20}
                      width={20}
                      src={GoogleLogo}
                      alt="Sign up with Google"
                    />
                  }
                  color="dark"
                  fullWidth
                  size="md"
                  radius="lg"
                  onClick={loginWithGoogle}
                >
                  <span> TRY THIS GAME WITH GOOGLE ACCOUNT</span>
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;
