import { getTheme } from '@/util/theme';

import StyleProvider from './cssErrorHandler';

interface IErrorBoundary {
  error: Error;
  resetErrorBoundary: (...args: any[]) => void;
}

const ErrorHandler = ({ error, resetErrorBoundary }: IErrorBoundary) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { themeColorSet } = getTheme();

  document.title = 'Error';

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='__errorhandler'>
        <div id='__error'>
          <div className='__error'>
            <div className='__errorhandler'>
              <h1>Error</h1>
              <h2>{error.message}</h2>
            </div>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default ErrorHandler;
