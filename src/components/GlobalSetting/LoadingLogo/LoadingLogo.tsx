import Title from 'antd/es/typography/Title';
import { ConfigProvider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';

import { getTheme } from '@/util/functions/ThemeFunction';
import StyleTotal from './cssLoadingLogo';
import { useAppSelector } from '@/hooks';

const LoadingLogo = () => {
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div
          className="flex justify-center items-center h-screen w-screen"
          style={{
            backgroundColor: themeColorSet.colorBg2
          }}>
          <FontAwesomeIcon
            className="iconLogo text-3xl"
            icon={faSnowflake}
            style={{ color: themeColorSet.colorText1 }}
          />
          <Title
            level={1}
            disabled
            className="title ml-2"
            style={{
              color: themeColorSet.colorText1,
              marginBottom: 0,
              cursor: 'default'
            }}>
            DevHub
          </Title>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default LoadingLogo;
