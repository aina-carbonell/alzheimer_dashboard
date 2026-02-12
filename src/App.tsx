import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sooner } from "@/components/ui/sooner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext";
import Index from "./pages/Index";
import Atrofia from "./pages/Atrofia";
import Genere from "./pages/Genere";
import Educacio from "./pages/Educacio";
import Edat from "./pages/Edat";
import Distribucions from "./pages/Distribucions";
import Conclusions from "./pages/Conclusions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider
            <FilterProvider>
                <Toaster />
                <Sooner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/atrofia" element={<Atrofia />} />
                        <Route path="/genere" element={<Genere />} />
                        <Route path="/educacio" element={<Educacio />} />
                        <Route path="/edat" element={<Edat />} />
                        <Route path="/distribucions" element={<Distribucions />} />
                        <Route path="/conclusions" element={<Conclusions />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </FilterProvider>
        </TooltipProvider>
    </QueryClientProvider>
);