import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Heart, LoaderCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    // Jika email sudah terkirim (status success)
    if (status) {
        return (
            <>
                <Head title="Email Terkirim" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                    <div className="w-full max-w-md">
                        <Card className="border-0 bg-white/80 text-center shadow-xl backdrop-blur-sm">
                            <CardContent className="pt-8 pb-8">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-400">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-slate-800">Email Terkirim!</h2>
                                <p className="mb-6 text-slate-600">
                                    Kami telah mengirimkan link reset password ke <strong>{data.email}</strong>. Silakan cek email Anda dan ikuti
                                    instruksi untuk reset password.
                                </p>
                                <div className="space-y-3">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    >
                                        <Link href={route('login')}>Kembali ke Login</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="w-full border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        Kirim Ulang Email
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Lupa Password" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-indigo-400">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        <p className="text-slate-600">Reset password Anda</p>
                    </div>

                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                        <CardHeader className="pb-4 text-center">
                            <CardTitle className="text-2xl text-slate-800">Lupa Password</CardTitle>
                            <CardDescription className="text-slate-600">
                                Masukkan email Anda dan kami akan mengirimkan link untuk reset password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="border-slate-200 pl-10 focus:border-blue-400 focus:ring-blue-400"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            disabled={processing}
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href={route('login')} className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
