import { useState, useEffect } from "react";
import { CheckCheck, X } from "lucide-react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PayPalButton } from "react-paypal-button-v2";
import externshipEmailTemplate from "../utils/externship_email_template";
import { PaystackProps } from "react-paystack/dist/types";
import Link from "next/link";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  {
    ssr: false,
  }
);

interface Params {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let courses = [
  {
    code: "7937",
    course: "Virtual Assistant Internship – Mastering Remote Support",
  },

  { code: "7934", course: "Data Analysis Internship" },
  { code: "7915", course: "Content Creation Internship" },
  { code: "7447", course: "Digital Marketing Internship" },
];

function truncateText(text: string, maxLength: number) {
  // If the text is shorter or equal to the max length, return it as is
  if (text.length <= maxLength) {
    return text;
  }

  // Otherwise, truncate and add ellipsis
  return text.slice(0, maxLength) + "...";
}

export default function PaidLandingForm({ setShowForm }: Params) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  console.log("ref: ", ref);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    programs: courses[0].code, // default program value
    age: 0,
    city: "",
    country: "",
    linkedin: "",
    phone_no: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    age: "",
    city: "",
    country: "",
    linkedin: "",
    phone_no: "",
    terms: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [getFullPogram, setGetFullPogram] = useState(true);
  const [paystackAmount, setPaystackAmount] = useState(16000);
  const [paypalAmount, setPaypalAmount] = useState(10);
  const [validating, setValidating] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleTermsChange: any = () => {
    setTermsAccepted((prev) => !prev);
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormTouched(true);
  };

  useEffect(() => {
    if (formTouched) {
      validateFormData();
    }
  }, [formData, termsAccepted]);

