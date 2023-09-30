import styled from 'styled-components';

const StyleProvider = styled.div`
  .itemAddTag {
    background-color: ${(props) => props.theme.colorBg1};
    font-size: 0.9rem;
    border-radius: 0.5rem;
    color: ${(props) => props.theme.colorText2};
    border-radius: 1.5rem;
    &.active {
      background-color: ${(props) => props.theme.colorBg4};
    }
    :hover {
      background-color: ${(props) => props.theme.colorBg4};
      cursor: pointer;
      transition: all 0.5s;
    }
  }
`;

export default StyleProvider;
