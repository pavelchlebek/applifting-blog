import React from 'react';

import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Screen } from '../../components/Screen/Screen';
import { TextInput } from '../../components/TextInput/TextInput';
import { useAuthContext } from '../../store/auth-context';
import classes from './LoginScreen.module.css';

type TProps = NoChildren

export const LoginScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()

  const [userName, setUserName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [inputsValid, setInputsValid] = React.useState(true)

  const [showModal, setShowModal] = React.useState(false)

  const handleLogin = async () => {
    authContext.setOnLoginError(undefined)
    if (userName.length > 3 && password.length > 3) {
      setInputsValid(true)
      authContext.login(userName, password)
      if (authContext.loginError) {
        setShowModal(true)
      }
    } else {
      setInputsValid(false)
      setShowModal(true)
    }
  }

  React.useEffect(() => {
    if (authContext.loginError) {
      setShowModal(true)
    }
  }, [authContext.loginError])

  return (
    <Screen loggedIn={authContext.token ? true : false}>
      <Modal show={showModal} onModalClose={() => setShowModal(false)}>
        {!inputsValid && (
          <div className={classes.alert}>
            Both your name and your password must have at least 4 characters!
          </div>
        )}
        {authContext.loginError && (
          <div
            className={classes.alert}
          >{`Server responded: ${authContext.loginError.code} -- ${authContext.loginError.message}. Please try again`}</div>
        )}
        <div className={classes.confirmButtonWrapper}>
          <Button color="primary" onClick={() => setShowModal(false)} title="Got it" />
        </div>
      </Modal>
      <div className={classes.page}>
        <div className={classes.form}>
          <h4 className={classes.heading}>Log In</h4>
          <TextInput
            onChange={(e) => setUserName(e.currentTarget.value)}
            value={userName}
            label="Username"
            placeholder="Your name"
          />
          <TextInput
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
            label="Password"
            placeholder="**********"
            password
          />
          <div className={classes.buttonContainer}>
            <Button
              title="Log In"
              color="primary"
              onClick={handleLogin}
              style={{
                height: "46px",
                paddingTop: "11px",
                paddingBottom: "11px",
                width: "69px",
              }}
            />
          </div>
        </div>
      </div>
    </Screen>
  )
}
