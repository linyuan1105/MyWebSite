import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { useLocation, Navigate } from 'react-router-dom'
import {
  userSelector, signOut, signIn
} from '../../store/user'
import { useSelector } from 'react-redux'

const AuthContext = createContext(null)
export const AuthProvider = ({ children, }) => {
  const user = useSelector(userSelector)
  const value = {
    user,
    signOut,
    signIn,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
AuthProvider.propTypes = {
  children: PropTypes.element,
}

export function useAuth() {
  return useContext(AuthContext)
}
export function RequireAuth({ children, }) {
  const auth = useAuth()
  const location = useLocation()
  if (!auth.user.name) {
    return <Navigate to='/LoginPage' state={{ from: location, }} replace></Navigate>
  }
  return children
}

RequireAuth.propTypes = {
  children: PropTypes.element,
}
