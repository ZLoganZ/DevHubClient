import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleTotal = styled.div`
  .ql-editor {
    font-size: 14px;
    color: ${(props) => props.theme.colorText1};
    line-height: 2rem;
  }

  .form__group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 50%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 1rem;
    color: ${(props) => props.theme.colorText1};
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1rem;
      cursor: text;
      top: 20px;
    }

    &:required,
    &:invalid {
      box-shadow: none;
    }
  }

  .form__field:focus {
    ~ .form__label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: ${commonColor.colorBlue3};
    }
    padding-bottom: 6px;
    border-width: 3px;
    border-color: ${commonColor.colorBlue3};
    border-image-slice: 1;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: ${(props) => props.theme.colorText3};
  }

  .editProfileForm {
    .componentNoInfo {
      .btnContent {
        :hover {
          background-color: ${commonColor.colorBlue3}!important;
          transition: all 0.5s;
        }
      }
    }
    .coverSection {
      .btnChangeCover {
        background-color: ${commonColor.colorBlue2}!important;
        font-weight: 600;
        border-radius: 20rem;
        :hover {
          background-color: ${commonColor.colorBlue3}!important;
          transition: all 0.5s;
        }
      }
      .btnRemove {
        background-color: ${commonColor.colorRed1}!important;
        font-weight: 600;
        border-radius: 20rem;
        :hover {
          background-color: ${commonColor.colorRed2}!important;
          transition: all 0.5s;
        }
      }
    }
    .avatar {
      .btnChange {
        background-color: ${commonColor.colorBlue2}!important;
        font-weight: 600;
        border-radius: 20rem;
        :hover {
          background-color: ${commonColor.colorBlue3}!important;
          transition: all 0.5s;
        }
      }
    }
    .links {
      .addLinks {
        border-radius: 2rem;
        :hover {
          background-color: ${(props) => props.theme.colorBg4};
          transition: all 0.5s;
        }
      }
      .item {
        background-color: ${(props) => props.theme.colorBg3};
        margin-right: 8px;
        :hover {
          background-color: ${(props) => props.theme.colorBg4};
          cursor: pointer;
          transition: all 0.3s;
        }
      }
    }
    .expertise {
      .addTags {
        color: ${(props) => props.theme.colorText3};
        border-radius: 2rem;
        :hover {
          color: ${(props) => props.theme.colorText2};
          transition: all 0.5s;
        }
        :hover {
          background-color: ${(props) => props.theme.colorBg4};
          transition: all 0.5s;
        }
      }
    }
    .experiences {
      .buttonAddExperience {
        color: ${(props) => props.theme.colorText3};
        :hover {
          color: ${(props) => props.theme.colorText2};
          transition: all 0.5s;
        }
      }
    }
    .repositories {
      .renderRepositoryIem {
        cursor: pointer;
        :hover {
          .top {
            .name {
              text-decoration: underline;
            }
          }
        }
        .top {
          .iconRepos {
            filter: ${(props) => props.theme.colorSVG};
          }
        }
      }
    }
  }
  .tags {
    .item {
      border: 2px solid ${(props) => props.theme.colorText3};
      border-radius: 0.8rem;
      font-size: 0.8rem;
      font-weight: 500;
      :hover {
        cursor: pointer;
        transition: all 0.3s;
      }
    }
  }
`;

export default StyleTotal;
