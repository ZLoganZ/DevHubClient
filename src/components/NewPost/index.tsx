import {
  Avatar,
  Button,
  ConfigProvider,
  Input,
  message,
  Popover,
  Upload,
} from "antd";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
// import { sha1 } from "crypto-hash";
import ImageCompress from "quill-image-compress";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
// import hljs from "highlight.js/lib/core";
// import javascript from "highlight.js/lib/languages/javascript";
// import "highlight.js/styles/monokai-sublime.css";
import { useForm } from "react-hook-form";

import StyleTotal from "./cssNewPost";
import { commonColor } from "@/utils/cssVariable";
import { ButtonActiveHover } from "../MiniComponent";
import { useTheme } from "../ThemeProvider";
import { CREATE_POST_SAGA } from "@/redux/actionSaga/PostActionSaga";

Quill.register("modules/imageCompress", ImageCompress);

const toolbarOptions = [
  ["bold", "italic", "underline", "clean"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link"],
];

// hljs.registerLanguage("javascript", javascript);

// hljs.configure({
//   languages: ["javascript", "ruby", "python"],
// });

interface Props {
  userInfo: any;
}

//===================================================

const NewPost = (Props: Props) => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy theme từ LocalStorage chuyển qua css
  const { getTheme } = useTheme();

  const { themeColorSet } = getTheme();

  const [random, setRandom] = useState(0);

  const { register, handleSubmit } = useForm();

  // Quill Editor
  const quill = useRef<any>();

  useEffect(() => {
    quill.current = new Quill("#editor", {
      placeholder: "Add a Content",
      modules: {
        // syntax: true,
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });

    quill.current.on("text-change", () => {
      const text = quill.current.getText();

      register("content", { value: text });
    });

    // Ngăn chặn paste text vào quill
    // C1
    quill.current.root.addEventListener("paste", (event: any) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });
  }, []);

  // Hàm hiển thị mesage
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Please enter the content",
    });
  };

  const onSubmit = async (values: any) => {
    if (quill.current.root.innerHTML === "<p><br></p>") {
      error();
    } else {
      setLoading(true);
      const result = await handleUploadImage(file);
      if (result.status === "done") {
        dispatch(
          CREATE_POST_SAGA({
            postCreate: values,
            linkImage: result.url,
          })
        );
        setLoading(false);
        quill.current.root.innerHTML = "<p><br></p>";
        setRandom(Math.random());
        setFile(null);
        messageApi.success("Create post successfully");
      }
    }
  };

  const [file, setFile]: any = useState(null);

  const [loading, setLoading] = useState(false);

  const handleUpload = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.fileList.length === 0) return;

    setFile(info?.fileList[0]?.originFileObj);
  };

  const handleUploadImage = async (file: RcFile) => {
    if (!file)
      return {
        url: null,
        status: "done",
      };

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dp58kf8pw/image/upload?upload_preset=mysoslzj",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return {
      url: data.secure_url,
      status: "done",
    };
  };

  const handleRemoveImage = async () => {
    const formData = new FormData();
    const public_id = file.public_id;
    formData.append("api_key", "235531261932754");
    formData.append("public_id", public_id);
    const timestamp = String(Date.now());
    formData.append("timestamp", timestamp);
    // const signature = await sha1(
    //   `public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`
    // );
    // formData.append("signature", signature);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    setFile(data);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 40,
          borderRadius: 0,
          lineWidth: 0,
        },
      }}>
      {contextHolder}
      <StyleTotal theme={themeColorSet} className="rounded-lg mb-4">
        <div className="newPost px-4 py-3">
          <div
            className="newPostHeader text-center text-xl font-bold"
            style={{ color: themeColorSet.colorText1 }}>
            Create Post
          </div>
          <div className="newPostBody">
            <div className="name_avatar flex items-center">
              <Avatar
                size={50}
                src={
                  Props.userInfo?.userImage
                    ? Props.userInfo?.userImage
                    : "./images/DefaultAvatar/default_avatar.png"
                }
              />
              <div className="name font-bold ml-2">
                <NavLink to={`/user/${Props.userInfo?.id}`}>
                  {Props.userInfo?.username}
                </NavLink>
              </div>
            </div>
            <div className="AddTitle mt-4 z-10">
              <Input
                placeholder="Add a Title"
                allowClear
                style={{ borderColor: themeColorSet.colorText3 }}
                maxLength={150}
                {...register("title")}
              />
            </div>
            <div className="AddContent mt-4">
              <div id="editor" />
            </div>
          </div>
          <div className="newPostFooter mt-3 flex justify-between items-center">
            <div className="newPostFooter__left">
              <Popover
                placement="top"
                trigger="click"
                title={"Emoji"}
                content={
                  <Picker
                    data={async () => {
                      const response = await fetch(
                        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
                      );

                      return response.json();
                    }}
                    onEmojiSelect={(emoji: any) => {
                      quill.current.focus();
                      quill.current.insertText(
                        quill.current.getSelection().index,
                        emoji.native
                      );
                    }}
                  />
                }>
                <span className="emoji">
                  <FontAwesomeIcon
                    className="item mr-3 ml-3"
                    size="lg"
                    icon={faFaceSmile}
                  />
                </span>
              </Popover>
              <span>
                <Upload
                  accept="image/*"
                  key={random}
                  maxCount={1}
                  customRequest={async ({
                    file,
                    onSuccess,
                    onError,
                    onProgress,
                  }: any) => {
                    onSuccess("ok");
                  }}
                  data={(file) => {
                    return {};
                  }}
                  listType="picture"
                  onChange={handleUpload}
                  onRemove={() => {
                    setFile(null);
                  }}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </span>
            </div>
            <div className="newPostFooter__right">
              <ButtonActiveHover
                rounded
                onClick={handleSubmit(onSubmit)}
                loading={loading}>
                <span style={{ color: commonColor.colorWhile1 }}>
                  {loading ? "Creating.." : "Create"}
                </span>
              </ButtonActiveHover>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default NewPost;
