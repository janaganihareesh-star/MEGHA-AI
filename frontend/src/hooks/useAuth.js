import { useSelector, useDispatch } from 'react-redux';
import { registerUser, loginUser, verifyOtp, resendOtp, logout } from '../store/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const register = (data) => dispatch(registerUser(data)).unwrap();
  const login = (data) => dispatch(loginUser(data)).unwrap();
  const verify = (data) => dispatch(verifyOtp(data)).unwrap();
  const resend = (userId) => dispatch(resendOtp(userId)).unwrap();
  const handleLogout = () => dispatch(logout());

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    verify,
    resend,
    logout: handleLogout
  };
}