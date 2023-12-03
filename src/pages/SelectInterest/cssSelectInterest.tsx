import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  height: 100vh;
  background-color: ${(props) => props.theme.colorBg1};
  .selectInterest {
    .content {
      .interest {
        .interestItem {
          &.active {
            background-color: ${commonColor.colorBlue3};
          }
          background-color: ${(props) => props.theme.colorBg2};
          color: ${(props) => props.theme.colorText2};
          border-radius: 1.5rem;
          &:hover {
            background-color: ${commonColor.colorBlue3};
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
        }
      }
      .btnNext {
        bottom: 10%;
        right: 0%;
      }
    }
  }
`;

export default StyleProvider;
