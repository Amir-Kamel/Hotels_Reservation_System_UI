import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/login';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className='btn btn-danger'>
      Logout
    </button>
  );
};

export default LogoutButton;
