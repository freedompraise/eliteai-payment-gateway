import { Lock } from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-24 md:h-32 relative">
      <nav className="w-full flex px-10 md:px-[80px] py-6 md:py-10 fixed top-0 right-0 bg-black/50 justify-between items-center  z-40">
        <div className="h-8 w-8 md:h-10 md:w-10 relative">
          <img src="/logo.png" className="h-full w-full absolute" />
        </div>
        <div className="flex space-x-3">
          <button className="py-2 px-4 md:px-6 md:py-2 rounded-sm bg-accent text-white font-semibold">
            Dashboard
          </button>
          <button className="md:p-3 h-10 flex items-center justify-center aspect-square rounded-sm text-accent border border-accent">
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>
  );
}
