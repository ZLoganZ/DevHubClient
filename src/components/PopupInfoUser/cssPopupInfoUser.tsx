import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .popupInfoUser {
    .popupInfoUser__content {
      .button_Total {
        .btnFollow {
          color: ${(props) => props.theme.colorText1};
          background-color: ${commonColor.colorBlue1};
          :hover {
            background-color: ${commonColor.colorBlue3};
            cursor: pointer;
            transition: all 0.5s;
          }
        }
        .btnOption {
          color: ${(props) => props.theme.colorText1};
          background-color: ${(props) => props.theme.colorBg3};
          :hover {
            background-color: ${(props) => props.theme.colorBg4};
            cursor: pointer;
            transition: all 0.5s;
          }
        }
      }
    }
  }
`;

export default StyleProvider;
