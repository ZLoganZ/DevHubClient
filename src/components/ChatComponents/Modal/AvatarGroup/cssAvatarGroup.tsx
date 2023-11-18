import styled from 'styled-components';

import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .ant-select-selector {
    box-shadow: none !important;
  }
  .btnChange {
    background-color: ${commonColor.colorBlue2}!important;
    font-weight: 600;
    border-radius: 20rem;
    &:hover {
      background-color: ${commonColor.colorBlue3}!important;
      transition: background-color 0.3s;
    }
  }
`;

export default StyleProvider;
