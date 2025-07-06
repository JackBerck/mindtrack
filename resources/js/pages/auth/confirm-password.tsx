import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Heart, LoaderCircle, Lock, Shield } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Konfirmasi Password" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-400 to-purple-400">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        <p className="text-slate-600">Konfirmasi identitas Anda</p>
                    </div>

                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                        <CardHeader className="pb-4 text-center">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-100 to-purple-100">
                                <Shield className="h-6 w-6 text-violet-600" />
                            </div>
                            <CardTitle className="text-2xl text-slate-800">Konfirmasi Password</CardTitle>
                            <CardDescription className="text-slate-600">Untuk keamanan, masukkan password Anda untuk melanjutkan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700">
                                        Password Saat Ini
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Masukkan password Anda"
                                            className="border-slate-200 pr-10 pl-10 focus:border-violet-400 focus:ring-violet-400"
                                            required
                                            autoFocus
                                            autoComplete="current-password"
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

                                <div className="rounded-lg border border-violet-100 bg-violet-50 p-3">
                                    <p className="flex items-center text-sm text-violet-700">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Kami meminta konfirmasi untuk melindungi akun Anda
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Memverifikasi...' : 'Konfirmasi'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href={route('password.request')} className="text-sm text-violet-600 hover:text-violet-700 hover:underline">
                                    Lupa password?
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        <Link href={route('dashboard')} className="hover:underline">
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
