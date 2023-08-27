"use client";

import { useDispatch } from "react-redux";
import { useLocation, NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { GetGitHubUrl } from "@/utils/GetGitHubUrl";
import {
  LOGIN_SAGA,
  LOGIN_WITH_GOOGLE_SAGA,
} from "@/redux/actionSaga/AuthActionSaga";
import { TOKEN, TOKEN_GITHUB } from "@/utils/constants/SettingSystem";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(32),
  });

const SignInPage = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const handleSignInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      dispatch(
        LOGIN_WITH_GOOGLE_SAGA({
          token: tokenResponse.access_token,
        })
      );
    },
  });

  const openPopup = () => {
    const width = 500; // Width of the pop-up window
    const height = 800; // Height of the pop-up window
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      GetGitHubUrl(),
      "GithubAuth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === import.meta.env.VITE_SERVER_ENDPOINT) {
        // Check the origin of the message for security
        // Handle the received data from the server
        const userData = event.data;
        if (userData) {
          localStorage.setItem(TOKEN, userData.accessToken);
          localStorage.setItem(TOKEN_GITHUB, userData.accessTokenGitHub);

          // go to home page or redirect to previous page
          const state = location.state as { from: Location };
          const from = state?.from?.pathname || "/";

          window.location.replace(from);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    const pollOAuthStatus = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollOAuthStatus);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    dispatch(
      LOGIN_SAGA({
        userLogin: data,
      })
    );
  };

  return (
    <>
      <div className="loginForm">
        <div className="welcomeBack mb-12">
          <div className="icon_logo">
            <FontAwesomeIcon className="icon" icon={faSnowflake} />
          </div>
          <h2 className="title">Welcome back!</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Password" {...field} />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="btn btn-primary w-full h-9 mb-4 mt-3 font-bold">
              Login
            </button>
            <NavLink to="/forgot">
              <span className="forgot flex justify-center align-middle">
                Forgot your password?
              </span>
            </NavLink>
          </form>
        </Form>
        <div className="anotherLogin mt-10">
          <div className="title relative">
            <span
              className="absolute">
              Or
            </span>
            <hr />
          </div>
          <div className="loginTool mt-10 w-full">
            <div
              className="google h-10"
              onClick={() => handleSignInWithGoogle()}>
              <span className="icon mr-2">
                <img src="./images/google.svg" alt="google" />
              </span>
              <span>Continue with Gmail</span>
            </div>
            <div className="github mt-4 h-10" onClick={() => openPopup()}>
              <span className="icon mr-2">
                <img src="./images/github.svg" alt="github" />
              </span>
              <span>Continue with Github</span>
            </div>
          </div>
        </div>

        <div className="noAccount text-center mt-8">
          <span>Don't you have an account yet? </span>
          <span className="signUp ml-1">
            <NavLink to="/register">Sign up</NavLink>
          </span>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
