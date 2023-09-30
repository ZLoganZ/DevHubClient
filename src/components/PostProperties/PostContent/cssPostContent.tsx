import styled from 'styled-components';

const StyleProvider = styled.div`
  .title {
    font-size: 1rem;
    color: ${(props) => props.theme.colorText1};
  }
`;

export default StyleProvider;
