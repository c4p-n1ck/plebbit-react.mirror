import {
  useAccount,
  useAccounts,
  useAccountsActions,
  useAccountSubplebbits,
  useSubplebbits,
} from '@plebbit/plebbit-react-hooks';
import React, { createContext, useState, useEffect } from 'react';
import useSubPlebbitDefaultData from '../hooks/useSubPlebbitDefaultData';

export const ProfileContext = createContext();

export const ProfileDataProvider = (props) => {
  const { children } = props;
  const [reloadUser, setReloadUser] = useState(false);
  const [postStyle, setPostStyle] = useState('card');
  const [feedSort, setFeedSort] = useState('hot');
  const [showSplashcreen, setShowSplashcreen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [device, setDevice] = useState('pc');
  const { exportAccount, createAccount, importAccount, setActiveAccount, setAccountsOrder } =
    useAccountsActions();
  const defaultAccount = useAccount();
  const accountLists = useAccounts();
  const accountSubplebbits = useAccountSubplebbits();
  const subscriptions = useSubplebbits(defaultAccount?.subscriptions);
  const subPlebbitDefData = useSubPlebbitDefaultData();
  const { version } = require('../../package.json');
  const [postView, setPostView] = useState(
    subscriptions?.length
      ? subscriptions?.map((x) => x?.address)
      : subPlebbitDefData?.map((x) => x?.value)
  );

  const profile = defaultAccount;

  const handleResize = () => {
    if (window.innerWidth > 1200) {
      setDevice('pc');
    } else if (window.innerWidth > 960 && window.innerWidth < 1200) {
      setDevice('tablet');
    } else {
      setDevice('mobile');
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, [device]);

  const logUserOut = () => {};

  useEffect(() => {
    setTimeout(() => {
      setShowSplashcreen(false);
    }, 4000);
  }, [reloadUser]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setReloadUser,
        reloadUser,
        logUserOut,
        postStyle,
        setPostStyle,
        isLoggedIn,
        setIsLoggedIn,
        showSplashcreen,
        feedSort,
        setFeedSort,
        device,
        setDevice,
        accountLists,
        exportAccount,
        importAccount,
        setActiveAccount,
        setAccountsOrder,
        createAccount,
        accountSubplebbits,
        version,
        subscriptions,
        postView,
        setPostView,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
