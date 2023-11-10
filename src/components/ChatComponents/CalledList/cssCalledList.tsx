import styled from 'styled-components';
import { custom_scrollBar } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};

  .called {
    ${custom_scrollBar};
  }
  .list-called {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default StyleProvider;
