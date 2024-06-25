"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Twitter, X } from "lucide-react";
import { z } from "zod";
import { landingFormSchema } from "./schemas"; // Adjust the import based on your file structure
import { toast } from "react-toastify";

type LandingFormInputs = z.infer<typeof landingFormSchema>;

interface Params {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LandingForm({ setShowForm }: Params) {
  const [isCommunityJoined, setIsCommunityJoined] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LandingFormInputs>({
    resolver: zodResolver(landingFormSchema),
  });

  const onSubmit = async (data: LandingFormInputs) => {
    if (!isCommunityJoined)
      return toast.error("You have not joined the community yet.");

    const formData = data;
    toast.info("Submitting...");
    const values = [
      formData.fullName,
      formData.email,
      formData.phone,
      formData.country,
      formData.age.toString(),
      formData.twitterUsername,
      isCommunityJoined ? "Joined" : "Not Joined",
    ];

    const response = await fetch("/api/update-sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    });

    if (response.ok) {
      toast.success("Form submitted successfully");
      reset();
    } else {
      toast.error("Sorry we couldn't submit your data at this time.");
    }

    // console.log(data, values, response);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm py-10 md:py-0 md:overflow-clip pb-20 md:pb-0"
    >
      <button
        onClick={() => setShowForm(false)}
        className="flex md:hidden absolute top-7 right-8"
      >
        <X className="text-gray-300" />
      </button>
      <h1 className="flex md:hidden text-2xl pt-5 pb-8">
        Let&apos;s get you registered{" "}
      </h1>
      <div className="flex flex-col md:flex-row md:px-0 rounded-sm overflow-clip">
        <div className="border p-2 space-y-1 flex flex-col border-accent">
          <label className="text-xs">Email</label>
          <input
            type="email"
            {...register("email")}
            className="text-sm outline-none bg-transparent text-white border-0"
          />
        </div>
        <div className="border p-2 space-y-1 flex flex-col border-accent">
          <label className="text-xs">Full name</label>
          <input
            type="text"
            {...register("fullName")}
            className="text-sm outline-none bg-transparent text-white border-0"
          />
        </div>
        <div className="border p-2 space-y-1 flex flex-col border-accent">
          <label className="text-xs">Phone no</label>
          <input
            type="text"
            {...register("phone")}
            className="text-sm outline-none bg-transparent text-white border-0"
          />
        </div>
        <div className="border p-2 space-y-1 flex flex-col border-accent">
          <label className="text-xs">Country</label>
          <input
            type="text"
            {...register("country")}
            className="text-sm outline-none bg-transparent text-white border-0"
          />
        </div>
        <div className="border p-2 md:w-16 space-y-1 flex flex-col border-accent">
          <label className="text-xs">Age</label>
          <input
            type="number"
            {...register("age", { valueAsNumber: true })}
            className="text-sm outline-none bg-transparent text-white border-0"
          />
        </div>
        <button
          type="submit"
          className="w-16 hidden hover:animate-pulse bg-accent text-white md:flex items-center justify-center"
        >
          <ArrowRight />
        </button>
      </div>
      <div className="flex space-x-1">
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
        {errors.fullName && (
          <p className="text-red-500 text-xs">{errors.fullName.message},</p>
        )}
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message},</p>
        )}
        {errors.country && (
          <p className="text-red-500 text-xs">{errors.country.message},</p>
        )}
        {errors.age && (
          <p className="text-red-500 text-xs">{errors.age.message}</p>
        )}
      </div>
      <p className="text-xs mt-3  text-gray-100">
        This program is a Free remote training + Internship placement program.
        Training is open to all Africans.
      </p>

      <div className="flex w-full justify-center pt-10 md:pt-20">
        <div className="flex space-y-4 md:space-y-0 md:space-x-10 flex-col md:flex-row">
          <div className="w-full md:w-80 flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Follow us on twitter</p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <button className="p-2 border border-accent rounded-sm hover:animate-pulse">
                <Twitter className="h-6 w-6" />
              </button>
            </div>
            <div className="border-b p-2 space-y-1 flex flex-col border-b-accent">
              <input
                type="text"
                placeholder="Enter username"
                {...register("twitterUsername")}
                className="text-sm outline-none bg-transparent text-white border-0"
              />
              {errors.twitterUsername && (
                <p className="text-red-500 text-xs">
                  {errors.twitterUsername.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-80  rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Join our Whatsapp community
              </p>
              <p className="text-xs text-gray-200">Click below to join.</p>
            </div>
            <button
              className="p-2 border rounded-sm border-accent text-white w-full hover:animate-pulse"
              onClick={() => {
                window.open(
                  "https://chat.whatsapp.com/DoR3oGYto0F1Tc6W3OKJfr",
                  "_blank"
                );
                setIsCommunityJoined(true);
              }}
            >
              Join community
            </button>
            <p className="text-xs text-gray-500 md:hidden">
              Clicking this automatically submits the form if all details are
              valid
            </p>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="md:hidden p-3 w-full mt-10 hover:animate-pulse bg-accent text-white items-center justify-center"
      >
        Submit
      </button>
    </form>
  );
}
