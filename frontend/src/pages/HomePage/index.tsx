import {Icon} from '@/components/common';
import {Badge, Button, Input} from '@/components/ui';

function HomePage() {
    return (
        <div>
            <div className='flex w-full items-center gap-4 pt-10'>
                <Button variant='primary' type='button' className=''>
                    Click me
                </Button>
                <Badge>Hi</Badge>
                <Badge variant='error'>Hi</Badge>
                <Badge variant='info'>Hi</Badge>
                <Input
                    prefixIcon={<Icon name='search' className='text-blue-700' />}
                    suffixIcon={<Icon name='search' className='text-blue-700' />}
                    placeholder='Hi there'
                />
                <Icon name='heart' className='text-blue-700' width={40} height={40} />
            </div>
        </div>
    );
}

export default HomePage;
