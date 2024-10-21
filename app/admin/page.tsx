"use client";
import { ChevronLeft, Lock } from "lucide-react";
import React, { useState } from "react";
import AdminDashboard from "../AdminDashboard";
import crypto from "crypto";
import { toast } from "react-toastify";
import Link from "next/link";

function Admin() {
  const [showAdminDashboardPopup, setShowAdminDashboardPopup] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const handleAdminKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && adminCode.trim() !== "") {
      const hash = crypto
        .createHash("sha256")
        .update(adminCode.trim())
        .digest("hex");
      if (hash.toString() == process.env.NEXT_PUBLIC_PASS?.toString()) {
        setShowAdminDashboardPopup(false);
        setShowAdminDashboard(true);
      } else {
        toast.error("Wrong code");
      }
    }
  };
  return (
    <section>
      <div className="h-screen w-screen fixed flex items-center justify-center top-0 right-0 px-8 bg-black z-40">
        <div className="md:max-w-xl space-y-6 border bg-black p-6 rounded border-accent/10">
          <div className="flex space-x-2 items-center">
            <Link href={"/"}>
              <button>
                <ChevronLeft className="text-white" />
              </button>
            </Link>
            <div className=" text-white">
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

      {showAdminDashboard && (
        <AdminDashboard
          setShowDashboard={setShowAdminDashboard}
          setAdminCode={setAdminCode}
        />
      )}
    </section>
  );
}

export default Admin;
