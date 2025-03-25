import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';
import {ReactNode} from 'react';

import {cn} from '@/lib/utils';

import {Spinner} from '../common';
import {spinnerVariants} from '../common/Spinner';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    // [&_svg:not([class*='size-'])]:size-4
    // aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
    {
        variants: {
            variant: {
                primary: 'bg-primary text-white shadow-xs hover:bg-primary/90',
                cancel: 'bg-slate-200 text-slate-950 shadow-xs hover:bg-slate-300',
                none: '',
            },
            size: {
                primary: 'py-3 px-2',
                sm: 'py-2 px-2',
                md: 'py-4 px-4',
                icon: 'w-fit h-fit',
                none: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'primary',
        },
    }
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    asChild?: boolean;
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    spinnerVariant?: VariantProps<typeof spinnerVariants>['variant'];
}

function Button({
    className,
    variant,
    size,
    asChild = false,
    type = 'button',
    isLoading = false,
    prefixIcon,
    suffixIcon,
    spinnerVariant,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp data-slot='button' type={type} className={cn(buttonVariants({variant, size, className}))} {...props}>
            {prefixIcon}
            {children}
            {suffixIcon}
            {isLoading && <Spinner variant={spinnerVariant} />}
        </Comp>
    );
}

export {Button, buttonVariants};
