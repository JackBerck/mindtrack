import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, Eye, EyeOff, Heart, LoaderCircle, Lock } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => setPasswordReset(true),
        });
    };

    // Success state setelah password berhasil direset
    if (passwordReset) {
        return (
            <>
                <Head title="Password Berhasil Direset" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
                    <div className="w-full max-w-md">
                        <Card className="border-0 bg-white/80 text-center shadow-xl backdrop-blur-sm">
                            <CardContent className="pt-8 pb-8">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-400">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-slate-800">Password Berhasil Direset!</h2>
                                <p className="mb-6 text-slate-600">
                                    Password Anda telah berhasil diperbarui. Sekarang Anda dapat masuk dengan password baru.
                                </p>
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                    <Link href={route('login')}>Masuk Sekarang</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Reset Password" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-400">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        <p className="text-slate-600">Buat password baru</p>
                    </div>

                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                        <CardHeader className="pb-4 text-center">
                            <CardTitle className="text-2xl text-slate-800">Reset Password</CardTitle>
                            <CardDescription className="text-slate-600">Masukkan password baru yang kuat untuk akun Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                {/* Hidden email field for form submission */}
                                <input type="hidden" name="email" value={data.email} />
                                <input type="hidden" name="token" value={data.token} />

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700">
                                        Password Baru
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Minimal 8 karakter"
                                            className="border-slate-200 pr-10 pl-10 focus:border-green-400 focus:ring-green-400"
                                            required
                                            autoFocus
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
                                            placeholder="Ulangi password baru"
                                            className="border-slate-200 pr-10 pl-10 focus:border-green-400 focus:ring-green-400"
                                            required
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

                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs text-slate-600">Password harus mengandung minimal:</p>
                                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                                        <li>• 8 karakter</li>
                                        <li>• 1 huruf besar dan kecil</li>
                                        <li>• 1 angka</li>
                                    </ul>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Memproses...' : 'Reset Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
