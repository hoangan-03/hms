import {useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';

import {Icon} from '@/components/common';
import {Button, Checkbox, Input, Label, Separator} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {OAUTH_PROVIDER} from '@/modules/auth/auth.enum';
import {ILoginRequest} from '@/modules/auth/auth.interface';
import {LoginResolver} from '@/modules/auth/auth.validate';
import {ENUM_ROUTES} from '@/routes/routes.enum';

type FormValues = ILoginRequest;

function LoginPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const {onLogin, onLoginOAuth} = useAuthContext();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<FormValues>({
        resolver: LoginResolver,
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        onLogin(data);
    };

    return (
        <>
            <div className='col-span-6 bg-slate-200 p-10'>
                <img src='/images/logo.png' alt='Logo' width={100} />
                <div className='mt-6 space-y-4 pl-14'>
                    <div>
                        <h1 className='text-[48px]'>Sign in</h1>
                        <div className='mt-4 flex items-center space-x-2'>
                            <p className='text-718096 text-lg'>Don't have an account?</p>
                            <Link to={ENUM_ROUTES.REGISTER}>
                                <p className='text-primary text-lg font-medium underline hover:brightness-110'>
                                    Create now
                                </p>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label className='text-718096 text-base'>Username</Label>
                                <Input
                                    autoComplete='username'
                                    placeholder='myusername'
                                    {...register('username')}
                                    errorMessage={errors.username?.message}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className='text-718096 text-base'>Password</Label>
                                <Input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete='current-password'
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
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <Checkbox />
                                <p className='text-base'>Remember me</p>
                            </div>
                        </div>
                        <Button
                            size='md'
                            className='h-[50px] w-full rounded-3xl'
                            disabled={!isDirty || isSubmitting}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            Sign in
                        </Button>
                    </form>
                    <div className='space-y-4'>
                        <Separator className='bg-black' />
                        <Button
                            className='w-full rounded-3xl bg-white font-bold text-black/[54%]'
                            onClick={() => onLoginOAuth(OAUTH_PROVIDER.GOOGLE)}
                            prefixIcon={<Icon name='google' />}
                        >
                            Sign In with Google
                        </Button>
                        <Button
                            className='bg-1877f2 w-full rounded-3xl font-bold text-white'
                            onClick={() => onLoginOAuth(OAUTH_PROVIDER.FACEBOOK)}
                            prefixIcon={<Icon name='facebook' />}
                        >
                            Sign In with Facebook
                        </Button>
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
