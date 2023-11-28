import { Space, Tag, Avatar, Upload, Image, message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import {
  faFacebookF,
  faTwitter,
  faGithub,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faBriefcase, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.bubble.css';

import QuillEdit from '@/components/QuillEdit';
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
import descArray from '@/util/Descriptions/Tags';
import { commonColor } from '@/util/cssVariable';
import getImageURL from '@/util/getImageURL';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useUpdateUser } from '@/hooks/mutation';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { IContact, IExperience } from '@/types';
import { imageService } from '@/services/ImageService';
import StyleProvider from './cssEditProfileForm';

const EditProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { mutateUpdateUser } = useUpdateUser();

  const [messageApi, contextHolder] = message.useMessage();

  const { currentUserInfo } = useCurrentUserInfo();

  const [tags, setTags] = useState(currentUserInfo?.tags);

  const [contacts, setLinks] = useState(currentUserInfo.contacts ?? []);

  const [name, setName] = useState(currentUserInfo.name);

  const [alias, setAlias] = useState(currentUserInfo.alias ?? '');

  const [location, setLocation] = useState(currentUserInfo.location ?? '');

  const [avatar, setAvatar] = useState(getImageURL(currentUserInfo.user_image, 'avatar'));
  const [fileAvatar, setFileAvatar] = useState<File>();

  const [cover, setCover] = useState(
    getImageURL(currentUserInfo.cover_image) ?? '/images/ProfilePage/cover.jpg'
  );
  const [fileCover, setFileCover] = useState<File>();

  const [about, setAbout] = useState(currentUserInfo.about ?? '');

  const [experiences, setExperiences] = useState(currentUserInfo?.experiences ?? []);

  const [repositories, setRepositories] = useState(currentUserInfo?.repositories ?? []);

  const icons: Record<string, IconDefinition> = {
    '0': faFacebookF,
    '1': faGithub,
    '2': faTwitter,
    '3': faInstagram,
    '4': faLinkedin
  };

  const handleChangeAvatar = useCallback((image: File) => {
    setAvatar(URL.createObjectURL(image));
    setFileAvatar(image);
  }, []);

  const handleChangeCover = useCallback((image: File) => {
    setCover(URL.createObjectURL(image));
    setFileCover(image);
  }, []);

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await imageService.uploadImage(formData);
    return {
      url: data.metadata,
      status: 'done'
    };
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeTags = (tags: string[]) => {
    setTags(tags);
  };

  const handleChangeLinks = (contacts: IContact[]) => {
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
      formData.append('userImage', res.url.key);
      // if (initialAvatar) await handleRemoveImage(initialAvatar);
    }
    if (fileCover) {
      const res = await handleUploadImage(fileCover);
      formData.append('coverImage', res.url.key);
      // if (initialCover) await handleRemoveImage(initialCover);
    }

    mutateUpdateUser({
      name: name,
      alias,
      location,
      user_image: formData.get('userImage')?.toString(),
      cover_image: formData.get('coverImage')?.toString(),
      tags,
      contacts: contacts,
      about,
      experiences,
      repositories
    });
  };

  useEffect(() => {
    dispatch(callBackSubmitDrawer(onSubmit));
  }, [tags, name, contacts, fileAvatar, fileCover, alias, location, about, experiences, repositories]);

  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      void messageApi.error('Image must smaller than 3MB!');
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

  const RenderExperience = (item: IExperience, index: number) => {
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
                      key={uuidv4().replace(/-/g, '')}
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
              preview={{ mask: <FontAwesomeIcon icon={faEye} /> }}
              style={{
                objectFit: 'cover',
                maxHeight: '18rem',
                width: '100%'
              }}
            />
            <Space className='coverButton absolute bottom-8 right-5'>
              <Upload
                className='btnChangeCover px-4 py-2'
                customRequest={({ onSuccess }) => {
                  if (onSuccess) onSuccess('ok');
                }}
                maxCount={1}
                accept='image/png, image/jpeg, image/jpg'
                onChange={(file) => handleChangeCover(file.file.originFileObj!)}
                showUploadList={false}
                beforeUpload={beforeUpload}>
                <span style={{ color: commonColor.colorWhite1 }}>Change Cover Image</span>
              </Upload>
              <button
                className='btnRemove px-4 py-2'
                style={{
                  backgroundColor: commonColor.colorRed1,
                  fontWeight: 600
                }}>
                <span style={{ color: commonColor.colorWhite1 }}>Remove</span>
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
              preview={{
                src: getImageURL(currentUserInfo.user_image),
                mask: <FontAwesomeIcon icon={faEye} />
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
              customRequest={({ onSuccess }) => {
                if (onSuccess) onSuccess('ok');
              }}
              maxCount={1}
              onChange={(file) => handleChangeAvatar(file?.file?.originFileObj!)}
              showUploadList={false}
              className='btnChange px-4 py-2'>
              <span style={{ color: commonColor.colorWhite1 }}>Change Avatar</span>
            </Upload>
          </Space>
        </section>
        <section className='links mt-3 flex items-center'>
          {contacts.map((item, index) => {
            const Icon = icons[item.key];
            return Icon ? (
              <Avatar
                key={index}
                style={{ color: themeColorSet.colorText1 }}
                onClick={() => openInNewTab(item.link)}
                className='item'
                icon={<FontAwesomeIcon icon={Icon} />}
              />
            ) : null;
          })}
          <button
            className='addLinks px-3 py-1.5 cursor-pointer'
            onClick={() => {
              dispatch(
                openModal({
                  title: 'Update Social Links',
                  component: (
                    <AddContacts
                      key={uuidv4().replace(/-/g, '')}
                      callback={handleChangeLinks}
                      contacts={contacts}
                    />
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
            <FontAwesomeIcon icon={faPlus} />
            &nbsp;{contacts.length === 0 ? 'Add Contacts' : 'Edit Contacts'}
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
          <div className='line1 flex items-center mb-5'>
            <div className='LastName form__group field' style={{ width: '100%' }}>
              <input
                defaultValue={currentUserInfo.name}
                pattern='[A-Za-z ]*'
                type='input'
                className='form__field'
                placeholder='User Name'
                name='name'
                id='name'
                required
                onChange={handleChangeName}
                autoComplete='off'
              />
              <label htmlFor='name' className='form__label'>
                Username
              </label>
            </div>
          </div>
          <div className='line2 flex justify-between items-center'>
            <div className='alias form__group field' style={{ width: '48%' }}>
              <input
                defaultValue={currentUserInfo.alias}
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
                defaultValue={currentUserInfo.location}
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
              className='addTags px-3 py-1 cursor-pointer'
              style={{
                border: '1px solid',
                borderColor: themeColorSet.colorBg4
              }}
              onClick={() => {
                dispatch(
                  openModal({
                    title: 'Add Tags',
                    component: (
                      <AddTags key={uuidv4().replace(/-/g, '')} callback={handleChangeTags} tags={tags} />
                    ),
                    footer: true
                  })
                );
              }}>
              <FontAwesomeIcon icon={faPlus} />
              &nbsp;{tags.length === 0 ? 'Add Tags' : 'Edit Tags'}
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
                          key={uuidv4().replace(/-/g, '')}
                          placeholder='Write something about yourself...'
                          content={about}
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
              <ReactQuill value={about} readOnly theme='bubble' />
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
                        key={uuidv4().replace(/-/g, '')}
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
            {experiences.length > 0 && (
              <span
                onClick={() => {
                  dispatch(
                    openModal({
                      title: 'Add About',
                      component: (
                        <AddExperienceForm
                          key={uuidv4().replace(/-/g, '')}
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
                        key={uuidv4().replace(/-/g, '')}
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
                            key={uuidv4().replace(/-/g, '')}
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
                        key={uuidv4().replace(/-/g, '')}
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
      </div>
    </StyleProvider>
  );
};

export default EditProfileForm;
