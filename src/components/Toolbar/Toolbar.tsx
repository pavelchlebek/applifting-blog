import React from 'react';

import logo from '../../assets/logo.png';
import { LoginButton } from '../LoginButton/LoginButton';
import { NavItem } from '../NavItem/NavItem';
import classes from './Toolbar.module.css';

type TProps = NoChildren & {
  loggedIn: boolean
}

export const Toolbar: React.FC<TProps> = ({ loggedIn }) => {
  return (
    <div className={classes.toolbar}>
      <div className={classes.content}>
        <div className={classes.leftSection}>
          <img className={classes.logo} src={logo} alt="logo" />
          <ul className={classes.nav}>
            <NavItem to="/articles" color="secondary">
              Recent articles
            </NavItem>
            <NavItem to="/screen" color="secondary">
              About
            </NavItem>
          </ul>
        </div>
        {loggedIn ? (
          <div className={classes.rightSection}>
            <ul className={classes.nav}>
              <NavItem to="/my-articles" color="secondary">
                My Articles
              </NavItem>
              <NavItem to="/create-article" color="primary">
                Create Article
              </NavItem>
            </ul>
            <LoginButton onClick={() => console.log("Logging out")} title="Log out" />
          </div>
        ) : (
          <div className={classes.rightSection}>
            <LoginButton onClick={() => console.log("Logging in")} title="Log in" />{" "}
          </div>
        )}
      </div>
    </div>
  )
}
