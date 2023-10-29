import styled from 'styled-components';

const StyleProvider = styled.div`
  .chatWelcome {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &__container {
      width: 100%;
      max-width: 400px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &__header {
        width: 100%;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &__avatar {
          width: 90px;
          height: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &__name {
          margin-top: 10px;
          font-size: 1.2rem;
          font-weight: 600;
          color: ${(props) => props.theme.colorText1};
        }

        &__members {
          margin-top: 5px;
          font-size: 0.9rem;
          font-weight: 500;
          color: ${(props) => props.theme.colorText3};
        }
      }

      &__body {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;

        &__text {
          font-size: 1.1rem;
          font-weight: 500;
          color: ${(props) => props.theme.colorText1};
        }
      }
    }
  }
`;

export default StyleProvider;
