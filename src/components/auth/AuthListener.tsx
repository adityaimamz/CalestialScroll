import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AuthListener() {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Helper to handle errors from URL
        const checkError = (source: string) => {
            const params = new URLSearchParams(source.substring(1));
            const error = params.get("error");
            const errorCode = params.get("error_code");
            const errorDescription = params.get("error_description")?.replace(/\+/g, " ");

            if (error || errorCode) {
                if (errorCode === "otp_expired") {
                    toast({
                        title: "Link Kadaluarsa",
                        description: "Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.",
                        variant: "destructive",
                    });
                    navigate("/forgot-password");
                } else {
                    toast({
                        title: "Terjadi Kesalahan Login",
                        // Translate common "Unable to exchange external code" error for better UX
                        description: errorDescription?.includes("Unable to exchange external code")
                            ? "Gagal menghubungkan ke Google. Konfigurasi Client Secret mungkin salah di Supabase."
                            : (errorDescription || "Gagal memproses link autentikasi."),
                        variant: "destructive",
                    });
                }
                // Clear URL to prevent seeing it again
                window.history.replaceState(null, "", window.location.pathname);
                return true;
            }
            return false;
        };

        // Check both search (?) and hash (#)
        if (checkError(window.location.search)) return;
        if (checkError(window.location.hash)) return;

        // 2. Listen for Password Recovery specific event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                navigate("/update-password");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate, toast]);

    return null;
}
