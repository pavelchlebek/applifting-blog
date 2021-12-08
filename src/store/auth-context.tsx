import React from 'react';

import axios from 'axios';

import {
  API,
  tenant,
} from '../api';

type TAuthContextObject = {
  name: string
  login: (username: string, password: string) => void
  token: TToken | undefined
}

type TToken = {
  expiresIn: number
  accessToken: string
}

const AuthContext = React.createContext<TAuthContextObject>({
  name: "",
  login: () => {},
  token: { expiresIn: 0, accessToken: "" },
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

export const useAuthContext = () => {
  return React.useContext(AuthContext)
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = React.useState<TToken>()

  const login = async (username: string, password: string) => {
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
    } catch (err) {}
  }

  const contextValue: TAuthContextObject = {
    name: tenant.name,
    login: login,
    token: token,
  }
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
