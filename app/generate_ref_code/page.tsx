"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Copy, Lock } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";

const schema = z.object({
  fullName: z.string().min(5, "Full name is required"),
  email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof schema>;

export default function GenerateRefCode() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedUuid, setGeneratedUuid] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    toast.info("Generating...");
    setIsSubmitting(true);
    const uuid = uuidv4().toString();
    const values = [uuid, data.fullName, JSON.stringify([])];

    try {
      const response = await fetch("/api/handle-ref", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          mail: {
            name: data.fullName,
            email: data.email,
            ref: `https://eliteai.vercel.app/?ref=${uuid}`,
          },
        }),
      });

      if (!response.ok) {
        return toast.error("Failed to generate referral link at this time");
      }

      // Handle successful response
      const result = await response.json();
      setGeneratedUuid(uuid);
      toast.success("Referral link generated successfully");
      toast.success("An email with your referral link has been sent to you");
      reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Couldn't generate refferal link at this time");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (generatedUuid) {
      copy(`https://eliteai.vercel.app/?ref=${generatedUuid}`);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="w-screen h-screen text-white">
      <div className="h-screen w-screen fixed flex items-center justify-center top-0 right-0 px-8 bg-black z-40">
        <div className="md:max-w-lg space-y-6 border bg-black p-6 rounded border-accent/10">
          <div>
            <div className="flex items-start space-x-3">
              <button onClick={() => window.history.back()}>
                <ChevronLeft />
              </button>
              <div>
                <h1 className="text-lg font-medium">
                  Welcome to the Elite AI Ambassador Program
                </h1>
                <p className="text-xs text-white/70">
                  To get access code fill in the form and press enter.{" "}
                  <span className="text-amber-300">
                    <span className="font-bold">Note:</span> An email will be
                    sent to you with your referral link as well. If you don't
                    see on check your spam folder.
                  </span>
                </p>
              </div>
            </div>
          </div>
          {!generatedUuid && (
            <div>
              <form
                className="grid grid-cols-1 border justify-between border-accent rounded-sm"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="text-sm outline-none px-2 py-4 bg-transparent text-white border-0"
                  {...register("fullName")}
                />
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="text-sm outline-none px-2 py-4 border border-t border-accent bg-transparent text-white"
                  {...register("email")}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-4 text-sm hover:animate-pulse bg-accent text-white"
                >
                  {isSubmitting ? "Generating..." : "Generate"}
                </button>
              </form>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
          {generatedUuid && (
            <div className="flex justify-between border border-accent rounded-sm">
              <input
                type="text"
                placeholder="Enter your referral code"
                className="text-sm outline-none px-2 w-full bg-transparent text-white border-0"
                disabled
                value={`https://eliteai.vercel.app/?ref=${generatedUuid}`}
                // value={referralCode}
                // onChange={(e) => setReferralCode(e.target.value)}
                // onKeyPress={handleKeyPress}
              />
              <div
                onClick={handleCopy}
                className="md:p-3 h-10 flex items-center justify-center aspect-square rounded-sm text-accent bg-accent/10"
              >
                <Copy className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
