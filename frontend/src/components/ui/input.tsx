import * as React from 'react';
import {ReactNode} from 'react';

import {cn} from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
}

function Input({prefixIcon, suffixIcon, className, type, ...props}: InputProps) {
    return (
        <div className='relative w-full'>
            {prefixIcon && <span className='absolute top-1/2 left-3 -translate-y-1/2 transform'>{prefixIcon}</span>}
            <input
                type={type}
                data-slot='input'
                // h-9
                className={cn(
                    'placeholder:text-202224/50 text-202224 border-d5d5d5s bg-f5f6fa rounded-20 flex w-full min-w-0 border px-4 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 md:text-sm',
                    prefixIcon && 'pl-10',
                    // 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    // 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className
                )}
                {...props}
            />
            {suffixIcon && <span className='absolute top-1/2 right-3 -translate-y-1/2 transform'>{suffixIcon}</span>}
        </div>
    );
}

export {Input};
