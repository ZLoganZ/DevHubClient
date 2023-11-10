import { Button } from 'antd';

import { getTheme } from '@/util/theme';
import merge from '@/util/mergeClassName';
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
  style?: React.CSSProperties;
}

export const ButtonActiveHover: React.FC<IButtonActiveHover> = ({
  className,
  children,
  onClick,
  loading,
  disabled,
  rounded,
  block,
  style,
  type = 'primary'
}) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        type={type}
        disabled={disabled ?? loading}
        className={merge('ButtonActiveHover font-bold px-6 py-2', className)}
        onClick={onClick}
        loading={loading}
        htmlType='submit'
        style={
          style
            ? { ...style, boxShadow: 'none' }
            : {
                height: '100%',
                borderRadius: rounded ? '1.5rem' : '0',
                width: block ? '100%' : 'auto',
                boxShadow: 'none'
              }
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
        className={merge('ButtonCancelHover font-bold px-6 py-2 rounded-3xl', className)}
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
