import {FC, SVGProps, useEffect, useState} from 'react';

import {cn} from '@/lib/utils';

type SVGComponent = FC<SVGProps<SVGSVGElement>>;

const importIcon = async (iconName: string): Promise<SVGComponent | null> => {
    try {
        const icon = await import(`@/assets/icons/${iconName}.svg`);
        return icon.default || icon.ReactComponent;
    } catch (_error) {
        console.error(`Icon "${iconName}" not found`);
        return null;
    }
};

interface IconProps extends SVGProps<SVGSVGElement> {
    name: string;
    width?: number;
    height?: number;
}

const Icon: FC<IconProps> = ({name, width = 24, height = 24, ...props}) => {
    const [IconComponent, setIconComponent] = useState<SVGComponent | null>(null);

    useEffect(() => {
        let isMounted = true;

        importIcon(name).then((component) => {
            if (isMounted) {
                setIconComponent(() => component);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [name]);

    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent
            className={cn('text-default', props?.className)}
            {...props}
            width={width}
            height={height}
            icon-name={name}
        />
    );
};

export default Icon;
