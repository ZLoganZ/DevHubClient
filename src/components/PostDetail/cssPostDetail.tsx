import styled from 'styled-components';
import { custom_scrollBar } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  color: ${(props) => props.theme.colorText1};
  min-height: calc(100vh - 5rem);

  .postDetail {
    .commentTotal {
      ${custom_scrollBar}
    }
  }
`;

export default StyleProvider;
