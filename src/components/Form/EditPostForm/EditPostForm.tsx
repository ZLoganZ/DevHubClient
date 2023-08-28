import {
  Button,
  ConfigProvider,
  Input,
  message,
  Popover,
  Upload,
  UploadFile,
} from "antd";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTheme } from "../../../util/functions/ThemeFunction";
import StyleTotal from "./cssEditPostForm";
import ImageCompress from "quill-image-compress";
import dataEmoji from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { UPDATE_POST_SAGA } from "../../../redux/actionSaga/PostActionSaga";
import { UploadOutlined } from "@ant-design/icons";
import {
  callBackSubmitDrawer,
  setLoading,
} from "../../../redux/Slice/DrawerHOCSlice";
import { RcFile } from "antd/es/upload";
import { sha1 } from "crypto-hash";

Quill.register("modules/imageCompress", ImageCompress);

var toolbarOptions = [
  ["bold", "italic", "underline", "clean"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link"],
];

interface PostProps {
  id: any;
  title: any;
  content: any;
  img?: any;
}

const EditPostForm = (PostProps: PostProps) => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

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

  const handleRemoveImage = async (imageURL: any) => {
    const nameSplit = imageURL.split("/");
    const duplicateName = nameSplit.pop();

    // Remove .
    const public_id = duplicateName?.split(".").slice(0, -1).join(".");

    const formData = new FormData();
    formData.append("api_key", "235531261932754");
    formData.append("public_id", public_id);
    const timestamp = String(Date.now());
    formData.append("timestamp", timestamp);
    const signature = await sha1(
      `public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`
    );
    formData.append("signature", signature);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return {
      url: data,
      status: "done",
    };
  };

  // Formik
  const formik = useFormik({
    initialValues: {
      title: PostProps.title,
      content: PostProps.content,
      linkImage: null,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (quill.root.innerHTML === "<p><br></p>") {
        error();
      } else {
        dispatch(setLoading(true));
        if (isChanged > 0) {
          if (file) {
            const result = await handleUploadImage(file);
            values.linkImage = result.url;
          }
          if (PostProps.img) await handleRemoveImage(PostProps.img);
        }
        values.linkImage = values.linkImage ? values.linkImage : PostProps.img;
        dispatch(
          UPDATE_POST_SAGA({
            id: PostProps.id,
            postUpdate: values,
          })
        );
      }
    },
  });

  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      messageApi.error("Image must smaller than 3MB!");
    }
    return isLt2M;
  };

  // Quill Editor
  let [quill, setQuill] = useState<any>(null);

  useEffect(() => {
    // Tạo quill
    quill = new Quill("#editorDrawer", {
      modules: {
        // syntax: true,
        toolbar: toolbarOptions,
      },
      theme: "snow",
      scrollingContainer: "#scrolling-container",
    });
    quill.on("text-change", function () {
      handleQuillChange();
    });

    // Ngăn chặn paste text vào quill
    // C1
    quill.root.addEventListener("paste", (event: any) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain");

      const textToHTMLWithTabAndSpace = text
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(/ /g, "&nbsp;");

      // console.log(textToHTMLWithTabAndSpace);

      document.execCommand("insertHTML", false, textToHTMLWithTabAndSpace);
    });

    setQuill(quill);

    // Dispatch callback submit lên cho DrawerHOC
    dispatch(callBackSubmitDrawer(formik.handleSubmit));
  }, []);

  useEffect(() => {
    // Hiển thị nội dung trong quill
    quill.root.innerHTML = PostProps.content;
    setQuill(quill);
    // Hiển thị lại title khi PostProps.title thay đổi
    formik.setFieldValue("title", PostProps.title);
  }, [PostProps, quill]);

  const handleQuillChange = () => {
    const text = quill.root.innerHTML;
    formik.setFieldValue("content", text);
  };

  // Hàm hiển thị mesage
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Please enter the content",
    });
  };

  const [isChanged, setIsChanged] = useState(0);

  const nameImage = useMemo(() => {
    if (PostProps.img) {
      const nameSplit = PostProps.img.split("/");
      const duplicateName = nameSplit.pop();
      const name = duplicateName.replace(/_[^_]*\./, ".");
      return name;
    }
    return undefined;
  }, [PostProps.img]);

  const [file, setFile]: any = useState([]);
  const handleUpload = (info: any) => {
    setIsChanged(isChanged + 1);
    setFile(info?.file?.originFileObj);
    formik.setFieldValue("linkImage", info.fileList[0].originFileObj);
  };

  const fileList: UploadFile[] = [
    {
      uid: "-1",
      name: nameImage,
      status: "done",
      url: PostProps.img,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          ...themeColor,
          controlHeight: 40,
          borderRadius: 0,
          lineWidth: 0,
        },
      }}>
      {contextHolder}
      <StyleTotal theme={themeColorSet} className="rounded-lg mb-4">
        <div className="newPost px-4 py-3">
          <div className="newPostBody">
            <div className="AddTitle mt-4 z-10">
              <Input
                name="title"
                placeholder="Add a Title"
                allowClear
                value={formik.values.title}
                style={{ borderColor: themeColorSet.colorText3 }}
                maxLength={150}
                onChange={formik.handleChange}></Input>
            </div>
            <div className="AddContent mt-4">
              <div id="editorDrawer" />
            </div>
          </div>
          <div className="newPostFooter mt-3 flex justify-between items-center">
            <div className="newPostFooter__left">
              <Popover
                placement="top"
                trigger="click"
                title={"Members"}
                content={
                  <Picker
                    data={dataEmoji}
                    onEmojiSelect={(emoji: any) => {
                      quill.focus();
                      quill.insertText(
                        quill.getSelection().index,
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
                  name="linkImage"
                  listType="picture"
                  onChange={handleUpload}
                  accept="image/png, image/jpeg, image/jpg"
                  defaultFileList={PostProps.img ? [...fileList] : []}
                  maxCount={1}
                  customRequest={async ({
                    file,
                    onSuccess,
                    onError,
                    onProgress,
                  }: any) => {
                    onSuccess("ok");
                  }}
                  beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </span>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default EditPostForm;
