import styled from 'styled-components';

const StyleProvider = styled.div`
  .container {
    position: relative;
    width: 100%;
    padding: 0;
  }

  .overlay {
    border-radius: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    opacity: 0.5; /* Adjust the opacity as needed */
    background-color: ${(props) => props.theme.colorBg4}; /* Adjust the background color as needed */
  }
`;

export default StyleProvider;
