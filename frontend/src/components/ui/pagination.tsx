import {MoreHorizontalIcon} from 'lucide-react';
import * as React from 'react';

import {Button, buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

import {Icon} from '../common';

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
                isActive ? 'bg-secondary text-primary' : 'bg-secondary/30 text-primary',
                isDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
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
            size='none'
            className={cn(
                'bg-primary-light text-primary h-8 w-8 rounded-sm hover:opacity-60',
                buttonVariants({variant: 'none', size: 'none'}),
                className
            )}
            isDisabled={isDisabled}
            {...props}
        >
            <Icon name='caret-left' width={20} height={20} className='text-primary' />
        </PaginationLink>
    );
}

function PaginationNext({isDisabled = false, className, ...props}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label='Go to next page'
            size='primary'
            className={cn(
                'bg-primary-light text-primary h-8 w-8 rounded-sm hover:opacity-60',
                buttonVariants({variant: 'none', size: 'none'}),
                className
            )}
            isDisabled={isDisabled}
            {...props}
        >
            <Icon name='caret-left' width={20} height={20} className='text-primary rotate-180' />
        </PaginationLink>
    );
}

function PaginationEllipsis({className, ...props}: React.ComponentProps<'span'>) {
    return (
        <span aria-hidden data-slot='pagination-ellipsis' className={className} {...props}>
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
