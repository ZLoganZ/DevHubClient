import styled from 'styled-components';

const StyleProvider = styled.div`
  .__errorhandler {
    * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    body {
      padding: 0;
      margin: 0;
    }

    #__error {
      position: relative;
      height: 100vh;
      background: ${(props) => props.theme.colorBg1};
    }

    #__error .__error {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }

    .__error {
      max-width: 767px;
      width: 100%;
      line-height: 1.4;
      text-align: center;
    }

    .__error .__errorhandler {
      position: relative;
      height: 180px;
      margin-bottom: 20px;
      z-index: -1;
    }

    .__error .__errorhandler h1 {
      font-family: 'Montserrat', sans-serif;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      font-size: 224px;
      font-weight: 900;
      margin-top: 0px;
      margin-bottom: 0px;
      margin-left: -12px;
      color: ${(props) => props.theme.colorBg1};
      text-transform: uppercase;
      text-shadow: -1px -1px 0px #8400ff, 1px 1px 0px #ff005a;
      letter-spacing: -20px;
    }

    .__error .__errorhandler h2 {
      font-family: 'Montserrat', sans-serif;
      position: absolute;
      left: 0;
      right: 0;
      top: 110px;
      font-size: 42px;
      font-weight: 700;
      color: ${(props) => props.theme.colorText1};
      text-transform: uppercase;
      text-shadow: 0px 2px 0px #8400ff;
      letter-spacing: 13px;
      margin: 0;
    }

    .__error a {
      font-family: 'Montserrat', sans-serif;
      display: inline-block;
      text-transform: uppercase;
      color: #ff005a;
      text-decoration: none;
      border: 2px solid;
      background: transparent;
      padding: 10px 40px;
      font-size: 14px;
      font-weight: 700;
      -webkit-transition: color 0.2s ease-in-out;
      transition: color 0.2s ease-in-out;
    }

    .__error a:hover {
      color: #8400ff;
    }

    @media only screen and (max-width: 767px) {
      .__error .__errorhandler h2 {
        font-size: 24px;
      }
    }

    @media only screen and (max-width: 480px) {
      .__error .__errorhandler h1 {
        font-size: 182px;
      }
    }
  }
`;

export default StyleProvider;
