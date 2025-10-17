"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading, error, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.push(redirectTo);
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validate form data
      const validatedData = loginSchema.parse({ email, password });

      // Attempt to sign in
      const result = await signIn(validatedData.email, validatedData.password);

      if (result.success) {
        // Redirect will be handled by useEffect
        const redirectTo = searchParams.get("redirectTo") || "/dashboard";
        router.push(redirectTo);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "ZodError") {
        // Handle validation errors
        const zodError = err as any;
        const errors: Record<string, string> = {};
        zodError.issues.forEach((issue: any) => {
          errors[issue.path[0]] = issue.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            SpecChem Safety
          </h1>
          <p className="text-neutral-600">Learning Management System</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-neutral-900">
              Employee Sign In
            </CardTitle>
            <CardDescription>
              Access the SpecChem Safety Training Portal with your employee credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || Object.keys(validationErrors).length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  {Object.keys(validationErrors).length > 0 && (
                    <ul className="text-red-600 text-sm list-disc list-inside">
                      {Object.values(validationErrors).map(
                        (errorMsg, index) => (
                          <li key={index}>{errorMsg}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-700">
                  Employee Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className={validationErrors.email ? "border-red-300" : ""}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className={`pr-10 ${validationErrors.password ? "border-red-300" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-neutral-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-neutral-700"
                  >
                    Remember me
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Signing In...
                  </div>
                ) : (
                  "Access Training Portal"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  Contact your administrator
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Copyright */}
        <div className="text-center mt-8 text-xs text-neutral-500">
          <p>© 2024 SpecChem. All rights reserved.</p>
          <p>Secure access to safety training and compliance management.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl">
              <CardContent className="p-8 text-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary-600 mx-auto" />
                <p className="mt-4 text-neutral-600">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
