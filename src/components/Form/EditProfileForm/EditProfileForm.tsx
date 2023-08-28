import { ConfigProvider, Space, Tag, Avatar, Upload, Image, message } from 'antd';
import React, { useState, useCallback, useMemo } from 'react';
import StyleTotal from './cssEditProfileForm';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../../util/functions/ThemeFunction';
import { faFacebookF, faTwitter, faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { commonColor } from '../../../util/cssVariable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCodeFork, faEdit, faPlus, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { openModal } from '../../../redux/Slice/ModalHOCSlice';
import AddTagComponent from '../../AddTagComponent';
import AddLinkComponent from '../../AddLinkComponent';
import descArray from '../../GlobalSetting/ItemComponent/Description';
import { UPDATE_USER_SAGA } from '../../../redux/actionSaga/UserActionSaga';
import { callBackSubmitDrawer, setLoading } from '../../../redux/Slice/DrawerHOCSlice';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { RcFile } from 'antd/es/upload';
import { sha1 } from 'crypto-hash';
import QuillEdit from '../../QuillEdit/QuillEdit';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill, { Value } from 'react-quill';
import AddExperienceForm from '../ExperienceForm/AddExperienceForm';
import EditExperienceForm from '../ExperienceForm/EditExperienceForm';
import AddRepositoryForm from '../AddRepositoryForm';
import GithubColors from 'github-colors';
import { ButtonActiveHover } from '../../MiniComponent';

const EditProfileForm = () => {
  const dispatch = useDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [messageApi, contextHolder] = message.useMessage();

  const userInfo = useSelector((state: any) => state.postReducer.ownerInfo);

  const [tags, setTags] = useState(userInfo?.tags);

  const [links, setLinks] = useState<any>(userInfo?.contacts || []);

  const [firstname, setFirstName] = useState(userInfo?.firstname);

  const [lastname, setLastName] = useState(userInfo?.lastname);

  const [alias, setAlias] = useState(userInfo?.alias || '');

  const [location, setLocation] = useState(userInfo?.location || '');

  const [avatar, setAvatar] = useState(userInfo?.userImage || '/images/TimeLinePage/avatar.jpg');
  const [fileAvatar, setFileAvatar] = useState<any>(null);

  const [cover, setCover] = useState(userInfo?.coverImage || '/images/ProfilePage/cover.jpg');
  const [fileCover, setFileCover] = useState<any>(null);

  const [about, setAbout] = useState<String>(userInfo?.about || '');

  const [experiences, setExperiences] = useState<any>(userInfo?.experiences || []);

  const [repositories, setRepositories] = useState<any>(userInfo?.repositories || []);

  const initialAvatar = useMemo(() => {
    return userInfo?.userImage || null;
  }, [userInfo?.userImage]);

  const initialCover = useMemo(() => {
    return userInfo?.coverImage || null;
  }, [userInfo?.coverImage]);

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
        status: 'done',
      };

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/upload?upload_preset=mysoslzj', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return {
      url: data.secure_url,
      status: 'done',
    };
  };

  const handleRemoveImage = async (imageURL: any) => {
    const nameSplit = imageURL.split('/');
    const duplicateName = nameSplit.pop();

    // Remove .
    const public_id = duplicateName?.split('.').slice(0, -1).join('.');

    const formData = new FormData();
    formData.append('api_key', '235531261932754');
    formData.append('public_id', public_id);
    const timestamp = String(Date.now());
    formData.append('timestamp', timestamp);
    const signature = await sha1(`public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`);
    formData.append('signature', signature);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return {
      url: data,
      status: 'done',
    };
  };

  const openInNewTab = (url: any) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const handleChangeFirstName = (e: any) => {
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e: any) => {
    setLastName(e.target.value);
  };

  const handleChangeTags = (tags: any) => {
    setTags(tags);
  };

  const handleChangeLinks = (links: any) => {
    setLinks(links);
  };

  const handleChangeAlias = (e: any) => {
    setAlias(e.target.value);
  };

  const handleChangeLocation = (e: any) => {
    setLocation(e.target.value);
  };

  const handleChangeAbout = (value: any) => {
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
    dispatch(
      UPDATE_USER_SAGA({
        id: userInfo?.id,
        userUpdate: {
          lastname,
          firstname,
          username: lastname + ' ' + firstname,
          alias,
          location,
          userImage: fileAvatar ? formData.get('userImage') : undefined,
          coverImage: fileCover ? formData.get('coverImage') : undefined,
          tags,
          contacts: links,
          about,
          experiences,
          repositories,
        },
      }),
    );
  };

  React.useEffect(() => {
    dispatch(callBackSubmitDrawer(onSubmit));
  }, [tags, firstname, lastname, links, fileAvatar, fileCover, alias, location, about, experiences, repositories]);

  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  const componentNoInfo = (
    title: String,
    description: String,
    buttonContent: String,
    callBackFunction: React.MouseEventHandler,
  ) => {
    return (
      <div className="componentNoInfo text-center px-16">
        <div className="title mb-3" style={{ fontSize: '1.1rem', fontWeight: 600, color: themeColorSet.colorText1 }}>
          {title}
        </div>
        <div className="tags" style={{ color: themeColorSet.colorText3 }}>
          {description}
        </div>
        <div className="mt-4">
          <ButtonActiveHover onClick={callBackFunction}> {buttonContent}</ButtonActiveHover>
        </div>
      </div>
    );
  };

  const renderExperience = (item: any, index: any) => {
    return (
      <div className="item mt-2 flex">
        <div style={{ color: themeColorSet.colorText1 }}>
          <FontAwesomeIcon className="icon mr-2" icon={faBriefcase} style={{ color: commonColor.colorBlue1 }} />
          <span className="company mr-2 font-semibold">{item.companyName}</span>
          <span className="position mr-2">{item.positionName} |</span>
          <span className="date">
            {item.startDate} ~ {item.endDate}
          </span>
        </div>
        <div className="ml-2">
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
                  footer: true,
                }),
              );
            }}
          >
            <FontAwesomeIcon
              icon={faEdit}
              className="ml-2 cursor-pointer"
              size="sm"
              style={{ color: themeColorSet.colorText3 }}
            />
          </span>
          <span
            onClick={() => {
              setExperiences(experiences.filter((item: any, indexFilter: any) => indexFilter !== index));
            }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="ml-2 cursor-pointer"
              size="sm"
              style={{ color: themeColorSet.colorText3 }}
            />
          </span>
        </div>
      </div>
    );
  };

  const renderRepositoryIem = (item: any, index: any) => {
    const colorLanguage = GithubColors.get(item.languages)?.color;
    return (
      <a
        className="renderRepositoryIem mb-5"
        style={{
          borderBottom: `1px solid ${themeColorSet.colorBg4}`,
          width: '48%',
        }}
        href={item.url}
        target="_blank"
      >
        <div className="top">
          <span>
            <img className="iconRepos inline" style={{ color: 'red' }} src="/images/Common/repos.svg" />
          </span>
          <span
            className="name ml-2"
            style={{
              color: commonColor.colorBlue3,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {item.name}
          </span>
          <span
            className="rounded-lg ml-3"
            style={{
              color: themeColorSet.colorText3,
              border: `1px solid ${themeColorSet.colorBg4}`,
              fontSize: '0.8rem',
              padding: '0.1rem 0.5rem',
            }}
          >
            {item.private ? 'Private' : 'Public'}
          </span>
        </div>
        <div className="bottom mt-3 flex items-center" style={{ color: themeColorSet.colorText2 }}>
          <div className="language mr-4 flex items-center">
            <span className="mr-2 pb-2 text-4xl" style={{ color: colorLanguage }}>
              •
            </span>
            <span>{item.languages}</span>
          </div>
          <span className="star mr-3" style={{ color: themeColorSet.colorText3 }}>
            <FontAwesomeIcon size="xs" icon={faStar} />
            <span className="ml-1">{item.stargazersCount}</span>
          </span>
          <span className="fork" style={{ color: themeColorSet.colorText3 }}>
            <FontAwesomeIcon size="xs" icon={faCodeFork} />
            <span className="ml-1">{item.forksCount}</span>
          </span>
        </div>
      </a>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}
    >
      <StyleTotal theme={themeColorSet}>
        {contextHolder}
        <div className="editProfileForm">
          <section className="coverSection">
            <div
              className="mainTitle mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              Update Profile Cover Image
            </div>
            <div className="subTitle mb-3" style={{ color: themeColorSet.colorText2 }}>
              Recommended dimensions 1500px x 400px (max. 3MB)
            </div>
            <div className="cover relative flex w-full h-72 mb-8 justify-center items-center bg-black rounded-lg">
              <Image
                className="coverImage rounded-xl"
                src={cover}
                style={{
                  objectFit: 'cover',
                  maxHeight: '18rem',
                  width: '100%',
                }}
              ></Image>
              <Space className="coverButton absolute bottom-8 right-5">
                <Upload
                  className="btnChangeCover px-4 py-2"
                  customRequest={() => {}}
                  maxCount={1}
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(file) => handleChangeCover(file?.file?.originFileObj)}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                >
                  <span style={{ color: commonColor.colorWhile1 }}>Change Cover Image</span>
                </Upload>
                <button
                  className="btnRemove px-4 py-2"
                  style={{
                    backgroundColor: commonColor.colorRed1,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: commonColor.colorWhile1 }}>Remove</span>
                </button>
              </Space>
            </div>
          </section>
          <section className="avatar mt-3 flex items-center">
            <div className="avatarImage">
              <Image
                src={avatar}
                alt="avatar"
                style={{
                  width: '7rem',
                  height: '7rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <Space className="changeAvatar ml-3" direction="vertical">
              <div className="mb-2" style={{ fontSize: '1.2rem', fontWeight: 600, color: themeColorSet.colorText1 }}>
                Set profile photo
              </div>
              <Upload
                accept="image/png, image/jpeg, image/jpg"
                customRequest={() => {}}
                maxCount={1}
                onChange={(file) => handleChangeAvatar(file?.file?.originFileObj)}
                showUploadList={false}
                className="btnChange px-4 py-2"
              >
                <span style={{ color: commonColor.colorWhile1 }}>Change Avatar</span>
              </Upload>
            </Space>
          </section>
          <section className="addLinks mt-3">
            {links?.map((item: any, index: any) => {
              switch (item.key) {
                case '0':
                  return (
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      onClick={() => {
                        openInNewTab(item.link);
                      }}
                      className="item"
                      icon={<FontAwesomeIcon icon={icon(faFacebookF)} />}
                    />
                  );
                case '1':
                  return (
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      onClick={() => {
                        openInNewTab(item.link);
                      }}
                      className="item"
                      icon={<FontAwesomeIcon icon={icon(faGithub)} />}
                    />
                  );
                case '2':
                  return (
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      onClick={() => {
                        openInNewTab(item.link);
                      }}
                      className="item"
                      icon={<FontAwesomeIcon icon={icon(faTwitter)} />}
                    />
                  );
                case '3':
                  return (
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      onClick={() => {
                        openInNewTab(item.link);
                      }}
                      className="item"
                      icon={<FontAwesomeIcon icon={icon(faInstagram)} />}
                    />
                  );
                case '4':
                  return (
                    <Avatar
                      style={{ color: themeColorSet.colorText1 }}
                      onClick={() => {
                        openInNewTab(item.link);
                      }}
                      className="item"
                      icon={<FontAwesomeIcon icon={icon(faLinkedin)} />}
                    />
                  );
                default:
                  return null;
              }
            })}
            <button
              className="addLinks mt-2 px-4 py-1 cursor-pointer"
              onClick={() => {
                dispatch(
                  openModal({
                    title: 'Update Social Links',
                    component: <AddLinkComponent key={Math.random()} callback={handleChangeLinks} links={links} />,
                    footer: false,
                  }),
                );
              }}
              style={{
                color: themeColorSet.colorText3,
                border: '1px solid',
                borderColor: themeColorSet.colorBg4,
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Links
            </button>
          </section>
          <section className="inputInformation mt-5">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              Information
            </div>
            <div className="line1 flex justify-between items-center mb-5">
              <div className="LastName form__group field" style={{ width: '48%' }}>
                <input
                  defaultValue={userInfo?.lastname}
                  pattern="[A-Za-z ]*"
                  type="input"
                  className="form__field"
                  placeholder="Last Name"
                  name="lastname"
                  id="lastname"
                  required
                  onChange={handleChangeLastName}
                  autoComplete="off"
                />
                <label htmlFor="lastname" className="form__label">
                  Last Name
                </label>
              </div>
              <div className="firstName form__group field" style={{ width: '48%' }}>
                <input
                  defaultValue={userInfo?.firstname}
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
              </div>
            </div>
            <div className="line2 flex justify-between items-center">
              <div className="alias form__group field" style={{ width: '48%' }}>
                <input
                  defaultValue={userInfo?.alias}
                  type="input"
                  className="form__field"
                  placeholder="ex: johndoe"
                  name="alias"
                  id="alias"
                  required
                  onChange={handleChangeAlias}
                  autoComplete="off"
                />
                <label htmlFor="alias" className="form__label">
                  Alias
                </label>
              </div>
              <div className="location form__group field" style={{ width: '48%' }}>
                <input
                  defaultValue={userInfo?.location}
                  pattern="[A-Za-z ]*"
                  type="input"
                  className="form__field"
                  placeholder="ex: Viet Nam"
                  name="location"
                  id="location"
                  required
                  onChange={handleChangeLocation}
                  autoComplete="off"
                />
                <label htmlFor="location" className="form__label">
                  Location
                </label>
              </div>
            </div>
            <div className="line2"></div>
          </section>
          <section className="expertise mt-7">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              Expertise
            </div>
            <div className="tags flex flex-wrap">
              {descArray.map((item, index) => {
                if (tags?.indexOf(item.title) !== -1) {
                  return (
                    <Tag
                      className="item mx-2 my-2 px-4 py-1"
                      key={index}
                      color={themeColorSet.colorBg1}
                      style={{
                        border: 'none',
                        color: themeColorSet.colorText1,
                      }}
                    >
                      {item.svg} &nbsp;
                      {item.title}
                    </Tag>
                  );
                }
                return null;
              })}
              <button
                className="addTags mt-2 px-4 py-1 cursor-pointer"
                style={{
                  border: '1px solid',
                  borderColor: themeColorSet.colorBg4,
                }}
                onClick={() => {
                  dispatch(
                    openModal({
                      title: 'Add Tags',
                      component: <AddTagComponent key={Math.random()} callback={handleChangeTags} tags={tags} />,
                      footer: true,
                    }),
                  );
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Tags
              </button>
            </div>
          </section>
          <section className="about mt-7">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
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
                            placeholder="Write something about yourself..."
                            content={about as string}
                            callbackFunction={handleChangeAbout}
                          />
                        ),
                        footer: true,
                      }),
                    );
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="ml-2 cursor-pointer"
                    size="xs"
                    style={{ color: themeColorSet.colorText3 }}
                  />
                </span>
              )}
            </div>
            {about ? (
              // About có nội dung
              <div className="content__text">
                <ReactQuill
                  value={about as Value}
                  readOnly={true}
                  theme={'bubble'}
                  modules={{
                    syntax: true,
                  }}
                />
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
                          placeholder="Write something about yourself..."
                          content=""
                          callbackFunction={handleChangeAbout}
                        />
                      ),
                      footer: true,
                    }),
                  );
                },
              )
            )}
          </section>
          <section className="experiences mt-7">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
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
                        footer: true,
                      }),
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="ml-2 cursor-pointer buttonAddExperience" size="xs" />
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
                      footer: true,
                    }),
                  );
                },
              )
            ) : (
              // Nếu có experience
              <div className="mt-5 ml-3">
                {experiences.map((item: any, index: any) => {
                  return renderExperience(item, index);
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
          <section className="repositories mt-7">
            <div
              className="title mb-2"
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
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
                          footer: true,
                        }),
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 cursor-pointer"
                      size="xs"
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
                      footer: true,
                    }),
                  );
                },
              )
            ) : (
              // Nếu có repository
              <div className="flex flex-wrap justify-between mt-5">
                {repositories.map((item: any, index: any) => {
                  return renderRepositoryIem(item, index);
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
      </StyleTotal>
    </ConfigProvider>
  );
};

export default EditProfileForm;
