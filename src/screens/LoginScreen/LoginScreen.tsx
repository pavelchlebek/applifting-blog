import React from 'react';

import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { useAuthContext } from '../../store/auth-context';

type TProps = NoChildren

export const LoginScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()

  const handleClick = () => {
    authContext.login("Palisandr", "qwertyui")
  }

  return (
    <Screen loggedIn>
      <div>{authContext.name}</div>
      <div>{authContext.token?.accessToken}</div>
      <div>{authContext.token?.expiresIn}</div>
      <Button color="secondary" title="login" onClick={handleClick} />
    </Screen>
  )
}
