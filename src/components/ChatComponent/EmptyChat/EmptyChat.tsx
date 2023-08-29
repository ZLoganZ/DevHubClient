import { useSelector } from "react-redux";
import { getTheme } from "@/utils/functions/ThemeFunction";

const EmptyChat = () => {
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();
  return (
    <div
      className={`px-4 py-10 sm:px-6 lg:px-8 lg:py-6 h-full flex justify-center items-center`}
      style={{
        backgroundColor: themeColorSet.colorBg1,
      }}>
      <div className="text-center items-center flex flex-col">
        <h3
          className={`mt-2 text-2xl font-semibold`}
          style={{
            color: themeColorSet.colorText1,
          }}>
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyChat;
