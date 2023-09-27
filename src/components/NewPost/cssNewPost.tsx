import styled from 'styled-components';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg2};
  .ql-toolbar {
    border: none;
    svg {
      filter: ${(props) => props.theme.colorSVG};
    }
  }
  .ql-editor {
    font-size: 14px;
  }
  .ql-editor::before {
    color: ${(props) => props.theme.colorBg3};
    font-style: normal;
  }

  .ql-container {
    border: none;
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
  }
`;

export default StyleProvider;