  function validateFormData() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    let newErrors = {
      email: "",
      fullName: "",
      age: "",
      city: "",
      country: "",
      linkedin: "",
      phone_no: "",
      terms: "",
    };

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.fullName || formData.fullName.length <= 8) {
      newErrors.fullName = "Full name must be more than 8 characters.";
    }

    if (!formData.age || formData.age <= 10) {
      newErrors.age = "Age must be greater than 10.";
    }

    if (!formData.city) {
      newErrors.city = "City is required.";
    }

    if (!formData.country) {
      newErrors.country = "Country is required.";
    }

    if (!formData.linkedin) {
      newErrors.linkedin = "LinkedIn profile is required.";
    }

    if (!formData.phone_no || !phoneRegex.test(formData.phone_no)) {
      newErrors.phone_no = "Invalid phone number. Must be 10-15 digits.";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions.";
    }

    // Update errors state
    setErrors(newErrors);

    // Check if form is valid using `newErrors`
    const isValid = Object.values(newErrors).every((error) => error === "");
    setIsValid(isValid);
  }

  async function sendEmail(
    to: string,
    subject: string,
    ref: string
    // html: string
  ) {
    let program = courses.find((course) => formData.programs == course.code)
      ?.course;
    let text = externshipEmailTemplate(
      formData.fullName,
      program ? program : "",
      `https://registration.elitegloblinternships.com/paid_course?ref=${ref}`,
      "text"
    );
    let html = externshipEmailTemplate(
      formData.fullName,
      program ? program : "",
      `https://registration.elitegloblinternships.com/paid_course?ref=${ref}`,
      "html"
    );
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, text, html }),
    });

    if (!response.ok) {
      // Handle errors accordingly
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send email");
    }

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    getFullPogram ? setPaystackAmount(48000) : setPaystackAmount(16000);
    getFullPogram ? setPaypalAmount(30) : setPaypalAmount(10);
  }, []);

  const paystackConfig = {
    metadata: {
      custom_fields: [
        {
          display_name: "values",
          variable_name: "values",
          value: [
            uuidv4(),
            formData.fullName,
            formData.email,
            courses.find((course) => course.code == formData.programs)?.course,
            formData.programs,
            format(new Date(), "MMMM d, yyyy"),
            "paystack",
            formData.age,
            formData.city,
            formData.country,
            formData.linkedin,
            formData.phone_no,
            ref,
          ],
        },
      ],
    },
    email: formData.email,
    amount: paystackAmount * 100, // Example amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY || "",
    onSuccess: () => toast.success("Payment successful"),
    onClose: () => toast.info("Payment process was interrupted"),
  };

  // console.log(validateFormData() && validating);

  return (
    <form className="rounded-sm h-max py-10 md:py-0 pb-20 md:pb-0">
      <p className="text-xl mb-10 font-semibold">
        <span className="text-sm text-amber-400">
          Amount Payable for{" "}
          {getFullPogram ? "Full Internship Program" : "AI Training Program"}:
        </span>{" "}
        {`N${paystackAmount} ($${paypalAmount})`}
      </p>
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
      <div className="md:px-0 flex flex-col rounded-sm overflow-clip">
        <div className="flex flex-col md:flex-row ">
          <div className="border p-2 space-y-1 w-full flex flex-col border-accent">
            <label className="text-xs">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border w-full p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 w-full space-y-1 flex flex-col border-accent">
            <label htmlFor="programs" className="text-xs">
              Pick a program
            </label>
            <select
              id="programs"
              name="programs"
              value={formData.programs}
              onChange={handleInputChange}
              className="bg-transparent text-sm outline-none border-none"
            >
              {courses.map((course, idx) => (
                <option key={idx} value={course.code}>
                  {truncateText(course.course, 40)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="border p-2 space-y-1 w-full flex flex-col border-accent">
            <label className="text-xs">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border w-full p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border w-full p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="border p-2 space-y-1 w-full flex flex-col border-accent">
            <label className="text-xs">Linkedin URL</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border w-full p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">Phone number</label>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1 mt-1">
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        {errors.fullName && (
          <p className="text-red-500 text-xs">{errors.fullName}</p>
        )}
        {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
        {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        {errors.country && (
          <p className="text-red-500 text-xs">{errors.country}</p>
        )}
        {errors.linkedin && (
          <p className="text-red-500 text-xs">{errors.linkedin}</p>
        )}
        {errors.phone_no && (
          <p className="text-red-500 text-xs">{errors.phone_no}</p>
        )}
      </div>
      <p className="text-xs mt-3 text-gray-100">
        This program is a PAID Internship placement program. Training is open to
        all Africans.{" "}
      </p>

      <div className="mt-5">
        <label className="flex items-center space-x-2 text-xs text-gray-200">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="form-checkbox text-accent"
          />
          <span>
            I accept the{" "}
            <Link
              href="/terms_and_conditions"
              className="underline text-amber-400"
            >
              Terms and Conditions
            </Link>
          </span>
        </label>
      </div>

      <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10 mt-10">
        <button
          type="button"
          onClick={() => {
            setGetFullPogram(!getFullPogram);
            setPaystackAmount(16000);
            setPaypalAmount(10);
          }}
          className={`border-2 px-8 py-3 space-x-3 flex text-center items-center ${
            !getFullPogram
              ? "border-accent text-white"
              : "border-black/10 text-gray-400"
          }`}
        >
          <CheckCheck
            className={`${!getFullPogram ? "text-accent" : "text-gray-400"}`}
          />
          <p>Continue with AI Training Program</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setGetFullPogram(!getFullPogram);
            setPaystackAmount(48000);
            setPaypalAmount(30);
          }}
          className={`border-2 px-8 py-3 space-x-3 flex text-center items-center ${
            getFullPogram
              ? "border-accent text-white"
              : "border-black/10 text-gray-400"
          }`}
        >
          <CheckCheck
            className={`${getFullPogram ? "text-accent" : "text-gray-400"}`}
          />
          <p>Get Full Internship Program</p>
        </button>
      </div>

      {isValid && (
        <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0 mt-8">
          <button
            className="w-full flex items-start"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <PaystackButton
              className={`p-3 w-full rounded-sm items-center justify-center ${
                isSubmitting || validating
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "hover:animate-pulse bg-accent text-white"
              }`}
              {...paystackConfig}
              disabled={isSubmitting || validating}
              text={!isSubmitting ? `Pay with Paystack` : "Processing..."}
            />
          </button>
        </div>
      )}
    </form>
  );
}
