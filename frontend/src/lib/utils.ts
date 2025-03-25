import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

import {timeZoneOptions} from '@/constants/dateTime';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function separateStringOnCapital(str: string) {
    if (str.length === 0) return str;
    return str.replace(/([A-Z])/g, ' $1').trim();
}

export function sleep(seconds: number) {
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function range(start: number, end: number) {
    const length = end - start + 1;
    return Array.from({length}, (_, idx) => idx + start);
}

export function formatId(id: number, idLength: number = 6) {
    return id.toString().padStart(idLength, '0');
}

export function formatDate(date: Date) {
    const formatter = new Intl.DateTimeFormat('en-US', timeZoneOptions);

    const formatted = formatter.format(date);
    const [month, day, yearTime] = formatted.split('/');
    const [year, time] = yearTime.split(', ');

    return {
        day: `${day}/${month}/${year}`,
        time,
    };
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code',
    }).format(price);
}

export function formatEnumString(str: string) {
    return capitalize(str.replace(/-/g, ' '));
}

export function removeDiacritics(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function formatAppointmentTime(timeSlot: string) {
    const match = timeSlot.match(/a(\d+)_(\d+)/);
    if (match) {
        const startHour = match[1].padStart(2, '0');
        const endHour = match[2].padStart(2, '0');
        return `${startHour}:00 - ${endHour}:00`;
    }
    return timeSlot;
}
