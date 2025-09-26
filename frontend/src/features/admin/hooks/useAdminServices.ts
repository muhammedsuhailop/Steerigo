import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store/hooks';
import { AdminServices, AdminServiceContainer } from '../services/AdminServiceContainer';

export const useAdminServices = (): AdminServices => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Initialize services if not already done
  const container = AdminServiceContainer.getInstance();
  try {
    return container.getServices();
  } catch {
    container.initialize(dispatch, navigate);
    return container.getServices();
  }
};
