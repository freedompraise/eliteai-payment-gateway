import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

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
  { code: "8010", course: "Education Externship" },
  { code: "8009", course: "IT Support Externship" },
  { code: "7970", course: "Project Management Externship" },
  {
    code: "7937",
    course: "Virtual Assistant Externship – Mastering Remote Support",
  },
  { code: "7936", course: "Community Management Externship" },
  { code: "7935", course: "Business Analysis Externship" },
  { code: "7934", course: "Data Analysis Externship" },
  { code: "7915", course: "Content Creation Externship" },
  { code: "7447", course: "Digital Marketing Externship" },
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    programs: courses[0].code, // default program value
  });
  const [errors, setErrors] = useState({ email: "", fullName: "" });
  const [checking, setChecking] = useState(false);
  const [amount, setAmount] = useState(24000);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    async function checkDiscount() {
      setValidating(true);
      if (formData.email && formData.fullName) {
        toast.info("Validating...");
        const response = await fetch(`/api/get-row-by-email/${formData.email}`);

        if (response.ok && response.status !== 404) {
          setAmount(16000);
          toast.success("Discount applied successfully");
        } else {
          toast.error(
            "Sorry the email you've provided wasn't registered for our free training"
          );
        }
        setChecking(false);
        setValidating(false);
      } else {
        toast.error("Please make sure each form field is filled properly");
      }
    }
    if (checking) {
      checkDiscount();
    }
  }, [checking, formData]);

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaystackSuccess = async () => {
    const currentDate = new Date();
    setIsSubmitting(true);
    toast.info("Submitting...");

    const values = [
      uuidv4(),
      formData.fullName,
      formData.email,
      courses.find((course) => course.code == formData.programs)?.course,
      formData.programs,
      format(currentDate, "MMMM d, yyyy"),
    ];

    const response = await fetch("/api/update-sheet-3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values, ref }),
    });

    if (response.ok) {
      toast.success("You've been enrolled successfully");
      setIsSubmitting(false);
      setFormData({ email: "", fullName: "", programs: "Education" }); // Reset form
      setShowForm(false);
    } else {
      setIsSubmitting(false);
      toast.error("Sorry we couldn't complete your enrollment at this time.");
    }
  };

  const paystackConfig = {
    email: formData.email,
    amount: 200 * 100, // Example amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY || "",
    onSuccess: handlePaystackSuccess,
    onClose: () => toast.info("Payment process was interrupted"),
  };

  return (
    <form className="rounded-sm h-max py-10 md:py-0 pb-20 md:pb-0">
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
              {/* <option value="Data Analytics Externship">
                Data Analytics Externship
              </option>
              <option value="Business Analytics Externship">
                Business Analytics Externship
              </option>
              <option value="Virtual Assistant Externship">
                Virtual Assistant Externship
              </option>
              <option value="Education Externship">Education Externship</option>
              <option value="Content creation Externship">
                Content creation Externship
              </option>
              <option value="Digital Marketing Externship">
                Digital Marketing Externship
              </option>
              <option value="IT support Externship">
                IT support Externship
              </option>
              <option value="Community Management Externship">
                Community Management Externship
              </option>
              <option value="Program management Externship">
                Program management Externship
              </option> */}
            </select>
          </div>
        </div>
      </div>
      <div className="flex space-x-1">
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        {errors.fullName && (
          <p className="text-red-500 text-xs">{errors.fullName}</p>
        )}
      </div>
      <p className="text-xs mt-3 text-gray-100">
        This program is a PAID Externship placement program. Training is open to
        all Africans.{" "}
        <span className="text-amber-400">
          NOTE: Discount is only availbable to students who have gone through
          our free training.
        </span>
      </p>

      {/* Buttons for Get discount and Paystack */}
      <div className="flex flex-col md:flex-row space-x-5">
        <button
          className={`p-3 w-full mt-10 rounded-sm border items-center justify-center ${
            validating
              ? "bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed"
              : "hover:animate-pulse border-accent text-white"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setChecking(true);
            console.log(checking);
          }}
          disabled={validating}
        >
          {!validating ? "Get discount" : "Validating..."}
        </button>

        <button
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <PaystackButton
            className={`p-3 w-full mt-10 rounded-sm items-center justify-center ${
              isSubmitting || validating
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "hover:animate-pulse bg-accent text-white"
            }`}
            {...paystackConfig}
            disabled={isSubmitting || validating}
            text={!isSubmitting ? `Enroll for N${amount}` : "Processing..."}
          />
        </button>
      </div>
    </form>
  );
}
