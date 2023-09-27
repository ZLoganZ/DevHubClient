import Title from 'antd/es/typography/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';

import { getTheme } from '@/util/theme';
import StyleProvider from './cssLoadingLogo';
import { useAppSelector } from '@/hooks/special';

const LoadingLogo = () => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
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
    </StyleProvider>
  );
};

export default LoadingLogo;
