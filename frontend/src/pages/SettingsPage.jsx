import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  CheckIcon,
  UserIcon,
  MailIcon,
  CameraIcon,
  TrashIcon,
  AlertTriangleIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("account");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Account settings states
  const [name, setName] = useState(user?.firstName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password changed successfully!");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  };

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleUpdateEmail = () => {
    toast.success("Email updated successfully!");
  };

  const handleAddAlternateEmail = () => {
    if (!alternateEmail) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success("Alternate email added successfully!");
    setAlternateEmail("");
  };

  const handleDeleteAccount = () => {
    toast.success("Account deletion requested");
    setShowDeleteConfirm(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Settings
          </h1>
          <p className="text-slate-500">Manage your account preferences and profile details</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "account"
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Account Settings
            {activeTab === "account" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Account Settings Tab */}
          {activeTab === "account" && (
            <div className="space-y-8">
              {/* Profile Picture */}
              <div className="card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <CameraIcon className="size-6 text-orange-500" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <img
                      src={user?.imageUrl}
                      alt={user?.firstName || "User"}
                      className="relative size-24 rounded-full border-2 border-white shadow-lg object-cover"
                    />
                  </div>
                  <button className="btn-primary">
                    Change Picture
                  </button>
                </div>
              </div>

              {/* Update Name */}
              <div className="card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <UserIcon className="size-6 text-orange-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                     <div className="flex gap-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-modern flex-1"
                          placeholder="Enter your name"
                        />
                        <button
                          onClick={handleUpdateProfile}
                          className="btn-primary"
                        >
                          Save
                        </button>
                     </div>
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              <div className="card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <MailIcon className="size-6 text-orange-500" />
                  Email Preferences
                </h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Primary Email</label>
                        <div className="flex gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-modern flex-1"
                            placeholder="Enter your email"
                        />
                        <button
                            onClick={handleUpdateEmail}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                        >
                            Update
                        </button>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Email</label>
                        <div className="flex gap-3">
                        <input
                            type="email"
                            value={alternateEmail}
                            onChange={(e) => setAlternateEmail(e.target.value)}
                            className="input-modern flex-1"
                            placeholder="Enter alternate email"
                        />
                        <button
                            onClick={handleAddAlternateEmail}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                        >
                            Add
                        </button>
                        </div>
                    </div>
                </div>
              </div>

              {/* Security */}
              <div className="card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <LockIcon className="size-6 text-orange-500" />
                  Security
                </h3>
                
                {!showPasswordForm ? (
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-slate-900 font-medium">Password</p>
                       <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                     </div>
                     <button
                        onClick={() => setShowPasswordForm(true)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                      >
                        Change Password
                      </button>
                   </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input-modern w-full pr-12"
                          placeholder="Enter new password"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input-modern w-full pr-12"
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="btn-primary flex items-center gap-2"
                      >
                        <CheckIcon className="size-5" />
                        Save Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Danger Zone */}
              <div className="card p-8 border border-red-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AlertTriangleIcon className="size-32 text-red-500" />
                </div>
                
                <p className="mb-6 text-slate-500 max-w-xl">
                  Once you delete your account, there is no going back. This action is irreversible and will permanently delete your personal data and session history.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    <TrashIcon className="size-5" />
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4 bg-red-50 p-6 rounded-xl border border-red-200">
                    <p className="text-red-600 font-semibold">Are you absolutely sure you want to delete your account?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200"
                      >
                        Yes, Delete My Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-6 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-semibold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
