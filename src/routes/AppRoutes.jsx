import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import ProtectedLayout from '../components/ProtectedLayout.jsx';
import Login from '../pages/Login.jsx';
import MerchantList from '../pages/MerchantList.jsx';
import AddMerchant from '../pages/AddMerchant.jsx';
import EditMerchant from '../pages/EditMerchant.jsx';
import MerchantDetail from '../pages/MerchantDetail.jsx';
import NotFound from '../pages/NotFound.jsx';
import { ROUTES } from '../utils/constants';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={<Navigate to={ROUTES.MERCHANTS} replace />}
        />
        <Route path={ROUTES.MERCHANTS} element={<MerchantList />} />
        <Route path={ROUTES.ADD_MERCHANT} element={<AddMerchant />} />
        <Route path={ROUTES.EDIT_MERCHANT()} element={<EditMerchant />} />
        <Route path={ROUTES.MERCHANT_DETAIL()} element={<MerchantDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
