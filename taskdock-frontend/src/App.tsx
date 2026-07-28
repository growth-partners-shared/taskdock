// THIRD PARTY
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// THIRD PARTY COMPONENTS
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// ROUTES
import ProtectedRoute from "@/routes/ProtectedRoute";

// PAGES
import BoardsDashboard from "./pages/BoardsDashboard";
import BoardView from "./pages/BoardView";
import ForgotPassword from "./pages/ForgotPassword";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/PasswordReset";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/UnAuthorized";
import Verify from "./pages/Verify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Index />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/verify-email" element={<Verify />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/boards" element={<BoardsDashboard />} />

            <Route path="/boards/:boardId" element={<BoardView />} />

            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
