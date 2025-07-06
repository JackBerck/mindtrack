import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Heart, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-teal-400">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        <p className="text-slate-600">Selamat datang kembali</p>
                    </div>

                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                        <CardHeader className="pb-4 text-center">
                            <CardTitle className="text-2xl text-slate-800">Masuk</CardTitle>
                            <CardDescription className="text-slate-600">Lanjutkan perjalanan belajar dan self-care Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            className="border-slate-200 pl-10 focus:border-emerald-400 focus:ring-emerald-400"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Masukkan password"
                                            className="border-slate-200 pr-10 pl-10 focus:border-emerald-400 focus:ring-emerald-400"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onClick={() => setData('remember', !data.remember)}
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember" className="text-slate-700">
                                            Ingat saya
                                        </Label>
                                    </div>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-emerald-600 hover:text-emerald-700 hover:underline"
                                            tabIndex={5}
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                                    disabled={processing}
                                    tabIndex={4}
                                >
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                                    tabIndex={5}
                                >
                                    Daftar sekarang
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        Dengan masuk, Anda menyetujui{' '}
                        <Link href="/terms" className="hover:underline">
                            Syarat & Ketentuan
                        </Link>{' '}
                        dan{' '}
                        <Link href="/privacy" className="hover:underline">
                            Kebijakan Privasi
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
