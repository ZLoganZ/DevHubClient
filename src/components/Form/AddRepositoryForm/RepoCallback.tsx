import { useEffect } from 'react';

import { GITHUB_TOKEN } from '@/util/constants/SettingSystem';

const RepoCallback = () => {
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    localStorage.setItem(GITHUB_TOKEN, params.get('accessTokenGitHub') || '');
    window.close();
  }, []);

  return <></>;
};

export default RepoCallback;
