"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { t, direction } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, googleSignIn } = useAuth();

  // Helper function to get user-friendly error message
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return (
          t("login.errors.userNotFound") ||
          "No account exists with this email address."
        );
      case "auth/wrong-password":
        return (
          t("login.errors.wrongPassword") ||
          "Incorrect password. Please try again."
        );
      case "auth/invalid-email":
        return (
          t("login.errors.invalidEmail") ||
          "Please enter a valid email address."
        );
      case "auth/too-many-requests":
        return (
          t("login.errors.tooManyRequests") ||
          "Too many failed login attempts. Please try again later."
        );
      case "auth/user-disabled":
        return (
          t("login.errors.userDisabled") || "This account has been disabled."
        );
      default:
        return (
          t("login.errors.default") ||
          "An error occurred during login. Please try again."
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    // Basic validation
    if (!email || !password) {
      setAuthError(
        t("login.errors.missingFields") || "Please fill in all fields"
      );
      setIsLoading(false);
      return;
    }

    const { user, error } = await login(email, password);

    if (error) {
      console.error("Login error:", error);

      // Extract Firebase error code from error message
      const errorCode = error.includes("auth/")
        ? error.split("(")[1]?.split(")")[0] || "auth/unknown"
        : "auth/unknown";

      setAuthError(getErrorMessage(errorCode));
      setIsLoading(false);
      return;
    }

    // Success - redirect to dashboard
    toast({
      title: t("login.success.title") || "Login Successful",
      description:
        t("login.success.description") || "Welcome back to Plants Doc!",
    });
    router.push("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    const { user, error } = await googleSignIn();

    if (error) {
      console.error("Google sign-in error:", error);
      setAuthError(
        t("login.errors.googleSignIn") ||
          "Could not sign in with Google. Please try again."
      );
      setIsGoogleLoading(false);
      return;
    }

    // Success - redirect to dashboard
    toast({
      title: t("login.success.title") || "Login Successful",
      description:
        t("login.success.description") || "Welcome back to Plants Doc!",
    });
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={direction}>
      <div className="flex items-center justify-between w-full max-w-md px-4 mb-8">
        <Link
          href="/"
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Leaf className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-green-800">Plants Doc</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <main className="flex items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {t("login.title")}
            </CardTitle>
            <CardDescription>{t("login.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? t("login.loading") : t("login.button")}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">
                  {t("login.orContinue")}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full mt-4"
            >
              {isGoogleLoading
                ? t("login.googleLoading")
                : t("login.googleButton")}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-600">
              {t("login.noAccount")}{" "}
              <Link
                href="/signup"
                className="text-green-600 hover:text-green-500"
              >
                {t("login.signup")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
