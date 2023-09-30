import { Space, Tag, Avatar, Upload, Image, message } from 'antd';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  faFacebookF,
  faTwitter,
  faGithub,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import ReactQuill, { Value } from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { RcFile } from 'antd/es/upload';
import { sha1 } from 'crypto-hash';
import 'react-quill/dist/quill.bubble.css';

import QuillEdit from '@/components/QuillEdit';
import descArray from '@/util/Descriptions/Tags';
import AddExperienceForm from '@/components/Form/ExperienceForm/AddExperienceForm';
import EditExperienceForm from '@/components/Form/ExperienceForm/EditExperienceForm';
import RenderRepositoryIem from '@/components/ActionComponent/RenderRepositoryIem';
import AddRepositoryForm from '@/components/Form/AddRepositoryForm';
import { ButtonActiveHover } from '@/components/MiniComponent';
import AddTags from '@/components/AddTags';
import AddContacts from '@/components/AddContacts';
import { openModal } from '@/redux/Slice/ModalHOCSlice';
import { callBackSubmitDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useUpdateUser } from '@/hooks/mutation';
import { useUserInfo } from '@/hooks/fetch';
import { ContactType, ExperienceType } from '@/types';
import StyleProvider from './cssEditProfileForm';

const EditProfileForm = () => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateUpdateUser } = useUpdateUser();

  const [messageApi, contextHolder] = message.useMessage();

  const { userInfo } = useUserInfo();

  const [tags, setTags] = useState(userInfo?.tags);

  const [contacts, setLinks] = useState(userInfo.contacts || []);

  // const [firstname, setFirstName] = useState(userInfo.firstname);

  const [name, setName] = useState(userInfo.name);

  const [alias, setAlias] = useState(userInfo.alias || '');

  const [location, setLocation] = useState(userInfo.location || '');

  const [avatar, setAvatar] = useState(userInfo.user_image || '/images/TimeLinePage/avatar.jpg');
  const [fileAvatar, setFileAvatar] = useState(null);

  const [cover, setCover] = useState(userInfo.cover_image || '/images/ProfilePage/cover.jpg');
  const [fileCover, setFileCover] = useState(null);

  const [about, setAbout] = useState(userInfo.about || '');

  const [experiences, setExperiences] = useState(userInfo?.experiences || []);

  const [repositories, setRepositories] = useState(userInfo?.repositories || []);

  const initialAvatar = useMemo(() => {
    return userInfo.user_image || null;
  }, [userInfo.user_image]);

  const initialCover = useMemo(() => {
    return userInfo.cover_image || null;
  }, [userInfo.cover_image]);

  const handleChangeAvatar = useCallback((image: any) => {
    setAvatar(URL.createObjectURL(image));
    setFileAvatar(image);
  }, []);

  const handleChangeCover = useCallback((image: any) => {
    setCover(URL.createObjectURL(image));
    setFileCover(image);
  }, []);

  const handleUploadImage = async (file: RcFile) => {
    if (!file)
      return {
        url: null,
        status: 'done'
      };

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/upload?upload_preset=mysoslzj', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return {
      url: data.secure_url,
      status: 'done'
    };
  };

  const handleRemoveImage = async (imageURL: string) => {
    const nameSplit = imageURL.split('/');
    const duplicateName = nameSplit.pop();

    // Remove .
    const public_id = duplicateName?.split('.').slice(0, -1).join('.');

    const formData = new FormData();
    formData.append('api_key', '235531261932754');
    formData.append('public_id', public_id!);
    const timestamp = String(Date.now());
    formData.append('timestamp', timestamp);
    const signature = await sha1(`public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`);
    formData.append('signature', signature);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return {
      url: data,
      status: 'done'
    };
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  // const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFirstName(e.target.value);
  // };

  const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeTags = (tags: string[]) => {
    setTags(tags);
  };

  const handleChangeLinks = (contacts: ContactType[]) => {
    setLinks(contacts);
  };

  const handleChangeAlias = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(e.target.value);
  };

  const handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleChangeAbout = (value: string) => {
    setAbout(value);
  };

  const onSubmit = async () => {
    dispatch(setLoading(true));
    const formData = new FormData();
    if (fileAvatar) {
      const res = await handleUploadImage(fileAvatar);
      formData.append('userImage', res.url);
      if (initialAvatar) await handleRemoveImage(initialAvatar);
    }
    if (fileCover) {
      const res = await handleUploadImage(fileCover);
      formData.append('coverImage', res.url);
      if (initialCover) await handleRemoveImage(initialCover);
    }

    mutateUpdateUser({
      name: name /* + ' ' + firstname */,
      alias,
      location,
      user_image: fileAvatar || formData.get('userImage')?.toString(),
      cover_image: fileCover || formData.get('coverImage')?.toString(),
      tags,
      contacts: contacts,
      about,
      experiences,
      repositories
    });
  };

  useEffect(() => {
    dispatch(callBackSubmitDrawer(onSubmit));
  }, [
    tags,
    // firstname,
    name,
    contacts,
    fileAvatar,
    fileCover,
    alias,
    location,
    about,
    experiences,
    repositories
  ]);

  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  const componentNoInfo = (
    title: string,
    description: string,
    buttonContent: string,
    callBackFunction: React.MouseEventHandler
  ) => {
    return (
      <div className='componentNoInfo text-center px-16'>
        <div
          className='title mb-3'
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: themeColorSet.colorText1
          }}>
          {title}
        </div>
        <div className='tags' style={{ color: themeColorSet.colorText3 }}>
          {description}
        </div>
        <div className='mt-4'>
          <ButtonActiveHover onClick={callBackFunction}> {buttonContent}</ButtonActiveHover>
        </div>
      </div>
    );
  };

  const RenderExperience = (item: ExperienceType, index: number) => {
    return (
      <div className='item mt-2 flex' key={index}>
        <div style={{ color: themeColorSet.colorText1 }}>
          <FontAwesomeIcon
            className='icon mr-2'
            icon={faBriefcase}
            style={{ color: commonColor.colorBlue1 }}
          />
          <span className='company mr-2 font-semibold'>{item.company_name}</span>
          <span className='position mr-2'>{item.position_name} |</span>
          <span className='date'>
            {item.start_date} ~ {item.end_date}
          </span>
        </div>
        <div className='ml-2'>
          <span
            onClick={() => {
              dispatch(
                openModal({
                  title: 'Add Experiences',
                  component: (
                    <EditExperienceForm
                      key={Math.random()}
                      experiences={experiences}
                      setExperiences={setExperiences}
                      itemCurrent={item}
                      indexCurrent={index}
                    />
                  ),
                  footer: true
                })
              );
            }}>
            <FontAwesomeIcon
              icon={faEdit}
              className='ml-2 cursor-pointer'
              size='sm'
              style={{ color: themeColorSet.colorText3 }}
            />
          </span>
          <span
            onClick={() => {
              setExperiences(experiences.filter((_, indexFilter) => indexFilter !== index));
            }}>
            <FontAwesomeIcon
              icon={faTrash}
              className='ml-2 cursor-pointer'
              size='sm'
              style={{ color: themeColorSet.colorText3 }}
            />
          </span>
        </div>
      </div>
    );
  };

  return (
    <StyleProvider theme={themeColorSet}>
      {contextHolder}
      <div className='editProfileForm'>
        <section className='coverSection'>
          <div
            className='mainTitle mb-2'
            style={{
              color: themeColorSet.colorText1,
              fontWeight: 600,
              fontSize: '1rem'
            }}>
            Update Profile Cover Image
          </div>
          <div className='subTitle mb-3' style={{ color: themeColorSet.colorText2 }}>
            Recommended dimensions 1500px x 400px (max. 3MB)
          </div>
          <div className='cover relative flex w-full h-72 mb-8 justify-center items-center bg-black rounded-lg'>
            <Image
              className='coverImage rounded-xl'
              src={cover}
              style={{
                objectFit: 'cover',
                maxHeight: '18rem',
                width: '100%'
              }}
            />
            <Space className='coverButton absolute bottom-8 right-5'>
              <Upload
                className='btnChangeCover px-4 py-2'
                customRequest={() => {}}
                maxCount={1}
                accept='image/png, image/jpeg, image/jpg'
                onChange={(file) => handleChangeCover(file?.file?.originFileObj)}
                showUploadList={false}
                beforeUpload={beforeUpload}>
                <span style={{ color: commonColor.colorWhile1 }}>Change Cover Image</span>
              </Upload>
              <button
                className='btnRemove px-4 py-2'
                style={{
                  backgroundColor: commonColor.colorRed1,
                  fontWeight: 600
                }}>
                <span style={{ color: commonColor.colorWhile1 }}>Remove</span>
              </button>
            </Space>
          </div>
        </section>
        <section className='avatar mt-3 flex items-center'>
          <div className='avatarImage rounded-full overflow-hidden flex'>
            <Image
              src={avatar}
              alt='avatar'
              style={{
                width: '7rem',
                height: '7rem',
                objectFit: 'cover'
              }}
            />
          </div>
          <Space className='changeAvatar ml-3' direction='vertical'>
            <div
              className='mb-2'
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: themeColorSet.colorText1
              }}>
              Set profile photo
            </div>
            <Upload
              accept='image/png, image/jpeg, image/jpg'
              customRequest={() => {}}
              maxCount={1}
              onChange={(file) => handleChangeAvatar(file?.file?.originFileObj)}
              showUploadList={false}
              className='btnChange px-4 py-2'>
              <span style={{ color: commonColor.colorWhile1 }}>Change Avatar</span>
            </Upload>
          </Space>
        </section>
        <section className='links mt-3 flex items-center'>
          {contacts.map((item, index) => {
            switch (item.key) {
              case '0':
                return (
                  <Avatar
                    key={index}
                    style={{ color: themeColorSet.colorText1 }}
                    onClick={() => {
                      openInNewTab(item.link);
                    }}
                    className='item'
                    icon={<FontAwesomeIcon icon={faFacebookF} />}
                  />
                );
              case '1':
                return (
                  <Avatar
                    key={index}
                    style={{ color: themeColorSet.colorText1 }}
                    onClick={() => {
                      openInNewTab(item.link);
                    }}
                    className='item'
                    icon={<FontAwesomeIcon icon={faGithub} />}
                  />
                );
              case '2':
                return (
                  <Avatar
                    key={index}
                    style={{ color: themeColorSet.colorText1 }}
                    onClick={() => {
                      openInNewTab(item.link);
                    }}
                    className='item'
                    icon={<FontAwesomeIcon icon={faTwitter} />}
                  />
                );
              case '3':
                return (
                  <Avatar
                    key={index}
                    style={{ color: themeColorSet.colorText1 }}
                    onClick={() => {
                      openInNewTab(item.link);
                    }}
                    className='item'
                    icon={<FontAwesomeIcon icon={faInstagram} />}
                  />
                );
              case '4':
                return (
                  <Avatar
                    style={{ color: themeColorSet.colorText1 }}
                    onClick={() => {
                      openInNewTab(item.link);
                    }}
                    className='item'
                    icon={<FontAwesomeIcon icon={faLinkedin} />}
                  />
                );
              default:
                return null;
            }
          })}
          <button
            className='addLinks px-4 py-1 cursor-pointer'
            onClick={() => {
              dispatch(
                openModal({
                  title: 'Update Social Links',
                  component: (
                    <AddContacts key={Math.random()} callback={handleChangeLinks} contacts={contacts} />
                  ),
                  footer: false
                })
              );
            }}
            style={{
              color: themeColorSet.colorText3,
              border: '1px solid',
              borderColor: themeColorSet.colorBg4
            }}>
            <FontAwesomeIcon icon={faPlus} className='mr-2' />
            {contacts.length === 0 ? 'Add Contacts' : 'Edit Contacts'}
          </button>
        </section>
        <section className='inputInformation mt-5'>
          <div
            className='title mb-2'
            style={{
              color: themeColorSet.colorText1,
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>
            Information
          </div>
          <div className='line1 flex justify-between items-center mb-5'>
            <div className='LastName form__group field' style={{ width: '48%' }}>
              <input
                defaultValue={userInfo.name}
                pattern='[A-Za-z ]*'
                type='input'
                className='form__field'
                placeholder='User Name'
                name='name'
                id='name'
                required
                onChange={handleChangeLastName}
                autoComplete='off'
              />
              <label htmlFor='name' className='form__label'>
                Username
              </label>
            </div>
            {/* <div
                className="firstName form__group field"
                style={{ width: '48%' }}>
                <input
                  defaultValue={userInfo.firstname}
                  pattern="[A-Za-z ]*"
                  type="input"
                  className="form__field"
                  placeholder="First Name"
                  name="firstname"
                  id="firstname"
                  required
                  onChange={handleChangeFirstName}
                  autoComplete="off"
                />
                <label htmlFor="firstname" className="form__label">
                  First Name
                </label>
              </div> */}
          </div>
          <div className='line2 flex justify-between items-center'>
            <div className='alias form__group field' style={{ width: '48%' }}>
              <input
                defaultValue={userInfo.alias}
                type='input'
                className='form__field'
                placeholder='ex: johndoe'
                name='alias'
                id='alias'
                required
                onChange={handleChangeAlias}
                autoComplete='off'
              />
              <label htmlFor='alias' className='form__label'>
                Alias
              </label>
            </div>
            <div className='location form__group field' style={{ width: '48%' }}>
              <input
                defaultValue={userInfo.location}
                pattern='[A-Za-z ]*'
                type='input'
                className='form__field'
                placeholder='ex: Viet Nam'
                name='location'
                id='location'
                required
                onChange={handleChangeLocation}
                autoComplete='off'
              />
              <label htmlFor='location' className='form__label'>
                Location
              </label>
            </div>
          </div>
          <div className='line2'></div>
        </section>
        <section className='expertise mt-7'>
          <div
            className='title mb-2'
            style={{
              color: themeColorSet.colorText1,
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>
            Expertise
          </div>
          <div className='tags flex flex-wrap items-center'>
            {descArray.map((item, index) => {
              if (tags.indexOf(item.title) !== -1) {
                return (
                  <Tag
                    className='item mx-2 my-2 px-4 py-1'
                    key={index}
                    color={themeColorSet.colorBg1}
                    style={{
                      border: 'none',
                      color: themeColorSet.colorText1
                    }}>
                    {item.svg} &nbsp;
                    {item.title}
                  </Tag>
                );
              }
              return null;
            })}
            <button
              className='addTags px-4 py-1 cursor-pointer'
              style={{
                border: '1px solid',
                borderColor: themeColorSet.colorBg4
              }}
              onClick={() => {
                dispatch(
                  openModal({
                    title: 'Add Tags',
                    component: <AddTags key={Math.random()} callback={handleChangeTags} tags={tags} />,
                    footer: true
                  })
                );
              }}>
              <FontAwesomeIcon icon={faPlus} className='mr-2' />
              {tags.length === 0 ? 'Add Tags' : 'Edit Tags'}
            </button>
          </div>
        </section>
        <section className='about mt-7'>
          <div
            className='title mb-2'
            style={{
              color: themeColorSet.colorText1,
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>
            About
            {about && (
              // Nút Edit About
              <span
                onClick={() => {
                  dispatch(
                    openModal({
                      title: 'Add About',
                      component: (
                        <QuillEdit
                          key={Math.random()}
                          placeholder='Write something about yourself...'
                          content={about as string}
                          callbackFunction={handleChangeAbout}
                        />
                      ),
                      footer: true
                    })
                  );
                }}>
                <FontAwesomeIcon
                  icon={faEdit}
                  className='ml-2 cursor-pointer'
                  size='xs'
                  style={{ color: themeColorSet.colorText3 }}
                />
              </span>
            )}
          </div>
          {about ? (
            // About có nội dung
            <div className='content__text'>
              <ReactQuill value={about as Value} readOnly={true} theme='bubble' />
            </div>
          ) : (
            // About không có nội dung
            componentNoInfo(
              'Share something about yourself',
              'Use Markdown to share more about who you are with the developer community on Showwcase.',
              'Add About',
              () => {
                dispatch(
                  openModal({
                    title: 'Add About',
                    component: (
                      <QuillEdit
                        key={Math.random()}
                        placeholder='Write something about yourself...'
                        content=''
                        callbackFunction={handleChangeAbout}
                      />
                    ),
                    footer: true
                  })
                );
              }
            )
          )}
        </section>
        <section className='experiences mt-7'>
          <div
            className='title mb-2'
            style={{
              color: themeColorSet.colorText1,
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>
            Experiences
            {/* Hiển thị nút thêm nếu như có từ 1 experience trở lên */}
            {experiences.length > 0 && (
              <span
                onClick={() => {
                  dispatch(
                    openModal({
                      title: 'Add About',
                      component: (
                        <AddExperienceForm
                          key={Math.random()}
                          experiences={experiences}
                          setExperiences={setExperiences}
                        />
                      ),
                      footer: true
                    })
                  );
                }}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className='ml-2 cursor-pointer buttonAddExperience'
                  size='xs'
                />
              </span>
            )}
          </div>
          {experiences.length === 0 ? (
            // Nếu không có experience nào
            componentNoInfo(
              'Share a timeline of your Positions',
              'Add your professional history so others know you’ve put your skills to good use.',
              'Add Positions',
              () => {
                dispatch(
                  openModal({
                    title: 'Add Experiences',
                    component: (
                      <AddExperienceForm
                        key={Math.random()}
                        experiences={experiences}
                        setExperiences={setExperiences}
                      />
                    ),
                    footer: true
                  })
                );
              }
            )
          ) : (
            // Nếu có experience
            <div className='mt-5 ml-3'>
              {experiences.map((item, index) => {
                return RenderExperience(item, index);
              })}
            </div>
          )}
        </section>
        {/* <section className="techStack mt-7">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              Tech Stack
            </div>
            {componentNoInfo(
              'Add your familiar Skills',
              'Showcase your familiar skills and technologies and label them by years of experience so others know what you like working with.',
              'Add Tech Stack',
              () => {},
            )}
          </section> */}
        <section className='repositories mt-7'>
          <div
            className='title mb-2'
            style={{
              color: themeColorSet.colorText1,
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>
            Repositories
            {
              // Nút Edit Repositories
              repositories.length !== 0 && (
                <span
                  onClick={() => {
                    dispatch(
                      openModal({
                        title: 'Feature Repositories',
                        component: (
                          <AddRepositoryForm
                            key={Math.random()}
                            repositories={repositories}
                            setRepositories={setRepositories}
                          />
                        ),
                        footer: true
                      })
                    );
                  }}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className='ml-2 cursor-pointer'
                    size='xs'
                    style={{ color: themeColorSet.colorText3 }}
                  />
                </span>
              )
            }
          </div>
          {/* Nếu không có repository nào */}
          {repositories.length === 0 ? (
            componentNoInfo(
              'Highlight your top Repositories',
              'Showwcase integrates with Github to help you pull your top repositories right into your profile. If you’ve got something to show, get it in!',
              'Feature Repositories',
              () => {
                dispatch(
                  openModal({
                    title: 'Feature Repositories',
                    component: (
                      <AddRepositoryForm
                        key={Math.random()}
                        repositories={repositories}
                        setRepositories={setRepositories}
                      />
                    ),
                    footer: true
                  })
                );
              }
            )
          ) : (
            // Nếu có repository
            <div className='flex flex-wrap justify-between mt-5'>
              {repositories.map((item, index) => {
                return RenderRepositoryIem(item, index);
              })}
            </div>
          )}
        </section>
        {/* <section className="memberOf mt-7">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              Member of
            </div>
            {componentNoInfo(
              'You currently have no featured Communities',
              'Showcase your featured communities to be highlighted on your profile',
              'Feature Communities',
              () => {},
            )}
          </section> */}
      </div>
    </StyleProvider>
  );
};

export default EditProfileForm;
