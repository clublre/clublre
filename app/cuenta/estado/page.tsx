import { getCurrentMember } from '@/lib/supabase/get-member';
import { AccountStatusScreen } from '@/components/pages/account/AccountStatusScreen';

// Igual que /cuenta: server lee cookie, client resuelve mock + UI.

export default async function AccountStatusPage() {
  const supabaseMember = await getCurrentMember();
  return <AccountStatusScreen supabaseMember={supabaseMember} />;
}
