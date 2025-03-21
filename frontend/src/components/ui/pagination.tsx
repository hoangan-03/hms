import {ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon} from 'lucide-react';
import * as React from 'react';

import {Button, buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

function Pagination({className, ...props}: React.ComponentProps<'nav'>) {
    return (
        <nav
            role='navigation'
            aria-label='pagination'
            data-slot='pagination'
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    );
}

function PaginationContent({className, ...props}: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot='pagination-content'
            className={cn('flex flex-row items-center gap-x-2.5', className)}
            {...props}
        />
    );
}

function PaginationItem({...props}: React.ComponentProps<'li'>) {
    return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
    isDisabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
    React.ComponentProps<'a'>;

function PaginationLink({className, isActive, isDisabled, ...props}: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? 'page' : undefined}
            data-slot='pagination-link'
            data-active={isActive}
            className={cn(
                buttonVariants({
                    variant: 'none',
                    size: 'none',
                }),
                'h-8 w-8 rounded-sm hover:opacity-60',
                isActive ? 'bg-primary text-white' : 'bg-primary text-primary-light',
                isDisabled ? 'pointer-events-none opacity-50' : '',
                className
            )}
            {...props}
        />
    );
}

function PaginationPrevious({isDisabled = false, className, ...props}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label='Go to previous page'
            size='primary'
            className={cn(
                'bg-primary text-primary-light h-8 w-8 rounded-sm hover:opacity-60',
                buttonVariants({variant: 'none', size: 'none'}),
                className
            )}
            isDisabled={isDisabled}
            {...props}
        >
            <ChevronLeftIcon />
            <span className='hidden sm:block'>Previous</span>
        </PaginationLink>
    );
}

function PaginationNext({isDisabled = false, className, ...props}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label='Go to next page'
            size='primary'
            className={cn(
                'bg-primary text-primary-light h-8 w-8 rounded-sm hover:opacity-60',
                buttonVariants({variant: 'none', size: 'none'}),
                className
            )}
            isDisabled={isDisabled}
            {...props}
        >
            <span className='hidden sm:block'>Next</span>
            <ChevronRightIcon />
        </PaginationLink>
    );
}

function PaginationEllipsis({className, ...props}: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot='pagination-ellipsis'
            // className={cn('flex size-9 items-center justify-center', className)}
            className={className}
            {...props}
        >
            <MoreHorizontalIcon className='size-4' />
            <span className='sr-only'>More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
