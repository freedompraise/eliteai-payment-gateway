import { useState } from "react";
import { PaystackButton } from "react-paystack";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

// Remove useForm and zod
// Remove zod inference for LandingFormInputs

interface Params {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PaidLandingForm({ setShowForm }: Params) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    programs: "Data Analytics Externship", // default program value
  });
  const [errors, setErrors] = useState({ email: "", fullName: "" });

  // Handling input changes
  const handleInputChange = (
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
      // await sendWelcomeEmail(formData.fullName, formData.email);
      toast.success("You've been enrolled successfully");
      setIsSubmitting(false);
      setFormData({ email: "", fullName: "", programs: "Education" }); // Reset form
      setShowForm(false);
    } else {
      setIsSubmitting(false);
      toast.error("Sorry we couldn't complete your enrollment at this time.");
    }
  };

  const sendWelcomeEmail = async (fullName: string, email: string) => {
    const response = await fetch("/api/send-welcome-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: {
          name: fullName,
          email: email,
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

  const paystackConfig = {
    email: formData.email,
    amount: 10000 * 100, // Example amount in kobo (10,000 NGN)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY || "",
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
              <option value="Data Analytics Externship">
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
              </option>
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
      </p>

      <button className="w-full" onClick={(e) => e.preventDefault()}>
        <PaystackButton
          className="p-3 w-full mt-10 hover:animate-pulse rounded-sm bg-accent text-white items-center justify-center"
          {...paystackConfig}
          disabled={isSubmitting}
          text={!isSubmitting ? "Enroll Now!!!" : "Enrolling..."}
        />
      </button>
    </form>
  );
}
