import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Icon} from '@/components/common';
import {Button, Input, Label, Separator} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {ILoginRequest} from '@/modules/auth/auth.interface';
import {AuthService} from '@/modules/auth/auth.service';
import {signInResolver} from '@/modules/auth/auth.validate';
import {ENUM_ROUTES} from '@/routes/routes.enum';

type FormValues = ILoginRequest;

function LoginPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<FormValues>({
        resolver: signInResolver,
        defaultValues: {
            username: '',
            password: '',
        },
    });
    const {setIsAuth, setDidClickLogout} = useAuthContext();

    const onSubmit = async () => {
        try {
            const response = await AuthService.login(payload);
            setIsAuth(true);
            setDidClickLogout(false);
            toast.success('Login successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Login failed!');
        }
    };

    return (
        <>
            <div className='col-span-6 bg-slate-200 p-12'>
                <img src='/images/logo.png' alt='Logo' width={100} />
                <div className='mt-9 space-y-10 pl-14'>
                    <div>
                        <h1 className='text-[48px]'>Sign in</h1>
                        <div className='mt-8 flex items-center space-x-2'>
                            <p className='text-718096 text-lg'>Don't have an account?</p>
                            <Link to={ENUM_ROUTES.REGISTER}>
                                <p className='text-primary text-lg font-medium underline hover:brightness-110'>
                                    Create now
                                </p>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
                        <div className='space-y-7'>
                            <div className='space-y-4'>
                                <Label className='text-718096 text-base'>Username</Label>
                                <Input autoComplete='username' placeholder='myusername' />
                            </div>
                            <div className='space-y-4'>
                                <Label className='text-718096 text-base'>Password</Label>
                                <Input placeholder='@#*%' suffixIcon={<Icon name='hide-password' />} />
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-base'>Remember me</p>
                            <Link to={'/'}>
                                <p className='text-primary text-base underline hover:brightness-110'>
                                    Forgot Password?
                                </p>
                            </Link>
                        </div>
                        <Button size='md' className='h-[60px] w-full rounded-[20px]'>
                            Sign in
                        </Button>
                    </form>
                    <div className='space-y-6'>
                        <Separator />
                        <p>Google</p>
                        <p>Facebook</p>
                    </div>
                </div>
            </div>
            <div className='from-primary to-primary-light col-span-6 flex flex-col items-center justify-center space-y-9 bg-gradient-to-b'>
                <img src='/images/hospital.png' alt='Hospital image' width={425} />
                <h2 className='w-[600px] text-4xl text-white'>Enhancing Healthcare Management</h2>
                <p className='w-[525px] text-justify text-xl text-white'>
                    Streamline hospital operations with our advanced management system. Improve patient care, track
                    records efficiently, and optimize workflows for a seamless healthcare experience.
                </p>
            </div>
        </>
    );
}

export default LoginPage;
