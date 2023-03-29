import {useContext} from 'react';
import AuthContext, {AuthContextType} from './AuthContext';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext is not set');
  }

  return context;
};

export default useAuth;
