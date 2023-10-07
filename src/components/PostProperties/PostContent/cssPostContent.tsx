import styled from 'styled-components';

import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .ql-editor {
    line-height: 2rem;
    border: none;
    font-size: 0.88rem;
  }

  .title {
    font-size: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme.colorText1};
  }
  .clickMore {
    color: ${(props) => props.theme.colorText2};
    font-weight: 600;
    cursor: pointer;

    :hover {
      text-decoration: underline;
      color: ${commonColor.colorBlue1};
    }

    ::after {
      content: '...';
    }
  }
`;

export default StyleProvider;
