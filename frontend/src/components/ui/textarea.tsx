import * as React from 'react';

import {cn} from '@/lib/utils';

interface Props extends React.ComponentProps<'textarea'> {
    errorMessage?: string;
    errorClassName?: string;
}

function Textarea({className, errorMessage, errorClassName, ...props}: Props) {
    return (
        <>
            <textarea
                data-slot='textarea'
                className={cn(
                    // focus-visible:ring-[3px]
                    'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    className
                )}
                {...props}
            />
            <p className={cn('text-error mt-2', errorClassName)}>{errorMessage}</p>
        </>
    );
}

export {Textarea};
