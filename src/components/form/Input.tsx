import clsx from 'clsx';
import { forwardRef, type ReactNode, useImperativeHandle, useRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    isCompact?: boolean;
    isFullWidth?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    return (
        <div
            onClick={() => innerRef.current?.focus()}
            className={clsx('input-wrapper', { compact: props.isCompact, 'full-width': props.isFullWidth })}
        >
            <div className="input-wrapper-padding">
                {props.startIcon}
                <div style={{ position: 'relative', width: '100%' }}>
                    <input {...props} ref={innerRef} />
                    {props.placeholder && !props.value ? (
                        <span className="input-wrapper-placeholder">{props.placeholder}</span>
                    ) : null}
                </div>
                {props.endIcon}
            </div>
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
