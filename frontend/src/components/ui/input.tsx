import * as React from 'react';
import {ReactNode} from 'react';

import {cn} from '@/lib/utils';

import {Button} from '.';

interface InputProps extends React.ComponentProps<'input'> {
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    errorMessage?: string;
    errorClassName?: string;
    onChangePasswordVisibility?: () => void;
}

function Input({
    prefixIcon,
    suffixIcon,
    className,
    type,
    errorClassName,
    errorMessage,
    onChangePasswordVisibility,
    ...props
}: InputProps) {
    return (
        <>
            <div className='relative w-full'>
                {prefixIcon && <span className='absolute top-1/2 left-3 -translate-y-1/2 transform'>{prefixIcon}</span>}
                <input
                    type={type}
                    data-slot='input'
                    className={cn(
                        'placeholder:text-202224/50 text-202224 border-d5d5d5 bg-f5f6fa flex w-full min-w-0 rounded-[20px] border px-4 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-60 md:text-sm',
                        prefixIcon && 'pl-10',
                        // 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        // 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        className
                    )}
                    {...props}
                />
                {suffixIcon &&
                    (onChangePasswordVisibility ? (
                        <Button
                            size='icon'
                            variant='none'
                            className='absolute top-1/2 right-3 -translate-y-1/2 transform'
                            onClick={onChangePasswordVisibility}
                        >
                            {suffixIcon}
                        </Button>
                    ) : (
                        <span className='absolute top-1/2 right-3 -translate-y-1/2 transform'>{suffixIcon}</span>
                    ))}
            </div>
            <p className={cn('text-error mt-2', errorClassName)}>{errorMessage}</p>
        </>
    );
}

export {Input};
