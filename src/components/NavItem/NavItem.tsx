import React from 'react';

import { NavLink } from 'react-router-dom';

import classes from './NavItem.module.css';

type TProps = React.PropsWithChildren<{
  color: "primary" | "secondary"
  to: string
  children: string
}>

export const NavItem: React.FC<TProps> = ({ children, to, color }) => {
  // const getColor = (option: string) => {
  //   if (option === "primary") {
  //     return "#007BFF"
  //   }
  //   return "#6C757D"
  // }

  let attachedClasses = classes.navItem
  if (color === "primary") {
    attachedClasses += " " + classes.primary
  }

  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          isActive ? attachedClasses + " " + classes.active : attachedClasses
        }
        to={to}
      >
        {children}
      </NavLink>
    </li>
  )
}
