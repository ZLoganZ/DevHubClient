import { useDispatch } from "react-redux";
import { useLocation, NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import StyleTotal from "./cssSignIn";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const formSchema = z.object({
  email: z
    .string()
    .email("Email is invalid")
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .max(32),
});

const SignInPage = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const { getTheme } = useTheme();

  const { themeColorSet } = getTheme();

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
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    dispatch(
      LOGIN_SAGA({
        userLogin: data,
      })
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: themeColorSet.colorBg1,
        color: themeColorSet.colorText2,
      }}>
      <StyleTotal theme={themeColorSet}>
        <div className="loginForm">
          <div className="welcomeBack mb-12">
            <div className="icon_logo">
              <FontAwesomeIcon className="icon" icon={faSnowflake} />
            </div>
            <h2 className="title">Welcome back!</h2>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full"
              style={{ width: "70%" }}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="ghost"
                className="btn btn-primary w-full h-9 mb-4 mt-3 font-bold"
                disabled={isLoading}>
                Login
              </Button>
              <NavLink to="/forgot">
                <span className="forgot flex justify-center align-middle">
                  Forgot your password?
                </span>
              </NavLink>
            </form>
          </Form>
          <div className="anotherLogin mt-10">
            <div className="title relative">
              <span className="absolute">Or</span>
              <hr />
            </div>
            <div className="loginTool mt-10 w-full">
              <div
                className="google h-10 rounded-md"
                onClick={() => handleSignInWithGoogle()}>
                <span className="icon mr-2">
                  <img src="./images/google.svg" alt="google" />
                </span>
                <span>Continue with Gmail</span>
              </div>
              <div
                className="github mt-4 h-10 rounded-md"
                onClick={() => openPopup()}>
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
              <NavLink to="/sign-up">Sign up</NavLink>
            </span>
          </div>
        </div>
      </StyleTotal>
    </div>
  );
};

export default SignInPage;
