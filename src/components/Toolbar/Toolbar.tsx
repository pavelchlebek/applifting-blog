import React from 'react';

import { useNavigate } from 'react-router';

import { tenant } from '../../api';
import logo from '../../assets/logo.png';
import { useAuthContext } from '../../store/auth-context';
import { LoginButton } from '../LoginButton/LoginButton';
import { NavItem } from '../NavItem/NavItem';
import classes from './Toolbar.module.css';

type TProps = NoChildren & {
  loggedIn: boolean
}

export const Toolbar: React.FC<TProps> = ({ loggedIn }) => {
  const navigate = useNavigate()
  const authContext = useAuthContext()

  const handleLogout = () => {
    authContext.logout()
  }

  return (
    <div className={classes.toolbar}>
      <div className={classes.content}>
        <div className={classes.leftSection}>
          <img className={classes.logo} src={logo} alt="logo" />
          <ul className={classes.nav}>
            <NavItem to="/" color="secondary">
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
              <NavItem to="/new-article" color="primary">
                Create Article
              </NavItem>
            </ul>
            <LoginButton onClick={handleLogout} title={`Log out ${tenant.name}`} />
          </div>
        ) : (
          <div className={classes.rightSection}>
            <LoginButton onClick={() => navigate("/login")} title="Log in" />{" "}
          </div>
        )}
      </div>
    </div>
  )
}
