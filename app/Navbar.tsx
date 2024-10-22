import { ChevronLeft, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { toast } from "react-toastify";
import crypto from "crypto";
import Link from "next/link";

export default function Navbar() {
  const [referralCode, setReferralCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showDashboardPopup, setShowDashboardPopup] = useState(false);
  const [showAdminDashboardPopup, setShowAdminDashboardPopup] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && referralCode.trim() !== "") {
      const ref = referralCode.split("=")[1].trim();
      router.push(`/dashboard/${ref}`);
    }
  };

  // const handleAdminKeyPress = (
  //   event: React.KeyboardEvent<HTMLInputElement>
  // ) => {
  //   if (event.key === "Enter" && adminCode.trim() !== "") {
  //     const hash = crypto
  //       .createHash("sha256")
  //       .update(adminCode.trim())
  //       .digest("hex");
  //     if (hash.toString() == process.env.NEXT_PUBLIC_PASS?.toString()) {
  //       setShowAdminDashboardPopup(false);
  //       setShowAdminDashboard(true);
  //     } else {
  //       toast.error("Wrong code");
  //     }
  //   }
  // };

  return (
    <div className="h-24 md:h-32 relative">
      <nav className="w-full flex flex-col space-y-4 md:space-y-0 md:flex-row px-4 py-4 md:px-[80px] md:py-6 fixed top-0 right-0 bg-black/50 justify-between items-center z-40">
        <Link href={"/"}>
          <div className="h-8 w-8 md:h-10 md:w-10 relative">
            <img src="/logo.png" className="h-full w-full absolute" />
          </div>
        </Link>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-center">
          <div className="flex space-x-3 items-center">
            {/* <Link href={"/"}>
              <button
                className={`py-2 px-4 rounded-sm text-nowrap font-semibold border border-accent text-sm md:text-base ${
                  pathname === "/"
                    ? "bg-accent text-white"
                    : "bg-transparent text-white"
                }`}
              >
                Free Training
              </button>
            </Link> */}
            <Link href={"/"}>
              <button
                className={`py-2 px-4 rounded-sm text-nowrap border border-accent font-semibold text-sm md:text-base ${
                  pathname === "/" || pathname === "/paid_course"
                    ? "bg-accent text-white"
                    : "bg-transparent text-white"
                }`}
              >
                Paid Internship
              </button>
            </Link>
          </div>
          <div className="flex space-x-3 items-center">
            <button
              onClick={() => setShowDashboardPopup(true)}
              className={`py-2 px-4 rounded-sm border border-accent text-white font-semibold text-sm md:text-base ${
                pathname.includes("/dashboard")
                  ? "bg-accent text-white"
                  : "bg-transparent text-white"
              }`}
            >
              Dashboard
            </button>
            {/* <button
              onClick={() => setShowAdminDashboardPopup(true)}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-sm text-accent border border-accent"
            >
              <Lock className="h-4 w-4" />
            </button> */}
          </div>
        </div>
      </nav>

      {showDashboardPopup && (
        <div className="h-screen w-screen fixed flex items-center justify-center top-0 right-0 px-8 bg-black z-40">
          <div className="md:max-w-xl space-y-6 border bg-black p-6 rounded border-accent/10">
            <div className="flex space-x-2 items-center">
              <button onClick={() => setShowDashboardPopup(false)}>
                <ChevronLeft />
              </button>
              <div>
                <h1 className="text-lg font-medium">Access Dashboard</h1>
                <p className="text-xs text-white/70">
                  To access dashboard enter your referral link and press enter.
                </p>
              </div>
            </div>
            <div className="flex border border-accent rounded-sm">
              <div className="md:p-3 h-10 flex items-center justify-center aspect-square rounded-sm text-accent bg-accent/10">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Enter your referral link"
                className="text-sm outline-none w-full px-2 bg-transparent text-white border-0"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </div>
      )}

      {/* {showAdminDashboardPopup && (
        <div className="h-screen w-screen fixed flex items-center justify-center top-0 right-0 px-8 bg-black z-40">
          <div className="md:max-w-xl space-y-6 border bg-black p-6 rounded border-accent/10">
            <div className="flex space-x-2 items-center">
              <button onClick={() => setShowAdminDashboardPopup(false)}>
                <ChevronLeft />
              </button>
              <div>
                <h1 className="text-lg font-medium">Access Admin Dashboard</h1>
                <p className="text-xs text-white/70">
                  To access admin dashboard enter admin code and press enter
                </p>
              </div>
            </div>
            <div className="flex border border-accent rounded-sm">
              <div className="md:p-3 h-10 flex items-center justify-center aspect-square rounded-sm text-accent bg-accent/10">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Enter code"
                className="text-sm outline-none w-full px-2 bg-transparent text-white border-0"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyPress={handleAdminKeyPress}
              />
            </div>
          </div>
        </div>
      )}

      {showAdminDashboard && (
        <AdminDashboard
          setShowDashboard={setShowAdminDashboard}
          setAdminCode={setAdminCode}
        />
      )} */}
    </div>
  );
}
