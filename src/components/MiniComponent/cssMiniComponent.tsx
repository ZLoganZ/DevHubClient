import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .ButtonActiveHover {
    color: ${commonColor.colorWhite1};
    background-color: ${commonColor.colorBlue1};
    border: none;
    &:hover {
      color: ${commonColor.colorWhite1};
      background-color: ${commonColor.colorBlue3};
      transition: background-color 0.5s, color 0.5s;
    }
  }

  .ButtonCancelHover {
    color: ${(props) => props.theme.colorText1};
    background-color: ${(props) => props.theme.colorBg2};
    border: 1px solid ${(props) => props.theme.colorText3};
    &:hover {
      color: ${(props) => props.theme.colorText1};
      border-color: ${(props) => props.theme.colorText1};
      transition: background-color 0.5s, color 0.5s;
    }
  }
`;

export default StyleProvider;
