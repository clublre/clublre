'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, TextArea } from '@heroui/react';

import { useAuthStore } from '@/stores/auth-store';
import { routes } from '@/lib/routes';

/** Formulario de solicitud de alta — paso previo al login. */
export function ApplicationForm() {
  const apply = useAuthStore((s) => s.applyForMembership);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState('');
  const [note, setNote] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim() || !zone.trim()) {
      setError('Completá nombre, email y zona para enviar la solicitud.');
      return;
    }
    setIsPending(true);
    const id = `pending-${Date.now().toString(36)}`;
    const result = await apply({
      fullName,
      email,
      zone,
      memberId: id,
    });
    if (!result.ok) {
      setIsPending(false);
      setError(result.error ?? 'No pudimos registrar la solicitud.');
      return;
    }
    // Auto-login para que la pantalla de pendiente tenga sesión.
    await signInWithEmail(email);
    setIsPending(false);
    router.push(routes.accountStatus);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <Input
        required
        name="fullName"
        placeholder="Juan Pérez"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        required
        autoComplete="email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        required
        name="zone"
        placeholder="Rosario — Pichincha"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
      />
      <TextArea
        name="note"
        placeholder="Contanos brevemente por qué te querés asociar."
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        className="font-semibold"
        isPending={isPending}
        size="lg"
        type="submit"
        variant="primary"
      >
        Enviar solicitud
      </Button>
    </form>
  );
}
