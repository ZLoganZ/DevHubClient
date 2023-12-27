import { useEffect } from 'react';

import { AUTHORIZATION, CLIENT_ID, GITHUB_TOKEN, REFRESHTOKEN } from '@/util/constants/SettingSystem';

const AlternativeLogin = () => {
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    localStorage.setItem(AUTHORIZATION, params.get('accessToken') || '');
    localStorage.setItem(REFRESHTOKEN, params.get('refreshToken') || '');
    localStorage.setItem(GITHUB_TOKEN, params.get('accessTokenGitHub') || '');
    localStorage.setItem(CLIENT_ID, params.get('_id') || '');
    if (params.get('accessToken')) {
      window.location.replace('/');
    }
  }, []);

  return <></>;
};

export default AlternativeLogin;
