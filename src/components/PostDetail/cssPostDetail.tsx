import styled from 'styled-components';
import { custom_scrollBar_modal } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg2};
  color: ${(props) => props.theme.colorText1};
  /* min-height: calc(100vh - 5rem); */

  .postDetail {
    ${custom_scrollBar_modal}
  }
`;

export default StyleProvider;
