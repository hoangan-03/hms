import {cva, VariantProps} from 'class-variance-authority';
import {motion} from 'framer-motion';

import {cn} from '@/lib/utils';

export const spinnerVariants = cva('rounded-full border-2', {
    variants: {
        variant: {
            primary: 'border-white border-t-primary',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
    width?: number;
    height?: number;
    blur?: boolean;
    className?: string;
}

const Spinner = ({variant, width = 20, height = 20, blur = false, className}: SpinnerProps) => {
    return (
        <motion.div
            className={cn(spinnerVariants({variant, className}), blur ? 'opacity-30' : '')}
            animate={{rotate: 360}}
            transition={{repeat: Infinity, duration: 1, ease: 'linear'}}
            style={{width, height}}
        />
    );
};

export default Spinner;
