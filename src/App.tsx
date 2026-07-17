import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import AppLayout from "./pages/layout/AppLayout.tsx";
import Dashboard from "./pages/dashboard/page.tsx";
import Clients from "./pages/clients/page.tsx";
import ClientDetail from "./pages/clients/[id]/page.tsx";
import RegisterClient from "./pages/clients/register/page.tsx";
import PaymentPage from "./pages/payment/page.tsx";
import Transactions from "./pages/transactions/page.tsx";
import Staff from "./pages/staff/page.tsx";
import Services from "./pages/services/page.tsx";
import Shoots from "./pages/shoots/page.tsx";
import Commissions from "./pages/commissions/page.tsx";
import Reports from "./pages/reports/page.tsx";
import AuditLogs from "./pages/audit-logs/page.tsx";
import DeliveryPage from "./pages/delivery/page.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/register" element={<RegisterClient />} />
            <Route path="/payment/:clientId" element={<PaymentPage />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/services" element={<Services />} />
            <Route path="/shoots" element={<Shoots />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
