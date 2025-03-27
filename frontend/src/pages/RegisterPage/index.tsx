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
        // mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            // console.log(data);
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
            <div className='from-primary to-primary-light col-span-6 flex flex-col items-center justify-center space-y-9 bg-gradient-to-b'>
                <img src='/images/nurse-register.png' alt='Hospital image' width={425} />
                <h2 className='w-[600px] text-center text-4xl text-white'>Create Your Account</h2>
                <p className='w-[525px] text-justify text-xl text-white'>
                    Join our hospital management system to streamline patient care and administrative tasks. Register
                    now to securely manage records, appointments, and staff workflows—all in one place for an efficient
                    healthcare experience.
                </p>
            </div>
            <div className='col-span-6 flex items-center justify-center bg-slate-200 p-12'>
                <div className='mt-9 w-full space-y-10 pl-14'>
                    <div>
                        <h1 className='text-[48px]'>Register Account</h1>
                        <div className='mt-8 flex items-center space-x-2'>
                            <p className='text-718096 text-lg'>Already have an account?</p>
                            <Link to={ENUM_ROUTES.REGISTER}>
                                <p className='text-primary text-lg font-medium underline hover:brightness-110'>
                                    Sign in
                                </p>
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
                            className='h-[60px] w-full rounded-[20px]'
                            disabled={!isDirty || isSubmitting}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            Sign in
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
