import styled from 'styled-components';
import {
  flex_center_column,
  flex_center_row,
  darkThemeSet,
  commonColor
} from '@/util/cssVariable';

const StyleTotal = styled.div`
  background-color: ${darkThemeSet.colorBg1};
  height: 100vh;
  position: relative;

  .login {
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px ${darkThemeSet.colorBg2} inset !important;
      -webkit-text-fill-color: ${darkThemeSet.colorText1} !important;
    }

    width: 32rem;
    height: 40rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .loginForm {
      width: 100%;
      height: 100%;
      background-color: ${darkThemeSet.colorBg1};
      ${flex_center_column};
      .welcomeBack {
        ${flex_center_column};
        .icon_logo {
          color: ${darkThemeSet.colorText1};
          font-size: 2rem;
          width: 70px;
          height: 70px;
          margin-bottom: 1rem;
          border: double 4px transparent;
          border-radius: 50%;
          background-image: linear-gradient(
              ${darkThemeSet.colorBg1},
              ${darkThemeSet.colorBg1}
            ),
            radial-gradient(circle at right top, #2979ff, #07a787);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          position: relative;
          ${flex_center_row};
        }
        .title {
          color: ${darkThemeSet.colorText1};
          font-size: 1.5rem;
          font-weight: 500;
        }
      }

      /* form */
      .btn {
        background-image: linear-gradient(
          to right,
          ${commonColor.colorBlue1},
          ${commonColor.colorGreen1}
        );
        color: ${darkThemeSet.colorText1};
        &:hover {
          background-image: linear-gradient(
            to right,
            ${commonColor.colorBlue2},
            #0abe9a
          );
          transition: all 0.5s;
        }
      }

      .forgot {
        color: ${darkThemeSet.colorText2};
        font-size: 0.9rem;
        text-decoration: underline solid ${darkThemeSet.colorText2};
        text-underline-position: below;
        &:hover {
          color: ${commonColor.colorBlue1};
          transition: all 0.5s;
          cursor: pointer;
          text-decoration: none;
        }
      }

      .anotherLogin {
        width: 70%;
        .title {
          span {
            top: -0.9rem;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${darkThemeSet.colorBg1};
            padding: 0 0.5rem;
            font-size: 0.9rem;
          }
        }
        .loginTool {
          .google {
            ${flex_center_row};
            background-color: ${darkThemeSet.colorBg2};
            color: ${darkThemeSet.colorText1};
            font-size: 0.9rem;
            &:hover {
              background-color: ${commonColor.colorBlue1};
              transition: all 0.5s;
              cursor: pointer;
            }
            .icon {
              width: 1.5rem;
              height: 1.5rem;
            }
          }
          .github {
            ${flex_center_row};
            background-color: ${darkThemeSet.colorBg2};
            color: ${darkThemeSet.colorText1};
            font-size: 0.9rem;
            &:hover {
              background-color: ${commonColor.colorBlue1};
              transition: all 0.5s;
              cursor: pointer;
            }
            .icon {
              width: 1.5rem;
              height: 1.5rem;
            }
          }
        }
      }
      .noAccount {
        width: 70%;
        color: ${darkThemeSet.colorText3};
        font-size: 0.9rem;
        .signUp {
          color: ${commonColor.colorBlue1};
          &:hover {
            color: ${commonColor.colorBlue3};
            transition: all 0.5s;
            cursor: pointer;
          }
        }
      }
    }
  }
`;

export default StyleTotal;
