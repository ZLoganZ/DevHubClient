import { custom_scrollBar_modal } from '@/util/cssVariable';
import styled from 'styled-components';

const StyleProvider = styled.div`
  .sider {
    ${custom_scrollBar_modal}
    .ant-menu-item {
      /* color: red; */
    }
  }
`;

export default StyleProvider;
