import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PaystackProps } from "react-paystack/dist/types";
import externshipEmailTemplate from "./utils/externship_email_template";
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
  { code: "7937", course: "Virtual Assistant Internship – Mastering Remote Support" },
  { code: "7934", course: "Data Analysis And Business Analysis Internship" },
  { code: "7915", course: "Content Creation Internship" },
  { code: "7447", course: "Digital Marketing Internship" },
];

function truncateText(text: string, maxLength: number) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
}

export default function PaidLandingForm({ setShowForm }: Params) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    city: "",
    country: "",
    linkedinURL: "",
    passportDriveLink: "",
    programs: courses[0].code, // default program value
  });
  const [errors, setErrors] = useState({ email: "", fullName: "" });
  const [paystackAmount, setPaystackAmount] = useState(16000);
  const [paypalAmount, setPaypalAmount] = useState(10);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function validateFormData() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (
      emailRegex.test(formData.email) &&
      formData.fullName.length > 8 &&
      formData.city &&
      formData.country &&
      formData.linkedinURL &&
      formData.passportDriveLink &&
      termsAccepted
    );
  }

  const handleTermsChange: any = () => {
    setTermsAccepted((prev) => !prev);
  };

  const paystackConfig = {
    metadata: {
      custom_fields: [
        {
          display_name: "User Details",
          variable_name: "user_details",
          value: {
            id: uuidv4(),
            fullName: formData.fullName,
            email: formData.email,
            city: formData.city,
            country: formData.country,
            linkedinURL: formData.linkedinURL,
            passportDriveLink: formData.passportDriveLink,
            program: courses.find((course) => course.code === formData.programs)?.course,
            programCode: formData.programs,
            registrationDate: format(new Date(), "MMMM d, yyyy"),
            paymentPlatform: "Paystack",
            ref,
          },
        },
      ],
    },
    email: formData.email,
    amount: paystackAmount * 100, // Example amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY || "",
    onSuccess: () => toast.success("Payment successful"),
    onClose: () => toast.info("Payment process was interrupted"),
  };

  return (
    <form className="rounded-sm h-max py-10 md:py-0 pb-20 md:pb-0">
      <p className="text-xl mb-10 font-semibold">
        <span className="text-sm text-amber-400">Amount Payable:</span>{" "}
        {`N${paystackAmount}($${paypalAmount})`}
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
      <div className="md:px-0 rounded-sm overflow-clip">
        <div className="flex flex-col md:flex-row ">
          {/* Form Fields */}
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
            <label className="text-xs">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">LinkedIn URL</label>
            <input
              type="text"
              name="linkedinURL"
              value={formData.linkedinURL}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 space-y-1 flex flex-col border-accent">
            <label className="text-xs">Drive Link to Passport Photograph</label>
            <input
              type="text"
              name="passportDriveLink"
              value={formData.passportDriveLink}
              onChange={handleInputChange}
              className="text-sm outline-none bg-transparent text-white border-0"
            />
          </div>
          <div className="border p-2 w-full space-y-1 flex flex-col border-accent">
            <label htmlFor="programs" className="text-xs">
              Pick a Program
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
      </div>
      <p className="text-xs mt-3 text-gray-100">
        This program is a PAID Internship placement program. Training is open to all Africans.{" "}
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

      {validateFormData() && (
        <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0 mt-8">
          <button
            className="w-full flex items-start"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <PaystackButton
              className={`p-3 w-full rounded-sm items-center justify-center ${
                isSubmitting
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "hover:animate-pulse bg-accent text-white"
              }`}
              {...paystackConfig}
              disabled={isSubmitting}
              text={!isSubmitting ? `Pay with Paystack` : "Processing..."}
            />
          </button>
        </div>
      )}
    </form>
  );
}
