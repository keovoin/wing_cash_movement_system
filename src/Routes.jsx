import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CashTransferRequestForm from './pages/cash-transfer-request-form';
import SystemAdministrationPanel from './pages/system-administration-panel';
import ReportingAndAnalyticsDashboard from './pages/reporting-and-analytics-dashboard';
import RequestStatusTracking from './pages/request-status-tracking';
import OverLimitApprovalRequestForm from './pages/over-limit-approval-request-form';
import ApprovalQueueDashboard from './pages/approval-queue-dashboard';
import Login from "./pages/Login";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ApprovalQueueDashboard />} />
        <Route path="/cash-transfer-request-form" element={<CashTransferRequestForm />} />
        <Route path="/system-administration-panel" element={<SystemAdministrationPanel />} />
        <Route path="/reporting-and-analytics-dashboard" element={<ReportingAndAnalyticsDashboard />} />
        <Route path="/request-status-tracking" element={<RequestStatusTracking />} />
        <Route path="/over-limit-approval-request-form" element={<OverLimitApprovalRequestForm />} />
        <Route path="/approval-queue-dashboard" element={<ApprovalQueueDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
