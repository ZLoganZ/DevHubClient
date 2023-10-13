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
  useAppSelector((state) => state.theme.change);

  const dispatch = useAppDispatch();
  const [addLinkArr, setAddLinkArr] = useState([...Props.contacts]);
  const [addTooltips, setAddTooltips] = useState([...Props.contacts]);
  const [save, setSave] = useState(false);

  const contactArray = [...contactArrays];
  const { themeColorSet } = getTheme();

  const handleSubmit = () => {
    Props.callback(addLinkArr);
  };

  const handleDropClick = (e: any, index: number) => {
    const selectedLabel = contactArray[parseInt(e.key)].label;
    const newAddTooltips = [...addTooltips];
    const newAddLinkArr = [...addLinkArr];

    newAddTooltips[index].tooltip = selectedLabel;
    newAddTooltips[index].key = e.key;
    newAddLinkArr[index].key = e.key;
    newAddLinkArr[index].tooltip = selectedLabel;

    setAddTooltips(newAddTooltips);
    setAddLinkArr(newAddLinkArr);
  };

  const handleDelete = (index: number) => {
    const newAddLinkArr = [...addLinkArr];
    const newAddTooltips = [...addTooltips];

    newAddLinkArr.splice(index, 1);
    newAddTooltips.splice(index, 1);

    setAddLinkArr(newAddLinkArr);
    setAddTooltips(newAddTooltips);
  };

  const handleEnterLink = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAddLinkArr = [...addLinkArr];

    if (isValidLink(e.target.value)) {
      newAddLinkArr[index].link = e.target.value;
      setAddLinkArr(newAddLinkArr);
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
    const newAddLinkArr = addLinkArr.filter(
      (item) => isValidLink(item.link) && handleAddLink(item.link, item.key)
    );
    setAddLinkArr(newAddLinkArr);
  };

  const handleClickAdd = () => {
    const newAddLinkArr = [...addLinkArr];
    const newAddTooltips = [...addTooltips];

    newAddLinkArr.push({
      link: '',
      key: '0',
      tooltip: 'Facebook'
    });
    newAddTooltips.push({
      tooltip: 'Facebook',
      state: false,
      key: '0',
      link: ''
    });

    setAddLinkArr(newAddLinkArr);
    setAddTooltips(newAddTooltips);
  };

  const handleShowTooltip = (index: number) => {
    const newAddTooltips = [...addTooltips];
    newAddTooltips[index].state = !newAddTooltips[index].state;
    setAddTooltips(newAddTooltips);
  };

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
        <div className='flex flex-col mt-7'>
          {addLinkArr.map((item, index) => (
            <div key={index} className='flex flex-row items-center mb-4'>
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
                    className='flex items-center'
                    style={{
                      color: themeColorSet.colorText1
                    }}>
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      className='item'
                      icon={contactArray[parseInt(item.key)].icon}
                      size={'small'}
                    />
                    <DownOutlined style={{ fontSize: '0.8rem' }} />
                  </Button>
                </a>
              </Dropdown>
              <span className='ml-2 mr-2'>:</span>
              <Input
                key={index + '1'}
                className='w-full pl-2 inputlink'
                placeholder={contactArray[parseInt(item.key)].linkDefault}
                defaultValue={addLinkArr[index]?.link}
                inputMode='url'
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
                className={`w-full ml-2 pl-2 inputlink ${addTooltips[index].state ? '' : 'hidden'}`}
                inputMode='text'
                value={addTooltips[index]?.tooltip}
                onChange={(e) => {
                  const newAddTooltips = [...addTooltips];
                  newAddTooltips[index].tooltip = e.target.value;
                  setAddTooltips(newAddTooltips);

                  const newAddLinkArr = [...addLinkArr];
                  newAddLinkArr[index].tooltip = newAddTooltips[index].tooltip;
                  setAddLinkArr(newAddLinkArr);
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

              {/* <Button
                className='icon-edit-tooltip ml-3'
                shape='circle'
                style={{
                  border: 'none',
                  backgroundColor: themeColorSet.colorBg3
                }}
                onClick={() => {
                  handleShowTooltip(index);
                }}
                size='small'>
                <FontAwesomeIcon icon={faInfo} style={{ color: commonColor.colorBlue2, fontSize: '1rem' }} />
              </Button> */}

              <Button
                className='icon-trash'
                style={{ border: 'none' }}
                onClick={() => {
                  handleDelete(index);
                }}>
                <FontAwesomeIcon icon={faTrashCan} size='lg' />
              </Button>
            </div>
          ))}
          <Button className='my-3' onClick={handleClickAdd}>
            <FontAwesomeIcon icon={faPlus} className='mr-2' />
            Add
          </Button>
          <div className='mt-3'>
            <ButtonActiveHover
              onClick={() => {
                handleClickSubmit();
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
