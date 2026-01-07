"use client";

import { z } from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, refetchUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/signup", values);

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        await refetchUser();
        router.push("/");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/admin/addBlog");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-400">
          Create Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-emerald-400 to-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-sm text-center text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-emerald-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
