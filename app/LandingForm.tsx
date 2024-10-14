"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { z } from "zod";
import { landingFormSchema } from "./schemas"; // Adjust the import based on your file structure
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

type LandingFormInputs = z.infer<typeof landingFormSchema>;

interface Params {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LandingForm({ setShowForm }: Params) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [isCommunityJoined, setIsCommunityJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LandingFormInputs>({
    resolver: zodResolver(landingFormSchema),
  });

  const onSubmit = async (formData: LandingFormInputs) => {
    const currentDate = new Date();
    const ref_id = uuidv4().toString();
    setIsSubmitting(true);
    if (!isCommunityJoined)
      toast.info("Do make sure you have joined the community.");

    toast.info("Submitting...");
    const values = [
      uuidv4(),
      formData.fullName,
      formData.email,
      formData.phone,
      formData.country,
      formData.age.toString(),
      formData.programs,
      formData.youtubeUsername,
      formData.twitterUsername,
      formData.linkedinUrl,
      formData.linkedinUsername,
      formData.facebookUsername,
      formData.instagramUsername,
      format(currentDate, "MMMM d, yyyy"),
    ];

    const response = await fetch("/api/update-sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values, ref }),
    });

    if (response.ok) {
      await sendWelcomeEmail(formData.fullName, formData.email, ref_id);
      toast.success("Form submitted successfully");
      setIsSubmitting(false);
      reset();
      setShowForm(false);
    } else {
      setIsSubmitting(false);
      toast.error("Sorry we couldn't submit your data at this time.");
    }
  };

