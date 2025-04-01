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
                            className='w-full rounded-3xl bg-white font-bold text-black/[54%] hover:bg-gray-100'
                            onClick={() => onLoginOAuth(OAUTH_PROVIDER.GOOGLE)}
                            prefixIcon={<Icon name='google' />}
                        >
                            Sign In with Google
                        </Button>
                        <Button
                            className='bg-1877f2 w-full rounded-3xl font-bold text-white hover:bg-blue-500'
                            onClick={() => onLoginOAuth(OAUTH_PROVIDER.FACEBOOK)}
                            prefixIcon={<Icon name='facebook' />}
                        >
                            Sign In with Facebook
                        </Button>
                    </div>
                </div>
            </div>
            <div className='from-primary via-primary/95 to-primary-light relative col-span-6 overflow-hidden bg-gradient-to-br'>
                {/* Decorative circles */}
                <div className='absolute top-1/4 right-0 h-56 w-56 rounded-full bg-white/5 blur-xl' />
                <div className='absolute bottom-1/4 left-0 h-64 w-64 rounded-full bg-white/5 blur-xl' />

                {/* Content container */}
                <div className='relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-8 py-12 md:px-12 lg:px-16'>
                    {/* Image with animation */}
                    <div className='mb-10 w-full max-w-md'>
                        <img
                            src='/images/hospital.png'
                            alt='Hospital visualization'
                            className='animate-float h-auto w-full object-contain drop-shadow-xl'
                        />
                    </div>

                    {/* Text content with better spacing */}
                    <div className='text-center'>
                        <h2 className='mb-6 text-2xl leading-tight font-bold text-white sm:text-3xl'>
                            Enhancing Healthcare Management
                        </h2>

                        <p className='text-lg leading-relaxed text-white/90'>
                            Streamline hospital operations with our advanced management system. Improve patient care,
                            track records efficiently, and optimize workflows for a seamless healthcare experience.
                        </p>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className='absolute right-0 bottom-0 left-0'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' className='h-auto w-full'>
                        <path
                            fill='rgba(255,255,255,0.05)'
                            d='M0,64L80,80C160,96,320,128,480,122.7C640,117,800,75,960,64C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z'
                        />
                    </svg>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
