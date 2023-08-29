import styled from "styled-components";
import { commonColor, change_color_autoFill } from "@/utils/cssVariable";

const StyleTotal = styled.div`
  ${change_color_autoFill}
  .form__group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 50%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 1rem;
    color: ${(props) => props.theme.colorText1};
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1rem;
      cursor: text;
      top: 20px;
    }

    &:required,
    &:invalid {
      box-shadow: none;
    }
  }

  .form__field:focus {
    ~ .form__label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: ${commonColor.colorBlue3};
    }
    padding-bottom: 6px;
    border-width: 3px;
    border-color: ${commonColor.colorBlue3};
    border-image-slice: 1;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: ${(props) => props.theme.colorText3};
  }

  .editPositionForm {
    .untilButton {
      background-color: ${(props) => props.theme.colorBg3};
    }
    .untilActive {
      background-color: ${commonColor.colorBlue2};
      color: ${commonColor.colorWhile1};
    }
  }

  /* input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${(props) =>
    props.theme.colorBg2} inset !important;
    -webkit-text-fill-color: ${(props) => props.theme.colorText1} !important;
  } */
`;

export default StyleTotal;
