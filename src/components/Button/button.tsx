import React, { FC,ButtonHTMLAttributes,AnchorHTMLAttributes } from "react";
import classNames from "classnames";

export type ButtonSize = "lg" | "sm";
export type ButtonType = "primary" | "default" | "danger" | "link";



interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  href?: string;
  children?: React.ReactNode;
}




type NativeButtonProps = ButtonHTMLAttributes<HTMLElement> & BaseButtonProps
type NativeAriaProps = AnchorHTMLAttributes<HTMLElement> & BaseButtonProps
// 避免一个里面是必填一个是可选 这样可以都转化为必填
export type ButtonProps = Partial<NativeButtonProps & NativeAriaProps>


const Button: FC<ButtonProps> = (props) => {
  const {
    btnType,
    className,
    disabled,
    size,
    children,
    href,
    ...restProps
  } = props;
  let classes = classNames("btn", className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: (btnType !== 'link') && disabled,
  });
  console.log(classes);
  if (btnType === "link" && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  btnType: "default",
  disabled: false,
};


export default Button