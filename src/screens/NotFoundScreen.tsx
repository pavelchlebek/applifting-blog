import React from 'react';

import { Screen } from '../components/Screen/Screen';
import { useAuthContext } from '../store/auth-context';

type TProps = NoChildren

export const NotFoundScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()

  return (
    <Screen loggedIn={authContext.token ? true : false}>
      <main style={{ padding: "1rem" }}>
        <p>There's nothing here!</p>
      </main>
    </Screen>
  )
}
