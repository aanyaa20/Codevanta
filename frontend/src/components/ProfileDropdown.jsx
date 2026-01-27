import { useUser, useClerk } from "@clerk/clerk-react";
import { LogOut, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

function ProfileDropdown() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleHelpCentre = () => {
    navigate("/#contact");
    setShowProfileMenu(false);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100/50 transition-colors"
      >
        <img
          src={user?.imageUrl}
          alt={user?.fullName || "User"}
          className="size-9 rounded-full border-2 border-white shadow-sm"
        />
        <ChevronDown className={`size-4 text-slate-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showProfileMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowProfileMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
              <p className="text-xs text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            
            <button
              onClick={handleHelpCentre}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <HelpCircle className="size-4 text-slate-500" />
              Help Centre
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileDropdown;
