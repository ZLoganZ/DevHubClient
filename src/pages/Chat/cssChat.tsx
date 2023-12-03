import styled from 'styled-components';
import { custom_scrollBar, flex_center_row } from '@/util/cssVariable';

const StyleProvider = styled.div`
  height: 100vh;
  background-color: ${(props) => props.theme.colorBg1};
  .chat {
    .slider {
      .icon_logo {
        color: white;
        font-size: 1.6rem;
        width: 45px;
        height: 45px;
        margin-bottom: 1rem;
        border: double 4px transparent;
        border-radius: 50%;
        background-image: linear-gradient(#171718, #171718),
          radial-gradient(circle at right top, #2979ff, #07a787);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        position: relative;
        ${flex_center_row};
      }
      .optionItem {
        cursor: pointer;
        .icon {
          color: ${(props) => props.theme.colorText1};
        }
      }
      .mode {
        color: ${(props) => props.theme.colorText3};
        &:hover {
          color: ${(props) => props.theme.colorText1};
          cursor: pointer;
          transition: color 0.5s;
        }
      }
    }
    .insteadComponent {
    }
    .chatBox {
      .header {
      }
      .body {
        ${custom_scrollBar}
      }
      .footer {
        .iconEmoji {
          .emoji {
            color: ${(props) => props.theme.colorText3};
            &:hover {
              cursor: pointer;
              color: ${(props) => props.theme.colorText2};
              transition: color 0.5s;
            }
          }
        }
        .extension {
          .upload,
          .micro {
            color: ${(props) => props.theme.colorText3};
            &:hover {
              cursor: pointer;
              color: ${(props) => props.theme.colorText2};
              transition: color 0.5s;
            }
          }
        }
      }
    }
  }
`;

export default StyleProvider;
