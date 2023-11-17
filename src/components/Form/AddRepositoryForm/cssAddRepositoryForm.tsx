import styled from 'styled-components';
import { custom_scrollBar } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .addRepositories {
    .repositories {
      ${custom_scrollBar}
    }
  }
`;

export default StyleProvider;
