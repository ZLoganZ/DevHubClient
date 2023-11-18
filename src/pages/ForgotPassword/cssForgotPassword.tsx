import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  height: 100vh;
  background-color: ${(props) => props.theme.colorBg1};
  .btnNext {
    color: ${commonColor.colorWhite1};
    background-color: ${commonColor.colorBlue2};
    bottom: 10%;
    right: 0%;
    border-radius: 5rem;
    &:hover {
      background-color: ${commonColor.colorBlue3};
      cursor: pointer;
      transition: background-color 0.5s;
    }
  }

  .btnBack {
    color: ${commonColor.colorWhite1};
    background-color: ${commonColor.colorBlue2};
    bottom: 10%;
    left: 0%;
    border-radius: 5rem;
    &:hover {
      background-color: ${commonColor.colorBlue3};
      cursor: pointer;
      transition: background-color 0.5s;
    }
  }
`;

export default StyleProvider;
