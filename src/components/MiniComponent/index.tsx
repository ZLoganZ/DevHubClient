import { Button } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import StyleProvider from './cssMiniComponent';

// ===========================================

type ButtonNormalHoverType = 'primary' | 'text' | 'default' | 'dashed';

interface IButtonActiveHover {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  loading?: boolean;
  rounded?: boolean;
  block?: boolean;
  type?: ButtonNormalHoverType;
}

export const ButtonActiveHover: React.FC<IButtonActiveHover> = ({
  className,
  children,
  onClick,
  loading,
  disabled,
  rounded,
  block,
  type = 'primary'
}) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        type={type}
        disabled={disabled ?? loading}
        className={`${!className ? 'ButtonActiveHover font-bold px-6 py-2' : className}`}
        onClick={onClick}
        loading={loading}
        htmlType='submit'
        style={
          !className
            ? {
                height: '100%',
                borderRadius: rounded ? '1.5rem' : '0',
                width: block ? '100%' : 'auto',
                boxShadow: 'none'
              }
            : { boxShadow: 'none' }
        }>
        {children}
      </Button>
    </StyleProvider>
  );
};

// ===========================================

export const ButtonActiveNonHover = () => {
  return <></>;
};

// ===========================================

interface IButtonCancelHover {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
}

export const ButtonCancelHover: React.FC<IButtonCancelHover> = ({
  className,
  children,
  onClick,
  disabled
}) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        className={`ButtonCancelHover font-bold px-6 py-2 rounded-3xl ${className}`}
        onClick={onClick}
        style={{ height: '100%' }}
        htmlType='button'
        disabled={disabled}>
        {children}
      </Button>
    </StyleProvider>
  );
};

// ===========================================

export const ButtonCancelNonHover = () => {
  return <></>;
};

// ===========================================
