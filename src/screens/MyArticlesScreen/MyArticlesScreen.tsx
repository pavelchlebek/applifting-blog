import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import { useAuthContext } from '../../store/auth-context';
import classes from './MyArticlesScreen.module.css';

type TProps = NoChildren

export const MyArticlesScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()
  const navigate = useNavigate()
  return (
    <Screen loggedIn={authContext.token ? true : false}>
      <div className={classes.page}>
        <div className={classes.headingRow}>
          <ScreenHeading title="My articles" />
          <div className={classes.buttonWrapper}>
            <Button
              onClick={() => navigate("/new-article")}
              color="primary"
              title="Create new article"
            />
          </div>
        </div>
        <table className={classes.table}>
          <thead className={classes.tableHeadingRow}>
            <tr>
              <th>Article title</th>
              <th>Perex</th>
              <th>Author</th>
              <th># of comments</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
      </div>
    </Screen>
  )
}
