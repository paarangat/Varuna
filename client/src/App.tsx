import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ShipProvider } from "./lib/ShipContext";

// Pages
import Overview from "@/pages/Overview";
import NavigationControl from "@/pages/NavigationControl";
import FireAlert from "@/pages/FireAlert";
import ThreatDetection from "@/pages/ThreatDetection";

// Layout
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B263B] text-[#E0E1DD]">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <Switch>
            <Route path="/" component={Overview} />
            <Route path="/navigation" component={NavigationControl} />
            <Route path="/fire-alert" component={FireAlert} />
            <Route path="/threat-detection" component={ThreatDetection} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShipProvider>
        <Router />
        <Toaster />
      </ShipProvider>
    </QueryClientProvider>
  );
}

export default App;
