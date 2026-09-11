import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import RoleSelector from './pages/shared/RoleSelector';
import CollectorLayout from './pages/collector/CollectorLayout';
import RecyclerLayout from './pages/recycler/RecyclerLayout';
import { AddToHomeScreenPrompt } from './components/ui/AddToHomeScreenPrompt';

// Collector Pages Placeholder
const CollectorHome = React.lazy(() => import('./pages/collector/Home'));
const CreateLot = React.lazy(() => import('./pages/collector/CreateLot'));
const CollectorPrices = React.lazy(() => import('./pages/collector/Prices'));
const CollectorRecyclers = React.lazy(() => import('./pages/collector/Recyclers'));
const Handover = React.lazy(() => import('./pages/collector/Handover'));
const Earnings = React.lazy(() => import('./pages/collector/Earnings'));
const Profile = React.lazy(() => import('./pages/collector/Profile'));

// Recycler Pages Placeholder
const RecyclerDashboard = React.lazy(() => import('./pages/recycler/Dashboard'));
const IncomingLots = React.lazy(() => import('./pages/recycler/IncomingLots'));
const Traceability = React.lazy(() => import('./pages/recycler/Traceability'));

function App() {
  return (
    <AppProvider>
      <Router>
        <AddToHomeScreenPrompt />
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            
            {/* Collector Routes */}
            <Route path="/collector" element={<CollectorLayout />}>
              <Route index element={<CollectorHome />} />
              <Route path="create" element={<CreateLot />} />
              <Route path="prices" element={<CollectorPrices />} />
              <Route path="recyclers" element={<CollectorRecyclers />} />
              <Route path="handover/:id" element={<Handover />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Recycler Routes */}
            <Route path="/recycler" element={<RecyclerLayout />}>
              <Route index element={<RecyclerDashboard />} />
              <Route path="lots" element={<IncomingLots />} />
              <Route path="traceability" element={<Traceability />} />
              <Route path="*" element={<Navigate to="/recycler" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AppProvider>
  );
}

export default App;
