import Title from "antd/es/typography/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "@/components/ThemeProvider";

const LoadingLogo = () => {
  const { getTheme } = useTheme();
  
  const { themeColorSet } = getTheme();

  return (
      <div
        className="flex justify-center items-center h-screen w-screen"
        style={{
          backgroundColor: themeColorSet.colorBg2,
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
            cursor: "default",
          }}>
          DevHub
        </Title>
      </div>
  );
};

export default LoadingLogo;
