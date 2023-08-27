import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

import StyleTotal from "./cssSignUp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { REGIS_USER_SAGA } from "@/redux/actionSaga/UserActionSaga";
import { useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "First name is required" }),
    // lastname: z.string().min(1, { message: "Last name is required" }),
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
    confirm: z.string().min(1, { message: "Confirm password is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm password is not match",
        path: ["confirm"],
      });
    }
  });

const SignUpPage = () => {
  const dispatch = useDispatch();

  const { getTheme } = useTheme();

  const { themeColorSet } = getTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // lastname: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    dispatch(
      REGIS_USER_SAGA({
        userRegister: data,
      })
    );
  };

  return (
    <StyleTotal className="w-screen h-screen" theme={themeColorSet}>
      <div className="register relative">
        <div className="cover absolute top-0 left-0">
          <div className="content">
            <div className="lineTop mt-5">
              <span className="anyWhere">
                <span className="circle ml-5 mr-2">
                  <FontAwesomeIcon className="icon" icon={faSnowflake} />
                </span>
                <span>DevHub</span>
              </span>
            </div>
            <div className="account mt-12 px-14">
              <div className="startFree">START FOR FREE</div>
              <div className="createAccount">Create new account</div>
              <div className="member mt-3">
                <span className="memberEd">Already a member?</span>
                <NavLink to="/sign-in">
                  <span className="login ml-1">Login</span>
                </NavLink>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-5 formAccount">
                  <div className="mb-4">
                    {/* <FormField
                      name="lastname"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 8px)",
                            marginRight: "16px",
                          }}>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 8px)",
                          }}>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="mb-4">
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
                  <FormField
                    name="confirm"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="buttonCreate mt-3"
                    type="submit"
                    disabled={isLoading}>
                    Create account
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </StyleTotal>
  );
};

export default SignUpPage;