  const sendWelcomeEmail = async (
    fullName: string,
    email: string,
    uuid: string
  ) => {
    const values = [uuid, fullName, JSON.stringify([])];
    const response = await fetch("/api/handle-ref", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values,
        mail: {
          name: fullName,
          email: email,
          ref: `https://eliteai.vercel.app/?ref=${uuid}`,
        },
      }),
    });

    if (response.ok) {
      return toast.success("Welcome");
    }

    if (!response.ok) {
      return toast.error("Failed to generate referral link at this time");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm h-max py-10 md:py-0 pb-20 md:pb-0"
    >
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="flex md:hidden absolute top-7 right-8"
      >
        <X className="text-gray-300" />
      </button>
      <h1 className="flex md:hidden text-2xl pt-5 pb-8">
        Let&apos;s get you registered{" "}
      </h1>
      <div className="md:px-0 rounded-sm overflow-clip">
        <div className="flex flex-col md:flex-row ">
          <div className="border p-2 space-y-1 w-full flex flex-col border-accent">
            <label className="text-xs">Email</label>
            <input
              type="email"
              {...register("email")}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border w-full p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">Full name</label>
            <input
              type="text"
              {...register("fullName")}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 w-full space-y-1 flex flex-col border-accent">
            <label className="text-xs">Phone number</label>
            <input
              type="text"
              {...register("phone")}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="border p-2 w-full space-y-1 flex flex-col border-accent">
            <label htmlFor="programs" className="text-xs">
              Pick a program
            </label>
            <select
              id="programs"
              {...register("programs")}
              defaultValue={"AI in Data Analytics"}
              className="bg-transparent text-sm outline-none border-none"
            >
              <option value="AI in Data Analytics">AI in Data Analytics</option>
              <option value="AI in Business Analytics">
                AI in Business Analytics
              </option>
              <option value="AI in Virtual Assistant">
                AI in Virtual Assistant
              </option>
              <option value="AI in Education">AI in Education</option>
              <option value="AI in Content creation">
                AI in Content creation
              </option>
              <option value="AI in Digital Marketing">
                AI in Digital Marketing
              </option>
              <option value="AI in IT support">AI in IT support</option>
              <option value="AI in Community Management">
                AI in Community Management
              </option>
              <option value="AI in Program management">
                AI in Program management
              </option>
            </select>
          </div>
          <div className="border p-2 w-full space-y-1 flex flex-col border-accent">
            <label className="text-xs">Country</label>
            <input
              type="text"
              {...register("country")}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 w-full space-y-1 flex flex-col border-accent">
            <label className="text-xs">Age</label>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
        </div>
        {/* <button
          type="submit"
          className="w-16 hidden hover:animate-pulse bg-accent text-white md:flex items-center justify-center"
        >
          <ArrowRight />
        </button> */}
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
        Training is open to all Africans.{" "}
        <span className="text-amber-500">
          Usernames on all handles will be fact checked to confirm that you are
          following us, so do not bother trying to outsmart the system as you
          will be kicked out of the program.
        </span>
      </p>

      <div className="flex w-full justify-center pt-10 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:gap-10 w-full flex-col md:flex-row">
          <div className="w-full md:w-full flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  Follow us on our youtube channel
                </p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <a
                href="https://youtube.com/@eliteglobalai?si=N2Lf-y8JU4wnb2ay"
                target="_blank"
                className="p-2 border border-accent rounded-sm animate-pulse"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="border-b p-2 space-y-1 flex flex-col border-b-accent">
              <input
                type="text"
                placeholder="Enter username"
                {...register("youtubeUsername")}
                className="text-sm outline-none bg-transparent text-white border-0"
              />
              {errors.youtubeUsername && (
                <p className="text-red-500 text-xs">
                  {errors.youtubeUsername.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full md:w-full flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">LinkedIn URL</p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <div className="p-2">
                <Linkedin className="h-6 w-6" />
              </div>
            </div>
            <div className="border-b p-2 space-y-1 flex flex-col border-b-accent">
              <input
                type="text"
                placeholder="Enter your Linkedin URL"
                {...register("linkedinUrl")}
                className="text-sm outline-none bg-transparent text-white border-0"
              />
              {errors.linkedinUrl && (
                <p className="text-red-500 text-xs">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-full flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Follow us on twitter</p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <a
                href="https://x.com/EliteglobalAI?t=A43oBep-s12UjzqxT0BmOw&s=09"
                target="_blank"
                className="p-2 border border-accent rounded-sm animate-pulse"
              >
                <Twitter className="h-6 w-6" />
              </a>
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

          <div className="w-full md:w-full flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Follow us on LinkedIn</p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <a
                href="https://www.linkedin.com/company/elite-global-ai/"
                target="_blank"
                className="p-2 border border-accent rounded-sm animate-pulse"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <div className="border-b p-2 space-y-1 flex flex-col border-b-accent">
              <input
                type="text"
                placeholder="Enter username"
                {...register("linkedinUsername")}
                className="text-sm outline-none bg-transparent text-white border-0"
              />
              {errors.linkedinUsername && (
                <p className="text-red-500 text-xs">
                  {errors.linkedinUsername.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-full flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Follow us on Facebook</p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <a
                href="https://www.facebook.com/profile.php?id=61556668897673&mibextid=LQQJ4d"
                target="_blank"
                className="p-2 border border-accent rounded-sm animate-pulse"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
            <div className="border-b p-2 space-y-1 flex flex-col border-b-accent">
              <input
                type="text"
                placeholder="Enter username"
                {...register("facebookUsername")}
                className="text-sm outline-none bg-transparent text-white border-0"
              />
              {errors.facebookUsername && (
                <p className="text-red-500 text-xs">
                  {errors.facebookUsername.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-full flex flex-col justify-between rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="flex justify-between space-x-4 items-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Follow us on Instagram</p>
                <p className="text-xs text-gray-200">
                  We&apos;d use your username for validation
                </p>
              </div>
              <a
                href="https://www.instagram.com/eliteglobalai_?igsh=bzNsbXVna3Q2dnJi"
                target="_blank"
                className="p-2 border border-accent rounded-sm animate-pulse"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <div className="border-b p-2 space-y-1 flex flex-col border-b-accent">
              <input
                type="text"
                placeholder="Enter username"
                {...register("instagramUsername")}
                className="text-sm outline-none bg-transparent text-white border-0"
              />
              {errors.instagramUsername && (
                <p className="text-red-500 text-xs">
                  {errors.instagramUsername.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full md:w-full  rounded-sm bg-black/30 p-4 space-y-3 border border-accent/40 backdrop-blur-lg">
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Join our Whatsapp community
              </p>
              <p className="text-xs text-gray-200">Click below to join.</p>
            </div>
            <button
              type="button"
              className="p-2 border rounded-sm border-accent text-white w-full hover:animate-pulse"
              onClick={() => {
                window.open(
                  "https://chat.whatsapp.com/DVcpmTvFIsR2VVz7ljdNuB",
                  "_blank"
                );
                setIsCommunityJoined(true);
              }}
            >
              Join community
            </button>
            {/* <p className="text-xs text-gray-500 md:hidden">
              Clicking this automatically submits the form if all details are
              valid
            </p> */}
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="p-3 w-full mt-10 hover:animate-pulse rounded-sm bg-accent text-white items-center justify-center"
      >
        {!isSubmitting ? "Submit" : "Submitting..."}
      </button>
    </form>
  );
}
