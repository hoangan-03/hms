import {useMemo} from 'react';

import {range} from '@/lib/utils';

export const ELLIPSIS = '...';

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    adjacentPageCount: number;
}

const usePagination = ({
    totalPages,
    currentPage,
    adjacentPageCount,
}: PaginationProps): Array<string | number> | undefined => {
    const paginationRange = useMemo(() => {
        // Pages count is determined as adjacentPageCount + firstPage + lastPage + currentPage + 2*ELLIPSIS
        const totalPageNumbers = adjacentPageCount + 5;

        /*
            If the number of pages is less than the page numbers we want to show in our
            paginationComponent, we return the range [1..totalPageCount]
        */
        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - adjacentPageCount, 1);
        const rightSiblingIndex = Math.min(currentPage + adjacentPageCount, totalPages);

        /*
            We do not want to show dots if there is only one position left 
            after/before the left/right page count as that would lead to a change if our Pagination
            component size which we do not want
        */
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * adjacentPageCount;
            const leftRange = range(1, leftItemCount);

            return [...leftRange, ELLIPSIS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * adjacentPageCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, ELLIPSIS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, ELLIPSIS, ...middleRange, ELLIPSIS, lastPageIndex];
        }
    }, [totalPages, currentPage, adjacentPageCount]);

    return paginationRange;
};

export {usePagination};
