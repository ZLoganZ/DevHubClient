import styled from 'styled-components';
import { custom_scrollBar } from '@/util/cssVariable';

const StyleTotal = styled.div`
  background-color: ${(props) => props.theme.colorBg2};

  .postDetail {
    .commentTotal {
      ${custom_scrollBar}
    }
  }
`;

export default StyleTotal;
