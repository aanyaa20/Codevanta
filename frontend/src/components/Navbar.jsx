import { Link, useLocation } from "react-router";
import { useUser, SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/clerk-react";
import { Plus, LogOut, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import CreateSessionModal from "./CreateSessionModal";
import { useCreateSession } from "../hooks/useSessions";
import { useNavigate } from "react-router";

function Navbar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
      problem: "",
      difficulty: "",
  });
  
  const createSessionMutation = useCreateSession();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleHelpCentre = () => {
    navigate("/#contact");
    setShowProfileMenu(false);
  };

  return (
    <>
    <header className="h-16 bg-white border-b border-[var(--border-subtle)] flex items-center justify-end px-6 md:px-8 shadow-sm z-40 relative">

      <div className="flex items-center gap-4">
        {/* Only show Create New button on Live Sessions page */}
        {location.pathname === '/live-sessions' && (
          <>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary rounded-full px-5 py-2 text-sm shadow-orange-500/20"
            >
              <Plus className="size-4" />
              <span>Create New</span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
          </>
        )}
        
        <SignedIn>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <img
                src={user?.imageUrl}
                alt={user?.fullName || "User"}
                className="size-9 rounded-full border-2 border-slate-100"
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
        </SignedIn>
      </div>
    </header>
    
    <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default Navbar;
