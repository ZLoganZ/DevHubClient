import styled from "styled-components";

const StyleTotal = styled.div`
  background-color: ${(props) => props.theme.colorBg2};
  .space-align-block {
    flex: none;
    margin: 16px 8px;
    padding: 20px;
    border: 1px solid ${(props) => props.theme.colorBg4};
    border-radius: 20px;
  }
  .ql-editor {
    line-height: 2rem;
    border: none;
    font-size: 0.88rem;
  }
  .title {
    font-size: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme.colorText1};
  }
  .disableElement {
    pointer-events: none;
    opacity: 0.7;
  }

  .post {
    .postHeader {
      .postHeader__left {
        .name_avatar {
          .name__top {
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
      .postHeader__right {
        .icon {
          :hover {
            cursor: pointer;
            color: ${(props) => props.theme.colorText2};
            transition: all 0.3s;
          }
        }
      }
    }
    .postBody {
    }
    .postFooter {
      .item {
        :hover {
          cursor: pointer;
        }
      }
      .comment_view {
        .emoji {
          color: ${(props) => props.theme.colorText3};
          :hover {
            cursor: pointer;
            color: ${(props) => props.theme.colorText2};
            transition: all 0.5s;
          }
        }
      }
    }
  }
`;

export default StyleTotal;
