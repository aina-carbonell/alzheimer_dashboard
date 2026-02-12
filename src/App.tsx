import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Atrofia from "./pages/Atrofia";
import Genere from "./pages/Genere";
import Educacio from "./pages/Educacio";
import Edat from "./pages/Edat";
import Distribucions from "./pages/Distribucions";
import Conclusions from "./pages/Conclusions";
import NotFound from "./pages/NotFound";
import DeepLearning from "./pages/DeepLearning";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/atrofia" element={<Atrofia />} />
                    <Route path="/genere" element={<Genere />} />
                    <Route path="/educacio" element={<Educacio />} />
                    <Route path="/edat" element={<Edat />} />
                    <Route path="/distribucions" element={<Distribucions />} />
                    <Route path="/deeplearning" element={<DeepLearning />} />
                    <Route path="/conclusions" element={<Conclusions />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;