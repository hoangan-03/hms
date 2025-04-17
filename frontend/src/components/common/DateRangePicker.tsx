// import {addDays, format} from 'date-fns';
// import {Calendar as CalendarIcon} from 'lucide-react';
// import * as React from 'react';
// import {DateRange} from 'react-day-picker';

// import {Button} from '@/components/ui/button';
// import {Calendar} from '@/components/ui/calendar';
// import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
// import {cn} from '@/lib/utils';

// interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
//     value?: DateRange;
//     onChange?: (date: DateRange) => void;
//     align?: 'start' | 'center' | 'end';
// }

// export function DateRangePicker({value, onChange, className, align = 'center', ...props}: DateRangePickerProps) {
//     const [date, setDate] = React.useState<DateRange | undefined>(value);

//     React.useEffect(() => {
//         setDate(value);
//     }, [value]);

//     const handleDateChange = (newDate: DateRange | undefined) => {
//         setDate(newDate);
//         if (onChange && newDate) {
//             onChange(newDate);
//         }
//     };

//     return (
//         <div className={cn('grid gap-2', className)} {...props}>
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <Button
//                         id='date'
//                         variant={'outline'}
//                         className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
//                     >
//                         <CalendarIcon className='mr-2 h-4 w-4' />
//                         {date?.from ? (
//                             date.to ? (
//                                 <>
//                                     {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
//                                 </>
//                             ) : (
//                                 format(date.from, 'LLL dd, y')
//                             )
//                         ) : (
//                             <span>Pick a date range</span>
//                         )}
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className='w-auto p-0' align={align}>
//                     <Calendar
//                         initialFocus
//                         mode='range'
//                         defaultMonth={date?.from}
//                         selected={date}
//                         onSelect={handleDateChange}
//                         numberOfMonths={2}
//                     />
//                 </PopoverContent>
//             </Popover>
//         </div>
//     );
// }

// export default DateRangePicker;
