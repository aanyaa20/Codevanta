import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mesh Gradient Background */}
      <div className="dashboard-mesh-bg">
        <div className="dashboard-mesh-glow-1"></div>
        <div className="dashboard-mesh-glow-2"></div>
        <div className="dashboard-mesh-noise"></div>
      </div>
      
      {/* Sidebar - Fixed Left */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Navbar collapsed={collapsed} />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
