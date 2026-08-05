'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Description,
  FieldError,
  InputGroup,
  Label,
  TextArea,
  TextField,
} from '@heroui/react';

import { useAuthStore } from '@/stores/auth-store';
import { routes } from '@/lib/routes';
import { Envelope, MapPin, User } from '@/components/ui/Icons';

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
      <TextField fullWidth isRequired name="fullName">
        <Label>Nombre completo</Label>
        <InputGroup fullWidth>
          <InputGroup.Prefix>
            <User className="text-muted size-4" />
          </InputGroup.Prefix>
          <InputGroup.Input
            placeholder="Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </InputGroup>
      </TextField>

      <TextField fullWidth isRequired name="email">
        <Label>Email</Label>
        <InputGroup fullWidth>
          <InputGroup.Prefix>
            <Envelope className="text-muted size-4" />
          </InputGroup.Prefix>
          <InputGroup.Input
            autoComplete="email"
            placeholder="socio@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <Description>
          Te contactaremos por acá para resolver la solicitud.
        </Description>
      </TextField>

      <TextField fullWidth isRequired name="zone">
        <Label>Zona</Label>
        <InputGroup fullWidth>
          <InputGroup.Prefix>
            <MapPin className="text-muted size-4" />
          </InputGroup.Prefix>
          <InputGroup.Input
            placeholder="Rosario — Pichincha"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />
        </InputGroup>
      </TextField>

      <TextField fullWidth name="note">
        <Label>Mensaje opcional</Label>
        <TextArea
          placeholder="Contanos brevemente por qué te querés asociar."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </TextField>

      {error ? <FieldError>{error}</FieldError> : null}

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
