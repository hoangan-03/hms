import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
    {
        variants: {
            variant: {
                success: 'bg-success/20 text-success',
                error: 'bg-error/20 text-error',
                warning: 'bg-warning/20 text-warning',
                info: 'bg-info/20 text-info',
            },
        },
        defaultVariants: {
            variant: 'success',
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {asChild?: boolean}) {
    const Comp = asChild ? Slot : 'span';

    return <Comp data-slot='badge' className={cn(badgeVariants({variant}), className)} {...props} />;
}

export {Badge, badgeVariants};
