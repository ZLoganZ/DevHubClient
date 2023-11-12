import styled from 'styled-components';

import { custom_scrollBar } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .list-users,
  .list-users-checked {
    ${custom_scrollBar}
  }
`;

export default StyleProvider;
