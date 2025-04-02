import {AxiosError} from 'axios';
import {useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Icon} from '@/components/common';
import {Button, Input, Label} from '@/components/ui';
import {IRegisterRequest} from '@/modules/auth/auth.interface';
import {AuthService} from '@/modules/auth/auth.service';
import {RegisterResolver} from '@/modules/auth/auth.validate';
import {ENUM_ROUTES} from '@/routes/routes.enum';

type FormValues = {
    username: string;
    password: string;
    confirmPassword: string;
};

function RegisterPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors, isDirty, isSubmitting},
    } = useForm<FormValues>({
        resolver: RegisterResolver,
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        reValidateMode: 'onSubmit',
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const payload: IRegisterRequest = {
                username: data.username,
                password: data.password,
            };
            await AuthService.register(payload);
            toast.success('Register successfully');
            navigate(ENUM_ROUTES.LOGIN, {replace: true});
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else toast.error('Register failed');
        }
    };

    return (
        <>
            <div className='from-primary via-primary to-primary-light relative col-span-6 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br'>
                {/* Background pattern */}
                <div className='absolute inset-0 opacity-10'>
                    <svg className='h-full w-full' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                        <pattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'>
                            <path d='M 10 0 L 0 0 0 10' fill='none' stroke='white' strokeWidth='0.5' />
                        </pattern>
                        <rect width='100%' height='100%' fill='url(#grid)' />
                    </svg>
                </div>

                {/* Content container with better spacing */}
                <div className='relative z-10 flex max-w-xl flex-col items-center space-y-10 px-8 py-12'>
                    {/* Logo icon */}

                    {/* Image with enhanced styling */}
                    <div className='relative'>
                        <div className='absolute -inset-1 rounded-full bg-white/20 blur-md' />
                        <img
                            src='/images/nurse-register.png'
                            alt='Healthcare professional'
                            width={350}
                            className='relative z-10 rounded-lg border-2 border-white/30 object-cover shadow-lg'
                        />
                    </div>

                    {/* Content with better formatting */}
                    <div className='space-y-6'>
                        <p className='text-center text-xl leading-relaxed text-white/90'>
                            Join our hospital management system to streamline patient care and administrative tasks.
                        </p>

                        {/* Feature list */}
                        <ul className='space-y-3 text-white'>
                            <li className='flex items-center'>
                                <svg
                                    className='mr-2 h-5 w-5 text-white/70'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                </svg>
                                Securely manage patient records
                            </li>
                            <li className='flex items-center'>
                                <svg
                                    className='mr-2 h-5 w-5 text-white/70'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                </svg>
                                Schedule and manage appointments
                            </li>
                            <li className='flex items-center'>
                                <svg
                                    className='mr-2 h-5 w-5 text-white/70'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                </svg>
                                Optimize healthcare workflows
                            </li>
                        </ul>
                    </div>

                    {/* Trust indicators */}
                    <div className='mt-4 flex w-3/4 items-center space-x-4 border-t border-white/20 pt-4'>
                        <div className='flex items-center'>
                            <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                                />
                            </svg>
                            <span className='ml-2 text-sm text-white/90'>Secure &amp; Private</span>
                        </div>
                        <div className='flex items-center'>
                            <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13 10V3L4 14h7v7l9-11h-7z'
                                />
                            </svg>
                            <span className='ml-2 text-sm text-white/90'>Fast Service</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-6 flex items-center justify-center bg-slate-200 p-12'>
                <div className='mt-9 w-full space-y-10 pl-14'>
                    <div>
                        <h1 className='text-[48px]'>Register Account</h1>
                        <div className='mt-8 flex items-center space-x-2'>
                            <p className='text-718096 text-lg'>Already have an account?</p>
                            <Link to={ENUM_ROUTES.LOGIN}>
                                <p className='text-primary text-lg font-medium underline hover:brightness-110'>Login</p>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
                        <div className='space-y-7'>
                            <div className='space-y-4'>
                                <Label className='text-718096 text-base'>Username</Label>
                                <Input
                                    autoComplete='username'
                                    placeholder='myusername'
                                    {...register('username')}
                                    errorMessage={errors.username?.message}
                                />
                            </div>
                            <div className='space-y-4'>
                                <Label className='text-718096 text-base'>Password</Label>
                                <Input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete='new-password'
                                    placeholder='@#*%'
                                    suffixIcon={
                                        isPasswordVisible ? (
                                            <Icon name='show-password' />
                                        ) : (
                                            <Icon name='hide-password' />
                                        )
                                    }
                                    {...register('password')}
                                    onChangePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                                    errorMessage={errors.password?.message}
                                />
                            </div>
                            <div className='space-y-4'>
                                <Label className='text-718096 text-base'>Confirm Password</Label>
                                <Input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete='new-password'
                                    placeholder='@#*%'
                                    // suffixIcon={
                                    //     isPasswordVisible ? (
                                    //         <Icon name='show-password' />
                                    //     ) : (
                                    //         <Icon name='hide-password' />
                                    //     )
                                    // }
                                    {...register('confirmPassword')}
                                    // onChangePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                                    errorMessage={errors.confirmPassword?.message}
                                />
                            </div>
                        </div>
                        <Button
                            size='md'
                            className='h-[50px] w-full rounded-[20px]'
                            disabled={!isDirty || isSubmitting}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            Register
                        </Button>
                    </form>
                    {/* <div className='space-y-6'>
                        <Separator />
                        <p>Google</p>
                        <p>Facebook</p>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
