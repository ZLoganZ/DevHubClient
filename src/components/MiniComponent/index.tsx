import { Button } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import StyleProvider from './cssMiniComponent';

// ===========================================

type ButtonNormalHoverProps = 'primary' | 'text' | 'default' | 'dashed';

type ButtonActiveHoverProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  loading?: boolean;
  rounded?: boolean;
  block?: boolean;
  type?: ButtonNormalHoverProps;
};

export const ButtonActiveHover = ({
  className,
  children,
  onClick,
  loading,
  rounded,
  block,
  type
}: ButtonActiveHoverProps) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        type={type}
        disabled={loading}
        className={`${!className ? 'ButtonActiveHover font-bold px-6 py-2' : className}`}
        onClick={onClick}
        loading={loading}
        htmlType='submit'
        style={
          !className
            ? {
                height: '100%',
                borderRadius: rounded ? '1.5rem' : '0',
                width: block ? '100%' : 'auto'
              }
            : {}
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

type ButtonCancelHoverProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
};

export const ButtonCancelHover = ({ className, children, onClick, disabled }: ButtonCancelHoverProps) => {
  useAppSelector((state) => state.theme.change);
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
