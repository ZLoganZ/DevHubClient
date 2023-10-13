import GithubColors from 'github-colors';
import { useEffect, useState } from 'react';
import { Checkbox, ConfigProvider, Space, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faStar } from '@fortawesome/free-solid-svg-icons';

import StyleProvider from './cssAddRepositoryForm';
import { GetGitHubUrl } from '@/util/getGithubUrl';
import { GITHUB_TOKEN } from '@/util/constants/SettingSystem';
import { getTheme } from '@/util/theme';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useGetRepository } from '@/hooks/fetch';
import { RepositoryType } from '@/types';

interface ReposProps {
  repositories: RepositoryType[];
  setRepositories: (repos: RepositoryType[]) => void;
}

const AddRepositoryForm = (Props: ReposProps) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const [access_token_github, setAccess_token_github] = useState(localStorage.getItem(GITHUB_TOKEN));

  const { repository, isLoadingRepository } = useGetRepository();

  const openPopup = () => {
    const width = 500; // Width of the pop-up window
    const height = 800; // Height of the pop-up window
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      GetGitHubUrl(),
      'GithubAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    let userData: any;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === import.meta.env.VITE_SERVER_ENDPOINT) {
        userData = event.data;
        if (userData) {
          localStorage.setItem(GITHUB_TOKEN, userData.accessTokenGitHub);
          setAccess_token_github(userData.accessTokenGitHub);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const pollOAuthStatus = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollOAuthStatus);
        window.removeEventListener('message', handleMessage);
        !userData && dispatch(closeModal());
      }
    }, 300);
  };

  const newRepositories = [...Props.repositories];

  const handleChangeRepositories = () => {
    Props.setRepositories(newRepositories);
    dispatch(closeModal());
  };

  useEffect(() => {
    dispatch(setHandleSubmit(handleChangeRepositories));
  }, [newRepositories]);

  useEffect(() => {
    if (access_token_github) {
      if (!isLoadingRepository && repository) {
        setRepos(repository);
      }
    } else {
      openPopup();
    }
  }, [access_token_github, repository, isLoadingRepository]);

  const [repos, setRepos] = useState<RepositoryType[]>([]);

  const renderItemRepos = (item: RepositoryType, index: number) => {
    const colorLanguage = GithubColors.get(item.languages)?.color;
    return (
      <div
        className='repositoriesItem px-3 py-4 flex justify-between items-center'
        key={index}
        style={{
          border: `1px solid ${themeColorSet.colorBg4}`,
          borderTop: index === 0 ? `1px solid ${themeColorSet.colorBg4}` : 'none',
          height: '100px'
        }}>
        <Space className='left' direction='vertical'>
          <div className='top'>
            <span
              className='name'
              style={{
                fontSize: '1rem',
                color: themeColorSet.colorText1,
                fontWeight: '600'
              }}>
              {item.name}
            </span>
            <span
              className='rounded-lg ml-3'
              style={{
                color: themeColorSet.colorText3,
                border: `1px solid ${themeColorSet.colorBg4}`,
                fontSize: '0.8rem',
                padding: '0.1rem 0.5rem'
              }}>
              {item.private ? 'Private' : 'Public'}
            </span>
          </div>
          <div className='bottom flex items-center'>
            <span className='mr-3 flex items-center'>
              <span className='mr-2 text-2xl' style={{ color: colorLanguage }}>
                •
              </span>
              {item.languages}
            </span>
            <span className='star mr-3'>
              <FontAwesomeIcon size='xs' icon={faStar} />
              <span className='ml-1'>{item.watchers_count}</span>
            </span>
            <span className='fork'>
              <FontAwesomeIcon size='xs' icon={faCodeFork} />
              <span className='ml-1'>{item.forks_count}</span>
            </span>
          </div>
        </Space>
        <div className='right'>
          <ConfigProvider
            theme={{
              token: {
                controlHeight: 40,
                colorBorder: themeColorSet.colorText3
              }
            }}>
            <Checkbox
              defaultChecked={newRepositories.some((repo) => {
                return repo.id === item.id;
              })}
              onChange={(e) => {
                if (e.target.checked) {
                  newRepositories.push(item);
                } else {
                  newRepositories.splice(
                    newRepositories.findIndex((repo) => repo.id === item.id),
                    1
                  );
                }
              }}
            />
          </ConfigProvider>
        </div>
      </div>
    );
  };

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='addRepositories'>
        {!access_token_github || repos.length === 0 ? (
          <div className='py-20'>
            <Spin tip='Loading' size='large'>
              <div className='content' />
            </Spin>
          </div>
        ) : (
          // Nếu có access_token_github
          <>
            <div className='title mt-5' style={{ fontSize: '1.1rem', color: themeColorSet.colorText1 }}>
              Select the repositories you want to feature
            </div>
            <div
              className='repositories mt-5 mb-6 px-2'
              style={{
                maxHeight: '402px',
                overflow: 'auto'
              }}>
              {repos.map((item, index) => {
                return renderItemRepos(item, index);
              })}
            </div>
          </>
        )}
      </div>
    </StyleProvider>
  );
};

export default AddRepositoryForm;
