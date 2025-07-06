import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, Heart, Loader2, LoaderCircle, XCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VerifyEmail({ status }: { status?: string }) {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [isResending, setIsResending] = useState(false);

    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsResending(true);
        post(route('verification.send'), {
            onFinish: () => setIsResending(false),
        });
    };

    const handleLogout: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    // Simulate verification process when component mounts
    useEffect(() => {
        // Check if we have a verification status from URL params or other means
        const urlParams = new URLSearchParams(window.location.search);
        const verified = urlParams.get('verified');

        if (verified === 'true') {
            setVerificationStatus('success');
        } else if (verified === 'false') {
            setVerificationStatus('error');
        } else {
            // Default state - waiting for verification
            setVerificationStatus(null);
        }
    }, []);

    // Loading state during verification
    if (verificationStatus === 'loading') {
        return (
            <>
                <Head title="Memverifikasi Email" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
                    <div className="w-full max-w-md">
                        <Card className="border-0 bg-white/80 text-center shadow-xl backdrop-blur-sm">
                            <CardContent className="pt-8 pb-8">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-slate-800">Memverifikasi Email...</h2>
                                <p className="text-slate-600">Mohon tunggu sebentar, kami sedang memverifikasi email Anda.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    // Success state
    if (verificationStatus === 'success') {
        return (
            <>
                <Head title="Email Terverifikasi" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-400">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        </div>

                        <Card className="border-0 bg-white/80 text-center shadow-xl backdrop-blur-sm">
                            <CardContent className="pt-8 pb-8">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-400">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-slate-800">Email Terverifikasi!</h2>
                                <p className="mb-6 text-slate-600">
                                    Selamat! Email Anda telah berhasil diverifikasi. Sekarang Anda dapat mengakses semua fitur MindTrack.
                                </p>
                                <div className="space-y-3">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    >
                                        <Link href={route('dashboard')}>Mulai Perjalanan</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50"
                                    >
                                        <Link href={route('login')}>Masuk ke Akun</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    // Error state
    if (verificationStatus === 'error') {
        return (
            <>
                <Head title="Verifikasi Gagal" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-rose-400">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        </div>

                        <Card className="border-0 bg-white/80 text-center shadow-xl backdrop-blur-sm">
                            <CardContent className="pt-8 pb-8">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-rose-400">
                                    <XCircle className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-slate-800">Verifikasi Gagal</h2>
                                <p className="mb-6 text-slate-600">
                                    Maaf, link verifikasi tidak valid atau sudah kedaluwarsa. Silakan minta link verifikasi baru.
                                </p>
                                <div className="space-y-3">
                                    <Button
                                        onClick={submit}
                                        disabled={isResending}
                                        className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                                    >
                                        {isResending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        {isResending ? 'Mengirim...' : 'Kirim Ulang Email'}
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50"
                                    >
                                        <Link href={route('login')}>Kembali ke Login</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    // Default state - waiting for verification
    return (
        <>
            <Head title="Verifikasi Email" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-800">MindTrack</h1>
                        <p className="text-slate-600">Verifikasi email Anda</p>
                    </div>

                    <Card className="border-0 bg-white/80 text-center shadow-xl backdrop-blur-sm">
                        <CardContent className="pt-8 pb-8">
                            <h2 className="mb-4 text-2xl font-bold text-slate-800">Cek Email Anda</h2>
                            <p className="mb-6 text-slate-600">
                                Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek inbox dan klik link tersebut untuk memverifikasi
                                akun.
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                                    <p className="text-sm">Link verifikasi baru telah dikirim ke email Anda.</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button
                                    onClick={submit}
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Mengirim...' : 'Kirim Ulang Email'}
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50"
                                >
                                    Keluar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
