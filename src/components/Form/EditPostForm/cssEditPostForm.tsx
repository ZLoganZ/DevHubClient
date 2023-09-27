import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg2};
  .ql-toolbar {
    svg {
      filter: ${(props) => props.theme.colorSVG};
    }
  }
  .ql-editor {
    font-size: 14px;
    -webkit-user-modify: 'read-write-plaintext-only';
    color: ${(props) => props.theme.colorText2};
  }
  .newPostBody {
    .name_avatar {
      .name {
        a {
          color: ${(props) => props.theme.colorText1};
          :hover {
            text-decoration: underline;
            transition: all 0.5s;
          }
        }
      }
    }
  }
  .newPostFooter {
    .newPostFooter__left {
      .emoji,
      .code {
        color: ${(props) => props.theme.colorText3};
        :hover {
          cursor: pointer;
          color: ${(props) => props.theme.colorText2};
          transition: all 0.5s;
        }
      }
    }
    .newPostFooter__right {
      .createButton {
        background-color: ${commonColor.colorBlue1};
        :hover {
          background-color: ${commonColor.colorBlue3};
          transition: all 0.5s;
        }
      }
    }
  }
  .ant-upload-list-item-thumbnail {
    min-width: 5rem !important;
    min-height: 3rem !important;
  }
`;

export default StyleProvider;
