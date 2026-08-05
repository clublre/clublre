'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField,
} from '@heroui/react';

import { useAuthStore } from '@/stores/auth-store';
import { routes } from '@/lib/routes';
import { Envelope } from '@/components/ui/Icons';

/** Formulario de login mockeado — Google OAuth simulado y email. */
export function LoginForm() {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    router.push(routes.account);
  };

  const onGoogle = async () => {
    setError(null);
    setIsPending(true);
    const result = await signInWithGoogle();
    setIsPending(false);
    if (!result.ok) {
      setError(result.error ?? 'No pudimos iniciar sesión.');
      return;
    }
    handleSuccess();
  };

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const result = await signInWithEmail(email);
    setIsPending(false);
    if (!result.ok) {
      setError(result.error ?? 'No pudimos iniciar sesión.');
      return;
    }
    handleSuccess();
  };

  return (
    <div className="flex flex-col gap-5">
      <Button
        className="font-semibold"
        isPending={isPending}
        size="lg"
        type="button"
        variant="outline"
        onPress={onGoogle}
      >
        Continuar con Google
      </Button>

      <div className="flex items-center gap-3 text-xs tracking-wider uppercase">
        <span aria-hidden="true" className="bg-default-200/60 h-px grow" />
        <span className="text-default-500">o con email</span>
        <span aria-hidden="true" className="bg-default-200/60 h-px grow" />
      </div>

      <form className="flex flex-col gap-3" onSubmit={onEmail}>
        <TextField isRequired fullWidth isDisabled={isPending} name="email">
          <Label>Email</Label>
          <InputGroup fullWidth>
            <InputGroup.Prefix>
              <Envelope className="text-muted size-4" />
            </InputGroup.Prefix>
            <InputGroup.Input
              autoComplete="email"
              placeholder="socio@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        </TextField>
        {error ? <FieldError>{error}</FieldError> : null}
        <Button
          className="font-semibold"
          isPending={isPending}
          size="lg"
          type="submit"
          variant="primary"
        >
          Continuar con email
        </Button>
      </form>

      <p className="text-default-500 text-xs">
        Maqueta: usá cualquier email sembrado (ej.{' '}
        <code className="text-default-700">juan.perez@example.com</code>) o
        Google simulado.
      </p>
    </div>
  );
}
