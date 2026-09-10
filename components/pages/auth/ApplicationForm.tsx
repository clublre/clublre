'use client';

import { useState } from 'react';
import {
  Button,
  Description,
  FieldError,
  InputGroup,
  Label,
  TextArea,
  TextField,
} from '@heroui/react';

import { register } from '@/app/actions/auth';
import { Envelope, MapPin, User } from '@/components/ui/Icons';

// Solicitud de alta → Server Action `register` (Auth + members pending).
export function ApplicationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState('');
  const [note, setNote] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim() || !zone.trim() || !password) {
      setError('Completá nombre, email, zona y contraseña.');
      return;
    }
    setIsPending(true);
    const formData = new FormData();
    formData.set('fullName', fullName);
    formData.set('email', email);
    formData.set('zone', zone);
    formData.set('password', password);
    formData.set('confirmPassword', confirmPassword);
    formData.set('note', note);
    const result = await register(formData);
    setIsPending(false);
    if (result?.error) {
      setError(result.error);
    }
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

      <TextField fullWidth isRequired name="password">
        <Label>Contraseña</Label>
        <InputGroup fullWidth>
          <InputGroup.Input
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </TextField>

      <TextField fullWidth isRequired name="confirmPassword">
        <Label>Repetí la contraseña</Label>
        <InputGroup fullWidth>
          <InputGroup.Input
            autoComplete="new-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
