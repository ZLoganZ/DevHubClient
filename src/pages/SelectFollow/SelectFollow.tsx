import { ConfigProvider } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { commonColor } from "@/utils/cssVariable";
import { getTheme } from "@/utils/functions/ThemeFunction";
import StyleTotal from "./cssSelectFollow";
import { GET_SHOULD_FOLLOWERS_SAGA } from "@/redux/actionSaga/GetStartedActionSaga";
import RenderPeopleItem from "./RenderPeopleItem";
import { ButtonActiveHover } from "@/components/MiniComponent";

const SelectFollow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // Lấy danh sách người theo dõi
  useEffect(() => {
    dispatch(GET_SHOULD_FOLLOWERS_SAGA());
  }, []);

  const peopleArray = useSelector(
    (state: any) => state.getStartedReducer.arrayShouldFollowers
  );

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <StyleTotal theme={themeColorSet}>
        <div className="flex justify-center w-full h-full selectInterest">
          <div className="content w-1/2 pt-10 h-full relative">
            <div>
              <span
                className="mr-3"
                style={{ color: themeColorSet.colorText2 }}>
                Step 05:
              </span>
              <span style={{ color: themeColorSet.colorText3 }}>
                Follow people
              </span>
            </div>
            <div className="slide w-full flex justify-between mt-2">
              <span
                style={{
                  width: "19.4%",
                  height: "2px",
                  backgroundColor: commonColor.colorGreen1,
                  display: "inline-block",
                }}></span>
              <span
                style={{
                  width: "19.4%",
                  height: "2px",
                  backgroundColor: commonColor.colorGreen1,
                  display: "inline-block",
                }}></span>
              <span
                style={{
                  width: "19.4%",
                  height: "2px",
                  backgroundColor: commonColor.colorGreen1,
                  display: "inline-block",
                }}></span>
              <span
                style={{
                  width: "19.4%",
                  height: "2px",
                  backgroundColor: commonColor.colorGreen1,
                  display: "inline-block",
                }}></span>
              <span
                style={{
                  width: "19.4%",
                  height: "2px",
                  backgroundColor: commonColor.colorBlue1,
                  display: "inline-block",
                }}></span>
            </div>
            <div
              className="textMax mt-4"
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                color: themeColorSet.colorText1,
              }}>
              Here are some people with similar interests
            </div>
            <div className="people mt-10">
              {peopleArray.map((item: any, index: any) => (
                <RenderPeopleItem item={item} key={index} />
              ))}
            </div>
            <div className="button mt-16 mb-10 text-right">
              <NavLink to="/">
                <ButtonActiveHover rounded>Done</ButtonActiveHover>
              </NavLink>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default SelectFollow;
