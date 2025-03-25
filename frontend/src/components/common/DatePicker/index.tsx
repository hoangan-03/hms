import 'react-datepicker/dist/react-datepicker.css';

import {default as DatePickerUI} from 'react-datepicker';

interface Props {
    currentDate: Date | null;
    setCurrentDate: (date: Date | null) => void;
    minDate?: Date;
    excludeDates?: string[];
    inline?: boolean;
}

function DatePicker({currentDate, setCurrentDate, minDate, excludeDates, inline}: Props) {
    return (
        <DatePickerUI
            selected={currentDate}
            onChange={setCurrentDate}
            minDate={minDate}
            excludeDates={excludeDates?.map((date) => new Date(date))}
            className='cursor-pointer rounded-md border border-slate-300 px-2 py-1 shadow-xs'
            shouldCloseOnSelect={true}
            // filterDate={isWeekday}
            // renderCustomHeader={({date, decreaseMonth, increaseMonth, changeMonth, changeYear}) => (
            //     <div className='border-b-grey-E0E2E7 flex w-full justify-between border-b px-4 py-3'>
            //         <Button
            //             onClick={decreaseMonth}
            //             className='bg-primary-FFF5EE rounded-sm hover:opacity-60'
            //             variant='none'
            //             size='lg'
            //         >
            //             <Icon name='CaretLeft' className='text-primary-E87410' />
            //         </Button>
            //         <div className='flex w-1/2 items-center justify-center gap-2'>
            //             <DropdownMenu>
            //                 <DropdownMenuTrigger className='flex w-28 items-center justify-between px-3 py-2 select-none'>
            //                     <p className='text-black-1D1F2C font-medium'>{capitalize(MONTHS[date.getMonth()])}</p>
            //                     <Icon name='CaretDown' className='text-grey-858D9D' />
            //                 </DropdownMenuTrigger>
            //                 <DropdownMenuContent className='p-1'>
            //                     <ScrollArea className='h-60'>
            //                         {monthYear.months.map((month) => (
            //                             <DropdownMenuItem
            //                                 onClick={() => changeMonth(month)}
            //                                 className={cn(
            //                                     'hover:bg-grey-E0E2E7',
            //                                     month === date.getMonth() ? 'bg-grey-F0F1F3' : 'bg-white'
            //                                 )}
            //                                 key={month}
            //                             >
            //                                 {capitalize(MONTHS[month])}
            //                             </DropdownMenuItem>
            //                         ))}
            //                     </ScrollArea>
            //                 </DropdownMenuContent>
            //             </DropdownMenu>
            //             <DropdownMenu>
            //                 <DropdownMenuTrigger className='flex w-28 items-center justify-between px-3 py-2 select-none'>
            //                     <p className='text-black-1D1F2C font-medium'>{date.getFullYear()}</p>
            //                     <Icon name='CaretDown' className='text-grey-858D9D' />
            //                 </DropdownMenuTrigger>
            //                 <DropdownMenuContent className='p-1'>
            //                     <ScrollArea className='h-60'>
            //                         {monthYear.years.map((year) => (
            //                             <DropdownMenuItem
            //                                 onClick={() => changeYear(year)}
            //                                 className={cn(
            //                                     'hover:bg-grey-E0E2E7',
            //                                     year === date.getFullYear() ? 'bg-grey-F0F1F3' : 'bg-white'
            //                                 )}
            //                                 key={year}
            //                             >
            //                                 {year}
            //                             </DropdownMenuItem>
            //                         ))}
            //                     </ScrollArea>
            //                 </DropdownMenuContent>
            //             </DropdownMenu>
            //         </div>
            //         <Button
            //             onClick={increaseMonth}
            //             className='bg-primary-FFF5EE rounded-sm hover:opacity-60'
            //             variant='none'
            //             size='lg'
            //         >
            //             <Icon name='CaretRight' className='text-primary-E87410' />
            //         </Button>
            //     </div>
            // )}
            inline={inline}
        />
    );
}

export default DatePicker;
