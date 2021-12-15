import React from 'react';

import { Overlay } from '../Overlay/Overlay';
import classes from './Modal.module.css';

type TProps = React.PropsWithChildren<{
  show: boolean
  onModalClose: () => void
}>

export const Modal: React.FC<TProps> = ({ children, onModalClose, show }) => {
  return (
    <>
      <Overlay show={show} onClick={onModalClose} />
      <div
        className={classes.modal}
        style={{
          transform: show ? "translateY(0)" : "translateY(-100vh)",
          opacity: show ? "1" : "0",
        }}
      >
        {children}
      </div>
    </>
  )
}
