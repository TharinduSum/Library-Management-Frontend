import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, UserPlus } from "lucide-react";
import { Input, Button } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";
import { authApi, usersApi } from "../../api";
import toast from "react-hot-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  full_name: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const from = location.state?.from?.pathname || "/";

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);

      if (!response.access_token) {
        throw new Error("No access token in response");
      }

      login(response.access_token, response.refresh_token, null);

      const userResponse = await usersApi.getMe();
      useAuthStore.getState().setUser(userResponse);

      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.detail || error.message || "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data) => {
    setIsLoading(true);
    try {
      await usersApi.register(data);
      toast.success("Registration successful! Please login.");
      setIsLogin(true);
    } catch (error) {
      const message = error.response?.data?.detail || "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const libraryImageUrl =
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80";

  return (
    <div className="login-page">
      <aside className="login-page__side">
        <img
          src={libraryImageUrl}
          alt="Library interior with bookshelves"
          className="login-page__image"
        />
        <div className="login-page__side-caption">
          <h2>Library Management</h2>
          <p>
            Manage your collection, track borrowings, and keep your library
            organized in one place.
          </p>
        </div>
      </aside>

      <div className="login-page__form-wrap">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrap">
              {isLogin ? (
                <BookOpen size={36} color="white" />
              ) : (
                <UserPlus size={36} color="white" />
              )}
            </div>
            <h1 className="login-title">Library Management</h1>
            <p className="login-subtitle">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {isLogin ? (
            <form className="login-form" onSubmit={handleLoginSubmit(onLogin)}>
              <Input
                label="Username"
                {...registerLogin("username")}
                error={loginErrors.username?.message}
              />
              <Input
                label="Password"
                type="password"
                {...registerLogin("password")}
                error={loginErrors.password?.message}
              />
              <Button type="submit" loading={isLoading} className="login-submit">
                Sign In
              </Button>
            </form>
          ) : (
            <form
              className="login-form"
              onSubmit={handleRegisterSubmit(onRegister)}
            >
              <Input
                label="Username"
                {...registerForm("username")}
                error={registerErrors.username?.message}
              />
              <Input
                label="Email"
                type="email"
                {...registerForm("email")}
                error={registerErrors.email?.message}
              />
              <Input
                label="Full Name"
                {...registerForm("full_name")}
                error={registerErrors.full_name?.message}
              />
              <Input
                label="Password"
                type="password"
                {...registerForm("password")}
                error={registerErrors.password?.message}
              />
              <Button type="submit" loading={isLoading} className="login-submit">
                Register
              </Button>
            </form>
          )}

          <p className="login-footer">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="login-toggle"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
