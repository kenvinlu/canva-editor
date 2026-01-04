import { Button } from '@canva-web/src/components/base/button/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@canva-web/src/components/base/card/Card';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';

import {
  useCommonStore,
  FETCH_CURRENT_USER_LOADING,
} from '@canva-web/src/store/useCommonStore';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Switch } from '@canva-web/src/components/base/switch/Switch';
import {
  enableTwoFactor,
  disableTwoFactor,
  enableOTP,
  generateTotpData,
  disableOTP,
  validateTotp,
} from '@canva-web/src/services/auth.service';
import TwoFactorAppSetup from '@canva-web/src/components/TwoFactorAppSetup';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { UserModel } from '@canva-web/src/models/user.model';

function SecurityProfileCard({ user }: { user?: UserModel | null }) {
  const t = useTranslations();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [secret, setSecret] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    null | 'enableTOTP' | 'disableTOTP' | 'enableOTP' | 'disableOTP'
  >(null);
  const [dialogPassword, setDialogPassword] = useState('');

  const updateUser = useUserStore((state) => state.updateUser);
  const isUserLoading = useCommonStore((state) =>
    state.isLoading(FETCH_CURRENT_USER_LOADING)
  );
  useEffect(() => {
    if (user?.enableTotp) {
      const checkSetupTotp = async () => {
        const result = await validateTotp();
        if (result?.data?.url && result?.data?.secret) {
          setQrCodeData(result?.data?.url);
          setSecret(result?.data?.secret);
          setShowQrCode(true);
          setMessage(t('auth.scanQRCode'));
        }
      };
      checkSetupTotp();
    }
  }, [user]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  const handleEnableTwoFactor = async () => {
    setPendingAction('enableTOTP');
    setShowConfirmDialog(true);
  };

  const performEnableTwoFactor = async () => {
    if (!dialogPassword) {
      setError(t('auth.passwordRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const totp = await generateTotpData();
      if (!totp?.data || totp.error) {
        setError(t('auth.totpGenerationFailed'));
        setLoading(false);
        return;
      }

      const result = await enableTwoFactor(dialogPassword, totp.data.secret);
      if (result?.data?.success) {
        setQrCodeData(totp.data.url);
        setSecret(totp.data.secret);
        setShowQrCode(true);
        setMessage(t('auth.scanQRCode'));
        setError('');
      } else {
        setError(
          result?.error?.message
            ? t(result?.error?.message)
            : t('auth.twoFactorEnableFailed')
        );
      }
    } catch (err) {
      setError(t('auth.twoFactorEnableFailed'));
      console.error(err);
    } finally {
      setLoading(false);
      setDialogPassword('');
    }
  };

  const handleDisableTwoFactor = async () => {
    setPendingAction('disableTOTP');
    setShowConfirmDialog(true);
  };

  const performDisableTwoFactor = async () => {
    if (!dialogPassword) {
      setError(t('auth.passwordRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await disableTwoFactor(dialogPassword);
      if (result?.data?.success) {
        setMessage(t('auth.twoFactorDisabled'));
        setError('');
        setShowQrCode(false);
        setSecret('');
        setQrCodeData('');
        updateUser({
          enableTotp: false,
          enableOtp: false,
          totpSecret: null,
        });
      } else {
        setError(
          result?.error?.message
            ? t(result?.error?.message)
            : t('auth.twoFactorDisableFailed')
        );
      }
    } catch (err) {
      setError(t('auth.twoFactorDisableFailed'));
      console.error(err);
    } finally {
      setLoading(false);
      setDialogPassword('');
    }
  };

  const handleToggleOTP = async () => {
    setPendingAction(user?.enableOtp ? 'disableOTP' : 'enableOTP');
    setShowConfirmDialog(true);
  };

  const performEnableOTP = async () => {
    if (!dialogPassword) {
      setError(t('auth.passwordRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await enableOTP(dialogPassword);
      if (result?.data?.success) {
        setMessage(t('auth.otpEnabled'));
        setError('');
        updateUser({
          enableOtp: true,
          enableTotp: false,
          totpSecret: null,
        });
      } else {
        setError(
          result?.error?.message
            ? t(result?.error?.message)
            : t('auth.otpEnableFailed')
        );
      }
    } catch (err) {
      setError(t('auth.otpEnableFailed'));
      console.error(err);
    } finally {
      setLoading(false);
      setDialogPassword('');
    }
  };

  const performDisableOTP = async () => {
    if (!dialogPassword) {
      setError(t('auth.passwordRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await disableOTP(dialogPassword);
      if (result?.data?.success) {
        setMessage(t('auth.otpDisabled'));
        setError('');
        updateUser({
          enableOtp: false,
          enableTotp: false,
          totpSecret: null,
        });
      } else {
        setError(
          result?.error?.message
            ? t(result?.error?.message)
            : t('auth.otpDisableFailed')
        );
      }
    } catch (err) {
      setError(t('auth.otpDisableFailed'));
      console.error(err);
    } finally {
      setLoading(false);
      setDialogPassword('');
    }
  };

  const handleConfirmDialog = async () => {
    setShowConfirmDialog(false);
    if (pendingAction === 'enableTOTP') {
      await performEnableTwoFactor();
    } else if (pendingAction === 'disableTOTP') {
      await performDisableTwoFactor();
    } else if (pendingAction === 'enableOTP') {
      await performEnableOTP();
    } else if (pendingAction === 'disableOTP') {
      await performDisableOTP();
    }
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
    setDialogPassword('');
  };
  return (
    <>
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md py-4">
            <CardHeader>
              <CardTitle>{t('auth.confirmAction')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="my-4">
                {pendingAction === 'enableTOTP' && t('auth.confirmEnableTOTP')}
                {pendingAction === 'disableTOTP' &&
                  t('auth.confirmDisableTOTP')}
                {pendingAction === 'enableOTP' && t('auth.confirmEnableOTP')}
                {pendingAction === 'disableOTP' && t('auth.confirmDisableOTP')}
              </p>
              <div className="grid gap-2">
                <Label htmlFor="dialogPassword">{t('auth.password')}</Label>
                <Input
                  id="dialogPassword"
                  type="password"
                  value={dialogPassword}
                  onChange={(e) => setDialogPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <p className="text-sm text-muted-foreground">
                  {t(
                    'auth.requiredToChangeYourTwoFactorAuthenticationSettings'
                  )}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelDialog}>
                  {t('auth.cancel')}
                </Button>
                <Button onClick={handleConfirmDialog} disabled={loading}>
                  {t('auth.confirm')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showQrCode && qrCodeData && (
        <TwoFactorAppSetup
          secret={secret}
          url={qrCodeData}
          onComplete={(response) => {
            if (response?.data?.success) {
              setShowQrCode(false);
              setMessage(t('auth.twoFactorEnabled'));
              updateUser({ enableTotp: true, enableOtp: false });
            } else {
              setError(
                response?.error?.message
                  ? t(response?.error?.message)
                  : t('auth.twoFactorEnableFailed')
              );
            }
          }}
        />
      )}

      <Card className="py-4 gap-6">
        <CardHeader>
          <CardTitle>{t('auth.twoFactorAuthentication')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('auth.enableTOTP')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('auth.totpDescription')}
                </p>
              </div>
              <Switch
                checked={user?.enableTotp || false}
                onCheckedChange={
                  user?.enableTotp
                    ? handleDisableTwoFactor
                    : handleEnableTwoFactor
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('auth.enableOTP')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('auth.otpDescription')}
                </p>
              </div>
              <Switch
                checked={user?.enableOtp || false}
                onCheckedChange={handleToggleOTP}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default SecurityProfileCard;
