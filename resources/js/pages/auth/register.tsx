import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Heart, Lock, Mail, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!agreedToTerms) return;
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-pink-400">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        <p className="text-slate-600">Mulai perjalanan self-care Anda</p>
                    </div>

                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                        <CardHeader className="pb-4 text-center">
                            <CardTitle className="text-2xl text-slate-800">Daftar</CardTitle>
                            <CardDescription className="text-slate-600">Bergabunglah dengan komunitas yang peduli kesehatan mental</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-700">
                                        Nama Lengkap
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Masukkan nama lengkap"
                                            className="border-slate-200 pl-10 focus:border-rose-400 focus:ring-rose-400"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

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
                                            className="border-slate-200 pl-10 focus:border-rose-400 focus:ring-rose-400"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
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
                                            placeholder="Minimal 8 karakter"
                                            className="border-slate-200 pr-10 pl-10 focus:border-rose-400 focus:ring-rose-400"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
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

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-slate-700">
                                        Konfirmasi Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Ulangi password"
                                            className="border-slate-200 pr-10 pl-10 focus:border-rose-400 focus:ring-rose-400"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                    />
                                    <Label htmlFor="terms" className="text-sm text-slate-600">
                                        Saya menyetujui{' '}
                                        <Link href="/terms" className="text-rose-600 hover:underline">
                                            Syarat & Ketentuan
                                        </Link>{' '}
                                        dan{' '}
                                        <Link href="/privacy" className="text-rose-600 hover:underline">
                                            Kebijakan Privasi
                                        </Link>
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                                    disabled={processing || !agreedToTerms}
                                    tabIndex={5}
                                >
                                    {processing ? 'Memproses...' : 'Daftar'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="font-medium text-rose-600 hover:text-rose-700 hover:underline" tabIndex={6}>
                                    Masuk di sini
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
