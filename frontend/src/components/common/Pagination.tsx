import {
    Pagination as PaginationUI,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui';
import {usePagination} from '@/hooks/usePagination';
import {ELLIPSIS} from '@/hooks/usePagination';
import {cn} from '@/lib/utils';

export interface PaginationProps {
    currentPage: number;
    perPage: number;
    totalItems: number;
    adjacentPageCount?: number;
    className?: string;
    onGoToPage: (page: number) => void;
}

function Pagination({currentPage, perPage, totalItems, adjacentPageCount = 1, className, onGoToPage}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / perPage);
    const paginationArray = usePagination({
        totalPages,
        currentPage,
        adjacentPageCount,
    });

    const handlePreviousPage = () => {
        onGoToPage(Math.max(1, currentPage - 1));
    };

    const handleNextPage = () => {
        onGoToPage(Math.min(totalPages, currentPage + 1));
    };

    const handleCanGetPreviousPage = () => {
        return currentPage > 1;
    };

    const handleCanGetNextPage = () => {
        return currentPage < totalPages;
    };

    return (
        <div className={cn('flex items-center justify-between bg-inherit', className)}>
            <div>
                <p>
                    Showing {Math.max(perPage * (currentPage - 1) + 1, 1)}-{Math.min(perPage * currentPage, totalItems)}{' '}
                    from {totalItems}
                </p>
            </div>
            <div>
                <PaginationUI>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href='#'
                                onClick={handlePreviousPage}
                                isDisabled={!handleCanGetPreviousPage()}
                            />
                        </PaginationItem>
                        {paginationArray &&
                            paginationArray.map((page, index) => {
                                if (page === ELLIPSIS) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationLink>
                                                <PaginationEllipsis />
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href='#'
                                            onClick={() => onGoToPage(Number(page))}
                                            {...(page === currentPage && {isActive: true})}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        <PaginationItem>
                            <PaginationNext href='#' onClick={handleNextPage} isDisabled={!handleCanGetNextPage()} />
                        </PaginationItem>
                    </PaginationContent>
                </PaginationUI>
            </div>
        </div>
    );
}

export default Pagination;
