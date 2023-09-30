import styled from 'styled-components';
import { commonColor, custom_scrollBar } from '@/util/cssVariable';

const StyleProvider = styled.div`
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

  .addRepositories {
    .repositories {
      ${custom_scrollBar}
    }
  }
`;

export default StyleProvider;
