import React from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';

import {
  API,
  tenant,
} from '../api';

type TAuthContextObject = {
  name: string
  login: (username: string, password: string) => void
  logout: () => void
  token: TToken | undefined
  loginError: ILoginError | undefined
}

type TToken = {
  expiresIn: number
  accessToken: string
}

const AuthContext = React.createContext<TAuthContextObject>({
  name: "",
  login: () => {},
  logout: () => {},
  token: { expiresIn: 0, accessToken: "" },
  loginError: { code: "", message: "" },
})

const headers = {
  "X-API-KEY": tenant.apiKey,
  // Authorization: "14ca9347-62d7-41b9-a087-10b916cf6bbe",
}

interface ILoginSuccess {
  access_token: string
  expires_in: number
  token_type: string
}

interface ILoginError {
  code: string
  message: string
}

const ACCESS_TOKEN = "accessToken"
const TOKEN_EXPIRES_IN = "tokenExpiresIn"

const getTokenFromLocalStorage = (): TToken | undefined => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const tokenExpiresIn = localStorage.getItem(TOKEN_EXPIRES_IN)
  if (accessToken && tokenExpiresIn) {
    return { accessToken: accessToken, expiresIn: parseInt(tokenExpiresIn) }
  }
  return undefined
}

export const useAuthContext = () => {
  return React.useContext(AuthContext)
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = React.useState<TToken | undefined>(getTokenFromLocalStorage())
  const [loginError, setLoginError] = React.useState<ILoginError>()

  // setToken(getTokenFromLocalStorage())

  const navigate = useNavigate()

  const login = async (username: string, password: string) => {
    setToken(undefined)
    setLoginError(undefined)
    try {
      const response = await axios.post<ILoginSuccess>(
        `${API.server}${API.endpoints.LOGIN}`,
        {
          username: username,
          password: password,
        },
        {
          headers: headers,
        }
      )
      setToken({ accessToken: response.data.access_token, expiresIn: response.data.expires_in })
      localStorage.setItem(ACCESS_TOKEN, response.data.access_token)
      localStorage.setItem(TOKEN_EXPIRES_IN, response.data.expires_in.toString())
      navigate("/articles")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const serverError = err.response.data as ILoginError
          setLoginError(serverError)
        }
      }
    }
  }

  const logout = () => {
    setToken(undefined)
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_EXPIRES_IN)
    navigate("/articles")
  }

  const contextValue: TAuthContextObject = {
    name: tenant.name,
    login: login,
    logout: logout,
    token: token,
    loginError: loginError,
  }
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
