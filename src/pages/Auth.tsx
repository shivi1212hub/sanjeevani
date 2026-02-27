import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { User, Shield, ArrowLeft, Mail, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: t("auth.loginSuccess") });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);
          const isWarrior = roles?.some((r: any) => r.role === "warrior");
          navigate(isWarrior ? "/warrior-dashboard" : "/patient-dashboard");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: t("auth.signupSuccess"),
          description: t("auth.checkEmail"),
        });
      }
    } catch (error: any) {
      toast({ title: t("auth.error"), description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: t("auth.error"), description: String(error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between p-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("auth.backHome")}
        </Button>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elevated border-border">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={sanjeevaniLogo} alt="Sanjeevani" className="h-16 w-16 rounded-xl" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isLogin ? t("auth.loginTitle") : t("auth.signupTitle")}
            </CardTitle>
            <CardDescription>
              {isLogin ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In */}
            <Button
              variant="outline"
              className="w-full gap-3 mb-4"
              onClick={handleGoogleSignIn}
              type="button"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("auth.googleSignIn")}
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t("auth.orEmail")}</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("auth.fullName")}</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("auth.fullNamePlaceholder")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("auth.email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("auth.password")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? t("auth.loading") : isLogin ? t("auth.login") : t("auth.signup")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-center">
                <User className="h-8 w-8 mx-auto text-primary mb-1" />
                <p className="text-xs font-semibold text-foreground">{t("auth.patientRole")}</p>
                <p className="text-xs text-muted-foreground">{t("auth.patientRoleDesc")}</p>
              </div>
              <div className="p-3 rounded-lg border border-secondary/20 bg-secondary/5 text-center">
                <Shield className="h-8 w-8 mx-auto text-secondary mb-1" />
                <p className="text-xs font-semibold text-foreground">{t("auth.warriorRole")}</p>
                <p className="text-xs text-muted-foreground">{t("auth.warriorRoleDesc")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
