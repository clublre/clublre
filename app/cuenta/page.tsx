import { getCurrentMember } from '@/lib/supabase/get-member';
import { AccountScreen } from '@/components/pages/account/AccountScreen';

// Server Component: lee la cookie. La UI vive en AccountScreen (client)
// porque necesita hooks + fallback al mock. Ver docs/AUTH.md.

export default async function AccountPage() {
  const supabaseMember = await getCurrentMember();
  return <AccountScreen supabaseMember={supabaseMember} />;
}
