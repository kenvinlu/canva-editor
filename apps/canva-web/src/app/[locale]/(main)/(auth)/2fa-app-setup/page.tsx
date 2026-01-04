import TwoFactorAppSetup from "@canva-web/src/components/TwoFactorAppSetup";
import { generateTotpData } from "@canva-web/src/services/auth.service";

export default async function AppSetupPage() {
  const totp = await generateTotpData();
  if (!totp || !totp.data) {
    return <div>Error generating TOTP data</div>;
  }
  return <TwoFactorAppSetup secret={totp.data.secret} url={totp.data.url} onComplete={() => {
    console.log('onComplete');
  }} />;
}