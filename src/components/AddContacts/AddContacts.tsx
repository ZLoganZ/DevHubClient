import { useEffect, useState } from 'react';
import { Dropdown, Button, Input, Avatar, ConfigProvider } from 'antd';
import { faTrashCan, faPlus, faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DownOutlined } from '@ant-design/icons';

import StyleProvider from './cssAddContacts';
import { closeModal } from '@/redux/Slice/ModalHOCSlice';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import contactArrays from '@/util/Descriptions/Contacts';
import { ButtonActiveHover } from '@/components/MiniComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { ContactType } from '@/types';

interface Props {
  contacts: ContactType[];
  callback: (contacts: ContactType[]) => void;
}

const AddContacts = (Props: Props) => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const contactArray = [...contactArrays];

  //add contacts
  const [addLinkArr, setAddLinkArr] = useState([...Props.contacts]);

  let addLinkArrTemp = addLinkArr.map((obj) => ({ ...obj }));

  //add tooltips
  const [addTooltips, setAddTooltips] = useState([...Props.contacts]);

  let addTooltipsTemp = addTooltips.map((obj) => ({ ...obj }));

  //save
  const [save, setSave] = useState(false);

  const handleSubmit = () => {
    Props.callback(addLinkArr);
  };
  const handleDropClick = (e: any, index: number) => {
    if (
      addTooltipsTemp[index].tooltip ===
      contactArray[parseInt(addTooltipsTemp[index].key)].label
    ) {
      switch (e.key) {
        case '0':
          addTooltipsTemp[index].tooltip = contactArray[0].label;
          break;
        case '1':
          addTooltipsTemp[index].tooltip = contactArray[1].label;
          break;
        case '2':
          addTooltipsTemp[index].tooltip = contactArray[2].label;
          break;
        case '3':
          addTooltipsTemp[index].tooltip = contactArray[3].label;
          break;
        case '4':
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

  const handleDelete = (index: number) => {
    addLinkArrTemp.splice(index, 1);
    setAddLinkArr(addLinkArrTemp);

    addTooltipsTemp.splice(index, 1);
    setAddTooltips(addTooltipsTemp);
  };

  const handleEnterLink = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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

  const handleAddLink = (link: string, key: string) => {
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
      (item) => isValidLink(item.link) && handleAddLink(item.link, item.key)
    );
  };

  function handleShowTooltip(index: number) {
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
          colorBorder: themeColorSet.colorBg4,
          controlHeight: 40
        }
      }}>
      <StyleProvider theme={themeColorSet}>
        <div className="flex flex-col mt-7">
          {addLinkArrTemp.map((item, index) => (
            <div key={index} className="flex flex-row items-center mb-4">
              <Dropdown
                menu={{
                  items: contactArray,
                  onClick: (e) => {
                    handleDropClick(e, index);
                  }
                }}
                trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                  <Button
                    className="flex items-center"
                    style={{
                      color: themeColorSet.colorText1
                    }}>
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      className="item"
                      icon={contactArray[parseInt(item.key)].icon}
                      size={'small'}
                    />
                    <DownOutlined style={{ fontSize: '0.8rem' }} />
                  </Button>
                </a>
              </Dropdown>
              <Input
                key={index + '1'}
                className="w-full ml-2 pl-2 inputlink"
                placeholder={contactArray[parseInt(item.key)].linkDefault}
                defaultValue={addLinkArr[index]?.link}
                inputMode="url"
                onChange={(e) => {
                  handleEnterLink(e, index);
                }}
                style={{
                  height: 38,
                  backgroundColor: themeColorSet.colorBg2,
                  border: '1px solid',
                  borderColor: themeColorSet.colorBg4,
                  color: themeColorSet.colorText1,
                  borderRadius: 8
                }}
              />
              <Input
                key={index + '2'}
                className={
                  addTooltips[index].state
                    ? 'w-full ml-2 pl-2 inputlink'
                    : 'w-full ml-2 pl-2 inputlink hidden'
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
                  border: '1px solid',
                  borderColor: themeColorSet.colorBg4,
                  color: themeColorSet.colorText1,
                  borderRadius: 8
                }}
              />

              <Button
                className="icon-edit-tooltip ml-3"
                shape="circle"
                style={{
                  border: 'none',
                  backgroundColor: themeColorSet.colorBg3
                }}
                onClick={() => {
                  handleShowTooltip(index);
                }}
                size="small">
                <FontAwesomeIcon
                  icon={faInfo}
                  style={{ color: commonColor.colorBlue2, fontSize: '1rem' }}
                />
              </Button>

              <Button
                className="icon-trash"
                style={{ border: 'none' }}
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
                { key: '0', tooltip: 'Facebook', link: '' }
              ]);
              addLinkArrTemp = [
                ...addLinkArr,
                { key: '0', tooltip: 'Facebook', link: '' }
              ];

              setAddTooltips([
                ...addTooltips,
                { key: '0', tooltip: 'Facebook', state: false, link: '' }
              ]);
              addTooltipsTemp = [
                ...addTooltips,
                { key: '0', tooltip: 'Facebook', state: false, link: '' }
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
      </StyleProvider>
    </ConfigProvider>
  );
};

export default AddContacts;
