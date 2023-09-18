import GithubColors from 'github-colors';
import { useEffect, useState } from 'react';
import { Checkbox, ConfigProvider, Space, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faStar } from '@fortawesome/free-solid-svg-icons';

import StyleTotal from './cssAddRepositoryForm';
import { GetGitHubUrl } from '@/util/functions/GetGithubUrl';
import { TOKEN_GITHUB } from '@/util/constants/SettingSystem';
import { getTheme } from '@/util/functions/ThemeFunction';
import { GET_REPOSITORY_SAGA } from '@/redux/ActionSaga/UserActionSaga';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';

interface ReposProps {
  repositories: any;
  setRepositories: any;
}

const AddRepositoryForm = (Props: ReposProps) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [access_token_github, setAccess_token_github] = useState(
    localStorage.getItem(TOKEN_GITHUB)
  );

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

    let userData: any = undefined;

    const handleMessage = (event: any) => {
      if (event.origin === import.meta.env.VITE_SERVER_ENDPOINT) {
        userData = event.data;
        if (userData) {
          localStorage.setItem(TOKEN_GITHUB, userData.accessTokenGitHub);
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
      dispatch(GET_REPOSITORY_SAGA());
    } else {
      openPopup();
    }
  }, [access_token_github]);

  const { repos } = useAppSelector((state) => state.userReducer);

  const renderItemRepos = (item: any, index: number) => {
    const colorLanguage = GithubColors.get(item.languages)?.color;
    return (
      <div
        className="repositoriesItem px-3 py-4 flex justify-between items-center"
        key={index}
        style={{
          border: `1px solid ${themeColorSet.colorBg4}`,
          borderTop:
            index === 0 ? `1px solid ${themeColorSet.colorBg4}` : 'none',
          height: '100px'
        }}>
        <Space className="left" direction="vertical">
          <div className="top">
            <span
              className="name"
              style={{
                fontSize: '1rem',
                color: themeColorSet.colorText1,
                fontWeight: '600'
              }}>
              {item.name}
            </span>
            <span
              className="rounded-lg ml-3"
              style={{
                color: themeColorSet.colorText3,
                border: `1px solid ${themeColorSet.colorBg4}`,
                fontSize: '0.8rem',
                padding: '0.1rem 0.5rem'
              }}>
              {item.private ? 'Private' : 'Public'}
            </span>
          </div>
          <div className="bottom items-center">
            <span className="mr-3">
              <span className="mr-2 text-2xl" style={{ color: colorLanguage }}>
                •
              </span>
              {item.languages}
            </span>
            <span className="star mr-3">
              <FontAwesomeIcon size="xs" icon={faStar} />
              <span className="ml-1">{item.watchersCount}</span>
            </span>
            <span className="fork">
              <FontAwesomeIcon size="xs" icon={faCodeFork} />
              <span className="ml-1">{item.forksCount}</span>
            </span>
          </div>
        </Space>
        <div className="right">
          <ConfigProvider
            theme={{
              token: {
                controlHeight: 40,
                colorBorder: themeColorSet.colorText3
              }
            }}>
            <Checkbox
              defaultChecked={newRepositories.some((repo: any) => {
                return repo?.id == item?.id;
              })}
              onChange={(e) => {
                if (e.target.checked) {
                  newRepositories.push(item);
                } else {
                  newRepositories.splice(
                    newRepositories.findIndex(
                      (repo: any) => repo?.id == item.id
                    ),
                    1
                  );
                }
              }}></Checkbox>
          </ConfigProvider>
        </div>
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div className="addRepositories">
          {!access_token_github || repos.length === 0 ? (
            <div className="py-20">
              <Spin tip="Loading" size="large">
                <div className="content" />
              </Spin>
            </div>
          ) : (
            // Nếu có access_token_github
            <div>
              <div
                className="title mt-5"
                style={{ fontSize: '1.1rem', color: themeColorSet.colorText1 }}>
                Select the repositories you want to feature
              </div>
              <div
                className="repositories mt-5 mb-6 px-2"
                style={{
                  maxHeight: '402px',
                  overflow: 'auto'
                }}>
                {repos.map((item, index) => {
                  return renderItemRepos(item, index);
                })}
              </div>
            </div>
          )}
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default AddRepositoryForm;
