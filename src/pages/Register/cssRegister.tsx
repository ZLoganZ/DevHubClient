import styled from 'styled-components';
import {
  flex_center_column,
  darkThemeSet,
  commonColor
} from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${darkThemeSet.colorBg1};
  ${flex_center_column};

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${darkThemeSet.colorBg2} inset !important;
    -webkit-text-fill-color: ${darkThemeSet.colorText1} !important;
  }

  .register {
    width: 70%;
    height: 85%;
    border-radius: 15px;
    overflow: hidden;
    background-image: url('./images/registerPage/background.jpg');
    background-size: cover;
    .cover {
      width: 100%;
      height: 100%;
      color: ${darkThemeSet.colorText2};
      background-image: linear-gradient(
        to right,
        #161618d5,
        #1e1d2bb5,
        rgba(0, 0, 0, 0.21)
      );
      .content {
        width: 40%;
        .lineTop {
          .anyWhere {
            font-weight: 500;
            .circle {
              width: 20px;
              height: 20px;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .account {
          .startFree {
            font-size: 1rem;
            color: ${darkThemeSet.colorText3};
          }
          .createAccount {
            font-size: 2rem;
            font-weight: 700;
          }
          .member {
            font-size: 0.8rem;
            .memberEd {
              color: ${darkThemeSet.colorText3};
            }
            .login {
              color: ${commonColor.colorBlue1};
              &:hover {
                cursor: pointer;
                color: ${commonColor.colorBlue3};
                transition: all 0.5s;
              }
            }
          }
          .formAccount {
            .buttonCreate {
              background-color: ${commonColor.colorBlue1};
              color: ${darkThemeSet.colorText2};
              font-size: 0.9rem;
              font-weight: 700;
              padding: 0.5rem 1rem;
              border-radius: 25px;
              &:hover {
                cursor: pointer;
                background-color: ${commonColor.colorBlue3};
                transition: all 0.5s;
              }
            }
          }
        }
      }
    }
  }
`;

export default StyleProvider;
