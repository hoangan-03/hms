import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    Table,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {Fragment, ReactNode, useEffect} from 'react';

import {Table as TableUI, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui';
import {cn} from '@/lib/utils';

import Spinner from './Spinner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    columnVisibility?: VisibilityState;
    loading?: boolean;
    emptyState?: ReactNode;
    className?: string;
    childRowClassName?: string;
    onReturnTableToParentComponent?: (table: Table<TData>) => void;
    renderChildRow?: (row: TData) => ReactNode;
}

function DataTable<TData, TValue>({
    columns,
    data,
    columnVisibility,
    loading = false,
    emptyState,
    onReturnTableToParentComponent,
    className,
    childRowClassName,
    renderChildRow,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        ...(renderChildRow && {getExpandedRowModel: getExpandedRowModel()}),
        state: {
            columnVisibility,
        },
        ...(renderChildRow && {getRowCanExpand: () => !!renderChildRow}),
    });

    useEffect(() => {
        onReturnTableToParentComponent?.(table);
    }, [table, onReturnTableToParentComponent]);

    return (
        <div className={cn('relative', loading && 'pointer-events-none', className)}>
            {loading && (
                <div className='absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2'>
                    <Spinner className='border-t-primary border-slate-100' width={80} height={80} />
                </div>
            )}
            <div>
                <TableUI>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{width: header.column.columnDef.size}}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && 'selected'}
                                        className={cn('hover:bg-slate-300', renderChildRow && 'cursor-pointer')}
                                        {...(renderChildRow && {
                                            onClick: () => {
                                                row.toggleExpanded();
                                            },
                                        })}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {renderChildRow && (
                                        <TableRow
                                            className={cn(
                                                'bg-inherit',
                                                row.getIsExpanded() ? 'border-b' : 'border-b-0'
                                            )}
                                        >
                                            <TableCell colSpan={table.getAllColumns().length} className='p-0'>
                                                <div
                                                    className={cn(
                                                        'overflow-hidden transition-all duration-500 ease-in-out',
                                                        row.getIsExpanded()
                                                            ? 'max-h-[500px] p-4 opacity-100'
                                                            : 'max-h-0 opacity-0',
                                                        childRowClassName
                                                    )}
                                                >
                                                    {renderChildRow?.(row.original)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className='min-h-16 text-center'>
                                    {emptyState}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {table
                        .getFooterGroups()
                        .map((group) => group.headers.map((header) => header.column.columnDef.footer))
                        .flat()
                        .filter(Boolean).length !== 0 && (
                        <TableFooter>
                            {table.getFooterGroups().map((footerGroup) => (
                                <TableRow key={footerGroup.id}>
                                    {footerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.footer, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableFooter>
                    )}
                </TableUI>
            </div>
        </div>
    );
}

export default DataTable;
