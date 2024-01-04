export const GetGitHubUrl = (repo = false) => {
  const rootURl = 'https://github.com/login/oauth/authorize';

  const options = {
    client_id: repo
      ? (import.meta.env.VITE_GITHUB_REPO_OAUTH_CLIENT_ID as string)
      : (import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID as string),
    // redirect_uri: repo
    // ? import.meta.env.VITE_GITHUB_REPO_OAUTH_REDIRECT_URL as string
    // : import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL as string,
    scope: 'user,repo'
  };

  const qs = new URLSearchParams(options);

  return `${rootURl}?${qs.toString()}`;
};
