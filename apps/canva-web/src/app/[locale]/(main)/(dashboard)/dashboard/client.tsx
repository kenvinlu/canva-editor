"use client";

import { Button } from "@canva-web/src/components/base/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@canva-web/src/components/base/card/Card";
import { signOut } from "@canva-web/src/core/actions/session";
import { useUserStore } from "@canva-web/src/store/useUserStore";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardPageClient() {
  const t = useTranslations();
  const user = useUserStore((state) => state.userData);
  const doLogout = useUserStore((state) => state.logout);
  const router = useRouter();

  const handleSignOut = () => {
    void signOut();
    doLogout();
    router.push("/");
  };

  return (
    <div className="container grid flex-1 items-start gap-4 p-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <div className="grid gap-4 md:col-span-2 lg:col-span-1">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>My Dashboard</CardTitle>
            <CardDescription>
              Manage your account and view your information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            {user && (
              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{t("auth.email")}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email ?? "Not set"}
                  </p>
                </div>
                {user?.firstName && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("auth.firstName")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.firstName}
                    </p>
                  </div>
                )}
                {user?.lastName && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("auth.lastName")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.lastName}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("auth.twoFactorAuthentication")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.enableTotp ? "TOTP" : user?.enableOtp ? "OTP" : "None"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:col-span-2 lg:col-span-2">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>{t("auth.quickActions")}</CardTitle>
            <CardDescription>
              {t("auth.commonActions")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {t("auth.editProfile")}
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                {t("auth.signOut")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
