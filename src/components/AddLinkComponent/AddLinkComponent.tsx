import React, { useEffect, useState } from "react";
import contactArrays from "@/components/GlobalSetting/ItemComponent/Contact";
import { ConfigProvider, Dropdown, Button, Input, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "@/utils/functions/ThemeFunction";
import StyleTotal from "./cssAddLinkComponent";
import { closeModal } from "@/redux/Slice/ModalHOCSlice";
import { DownOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus, faInfo } from "@fortawesome/free-solid-svg-icons";
import { commonColor } from "@/utils/cssVariable";
import { ButtonActiveHover } from "../MiniComponent";

const AddLinkComponent = (Props: any) => {
  const dispatch = useDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const contactArray = [...contactArrays];

  //add links
  const [addLinkArr, setAddLinkArr] = useState([...Props.links]);

  let addLinkArrTemp = addLinkArr.map((obj) => ({ ...obj }));

  //add tooltips
  const [addTooltips, setAddTooltips] = useState([...Props.links]);

  let addTooltipsTemp = addTooltips.map((obj) => ({ ...obj }));

  //save
  const [save, setSave] = useState<boolean>(false);

  const handleSubmit = () => {
    Props.callback(addLinkArr);
  };
  const handleDropClick = (e: any, index: any) => {
    if (
      addTooltipsTemp[index].tooltip ===
      contactArray[parseInt(addTooltipsTemp[index].key)].label
    ) {
      switch (e.key) {
        case "0":
          addTooltipsTemp[index].tooltip = contactArray[0].label;
          break;
        case "1":
          addTooltipsTemp[index].tooltip = contactArray[1].label;
          break;
        case "2":
          addTooltipsTemp[index].tooltip = contactArray[2].label;
          break;
        case "3":
          addTooltipsTemp[index].tooltip = contactArray[3].label;
          break;
        case "4":
          addTooltipsTemp[index].tooltip = contactArray[4].label;
          break;
      }
    }

    addTooltipsTemp[index].key = e.key;
    addLinkArrTemp[index].key = addTooltipsTemp[index].key;
    addLinkArrTemp[index].tooltip = addTooltipsTemp[index].tooltip;

    // if (handleAddLink(addLinkArrTemp[index].link, e.key)) {
    setAddLinkArr(addLinkArrTemp);
    setAddTooltips(addTooltipsTemp);
    // } else {
    // addLinkArrTemp[index].link = '';
    // setAddLinkArr(addLinkArrTemp);
    // }
  };

  const handleDelete = (index: any) => {
    addLinkArrTemp.splice(index, 1);
    setAddLinkArr(addLinkArrTemp);

    addTooltipsTemp.splice(index, 1);
    setAddTooltips(addTooltipsTemp);
  };

  const handleEnterLink = (e: any, index: any, key: any) => {
    if (isValidLink(e.target.value)) {
      addLinkArrTemp[index].link = e.target.value;
      // addLinkArrTemp[index].tooltip = addTooltipsTemp[index].tooltip;

      // if (handleAddLink(addLinkArrTemp[index].link, key)) {
      setAddLinkArr(addLinkArrTemp);
      // }
    }
  };

  const isValidLink = (link: string): boolean => {
    try {
      new URL(link);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAddLink = (link: any, key: any) => {
    if (!link) return false;
    if (
      link.startsWith(contactArray[parseInt(key)].linkDefault) &&
      link.length > contactArray[parseInt(key)].linkDefault.length
    ) {
      return true;
    }
    return false;
  };

  const handleClickSubmit = () => {
    addLinkArrTemp = addLinkArrTemp.filter(
      (item: any) =>
        isValidLink(item.link) && handleAddLink(item.link, item.key)
    );
  };

  function handleShowTooltip(index: any) {
    addTooltipsTemp[index].state = !addTooltipsTemp[index].state;
    setAddTooltips(addTooltipsTemp);
  }

  useEffect(() => {
    setSave(false);
    handleSubmit();
  }, [save]);

  return (
    <ConfigProvider
      theme={{
        token: {
          ...themeColor,
          colorBorder: themeColorSet.colorBg4,
          controlHeight: 40,
        },
      }}>
      <StyleTotal theme={themeColorSet}>
        <div className="flex flex-col mt-7">
          {addLinkArrTemp.map((item: any, index: any) => (
            <div className="flex flex-row items-center mb-4">
              <Dropdown
                menu={{
                  items: contactArray,
                  onClick: (e) => {
                    handleDropClick(e, index);
                  },
                }}
                trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Button
                    className="flex items-center"
                    style={{
                      color: themeColorSet.colorText1,
                    }}>
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      className="item"
                      icon={contactArray[parseInt(item.key)].icon}
                      size={"small"}
                    />
                    <DownOutlined style={{ fontSize: "0.8rem" }} />
                  </Button>
                </a>
              </Dropdown>
              <Input
                key={index}
                className="w-full ml-2 pl-2 inputlink"
                placeholder={contactArray[parseInt(item.key)].linkDefault}
                defaultValue={addLinkArr[index]?.link}
                inputMode="url"
                onChange={(e) => {
                  handleEnterLink(e, index, item.key);
                }}
                style={{
                  height: 38,
                  backgroundColor: themeColorSet.colorBg2,
                  border: "1px solid",
                  borderColor: themeColorSet.colorBg4,
                  color: themeColorSet.colorText1,
                  borderRadius: 8,
                }}
              />
              <Input
                key={index}
                className={
                  addTooltips[index].state
                    ? "w-full ml-2 pl-2 inputlink"
                    : "w-full ml-2 pl-2 inputlink hidden"
                }
                inputMode="text"
                value={addTooltips[index]?.tooltip}
                onChange={(e) => {
                  addTooltipsTemp[index].tooltip = e.target.value;
                  setAddTooltips(addTooltipsTemp);

                  addLinkArrTemp[index].tooltip =
                    addTooltipsTemp[index].tooltip;
                  setAddLinkArr(addLinkArrTemp);
                }}
                style={{
                  height: 38,
                  backgroundColor: themeColorSet.colorBg2,
                  border: "1px solid",
                  borderColor: themeColorSet.colorBg4,
                  color: themeColorSet.colorText1,
                  borderRadius: 8,
                }}
              />

              <Button
                className="icon-edit-tooltip ml-3"
                shape="circle"
                style={{
                  border: "none",
                  backgroundColor: themeColorSet.colorBg3,
                }}
                onClick={() => {
                  handleShowTooltip(index);
                }}
                size="small">
                <FontAwesomeIcon
                  icon={faInfo}
                  style={{ color: commonColor.colorBlue2, fontSize: "1rem" }}
                />
              </Button>

              <Button
                className="icon-trash"
                style={{ border: "none" }}
                onClick={() => {
                  handleDelete(index);
                }}>
                <FontAwesomeIcon icon={faTrashCan} size="lg" />
              </Button>
            </div>
          ))}
          <Button
            className="my-3"
            onClick={() => {
              setAddLinkArr([
                ...addLinkArr,
                { key: "0", tooltip: "Facebook", link: "" },
              ]);
              addLinkArrTemp = [
                ...addLinkArr,
                { key: "0", tooltip: "Facebook", link: "" },
              ];

              setAddTooltips([
                ...addTooltips,
                { key: "0", tooltip: "Facebook", state: false },
              ]);
              addTooltipsTemp = [
                ...addTooltips,
                { key: "0", tooltip: "Facebook", state: false },
              ];
            }}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add
          </Button>
          <div className="mt-3">
            <ButtonActiveHover
              onClick={() => {
                handleClickSubmit();
                setAddLinkArr(addLinkArrTemp);
                dispatch(closeModal(setSave(true)));
              }}
              block>
              UPDATE
            </ButtonActiveHover>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default AddLinkComponent;
