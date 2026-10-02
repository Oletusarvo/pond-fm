import React from "react";

export function PassProps({ children, ...props }: React.PropsWithChildren & any) {
  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      ...child.props,
      ...props,
      onClick: (e) => {
        child.props.onClick?.(e);
        props.onClick?.(e);
      },
    });
  });
}
