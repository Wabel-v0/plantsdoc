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
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { t, direction } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signup, googleSignIn } = useAuth();

  // Helper function to get user-friendly error message
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return (
          t("signup.errors.emailInUse") ||
          "This email is already registered. Try logging in instead."
        );
      case "auth/invalid-email":
        return (
          t("signup.errors.invalidEmail") ||
          "Please enter a valid email address."
        );
      case "auth/weak-password":
        return (
          t("signup.errors.weakPassword") ||
          "Password is too weak. It should be at least 6 characters."
        );
      case "auth/operation-not-allowed":
        return (
          t("signup.errors.operationNotAllowed") ||
          "Account creation is currently disabled."
        );
      default:
        return (
          t("signup.errors.default") ||
          "An error occurred during registration. Please try again."
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
        t("signup.errors.missingFields") || "Please fill in all fields"
      );
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setAuthError(
        t("signup.errors.termsRequired") ||
          "Please agree to the terms and conditions"
      );
      setIsLoading(false);
      return;
    }

    const { user, error } = await signup(email, password);

    if (error) {
      console.error("Signup error:", error);

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
      title: t("signup.success.title") || "Registration Successful",
      description: t("signup.success.description") || "Welcome to Plants Doc!",
    });
    router.push("/dashboard");
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const { user, error } = await googleSignIn();

      if (error) {
        console.error("Google sign-up error:", error);
        setAuthError(
          t("signup.errors.googleSignUp") ||
            "Could not sign up with Google. Please try again."
        );
        return;
      }

      // Ensure we have a valid user object before proceeding
      if (!user) {
        console.error("No user returned from Google sign-in");
        setAuthError(
          t("signup.errors.googleSignUp") ||
            "Authentication failed. Please try again."
        );
        return;
      }

      console.log("Google sign-up successful:", user.email);

      // Success - redirect to dashboard
      toast({
        title: t("signup.success.title") || "Registration Successful",
        description:
          t("signup.success.description") || "Welcome to Plants Doc!",
      });
      router.push("/dashboard");
    } catch (unexpectedError) {
      console.error("Unexpected error during Google sign-in:", unexpectedError);
      setAuthError(
        t("signup.errors.unexpected") ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={direction}>
      {/* Header content */}

      <main className="flex items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {t("signup.title")}
            </CardTitle>
            <CardDescription>{t("signup.subtitle")}</CardDescription>
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
                <Label htmlFor="name">{t("signup.name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("signup.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("signup.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  {t("signup.passwordHint")}
                </p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("signup.terms1")}{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-500"
                  >
                    {t("signup.termsLink")}
                  </Link>{" "}
                  {t("signup.terms2")}{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:text-green-500"
                  >
                    {t("signup.privacyLink")}
                  </Link>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? t("signup.loading") : t("signup.button")}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">
                  {t("signup.orContinue")}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full mt-4"
            >
              {isGoogleLoading
                ? t("signup.googleLoading")
                : t("signup.googleButton")}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-600">
              {t("signup.haveAccount")}{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-500"
              >
                {t("signup.signin")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
