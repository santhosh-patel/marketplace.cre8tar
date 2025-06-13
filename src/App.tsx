
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { WalletProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Mint from "./pages/Mint";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import Buy from "./pages/Buy";
import Stake from "./pages/Stake";
import Fusion from "./pages/Fusion";
import Companion from "./pages/Companion";
import Whitepaper from "./pages/Whitepaper";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/fusion" element={<Fusion />} />
                <Route path="/companion" element={<Companion />} />
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
