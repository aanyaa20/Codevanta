import { Link, useLocation } from "react-router";
import { useUser, UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateSessionModal from "./CreateSessionModal";
import { useCreateSession } from "../hooks/useSessions";
import { useNavigate } from "react-router";

function Navbar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
      problem: "",
      difficulty: "",
  });
  
  const createSessionMutation = useCreateSession();

  const getPageTitle = (pathname) => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/problems")) return "Problems";
    if (pathname.includes("/sessions/active")) return "Live Sessions";
    if (pathname.includes("/sessions/history")) return "History";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/session/")) return "Active Session";
    if (pathname.includes("/problem/")) return "Solving Problem";
    return "Dashboard";
  };
  
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

  return (
    <>
    <header className="h-16 bg-white border-b border-[var(--border-subtle)] flex items-center justify-between px-6 md:px-8 shadow-sm z-40 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary rounded-full px-5 py-2 text-sm shadow-orange-500/20"
        >
          <Plus className="size-4" />
          <span>Create New</span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
        
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "size-9 border-2 border-slate-100"
              }
            }}
          />
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
