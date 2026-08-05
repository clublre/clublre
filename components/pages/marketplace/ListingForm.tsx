'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';

import {
  type Listing,
  type ListingType,
  type PriceMode,
  type ListingCondition,
  categories,
} from '@/data/marketplace';
import { useAuthStore } from '@/stores/auth-store';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { routes } from '@/lib/routes';
import { MapPin, Phone } from '@/components/ui/Icons';

interface ListingFormProps {
  /** Cuando se pasa, la página está en modo edición. */
  initial?: Listing;
}

const PRICE_MODE_LABEL: Record<PriceMode, string> = {
  fixed: 'Precio fijo',
  negotiable: 'Negociable',
  free: 'Gratis',
  contact: 'A convenir',
};

const PRICE_MODE_OPTIONS = Object.keys(PRICE_MODE_LABEL) as PriceMode[];
const CONDITION_OPTIONS: ReadonlyArray<ListingCondition> = ['new', 'used'];
const TYPE_OPTIONS: ReadonlyArray<{ id: ListingType; label: string }> = [
  { id: 'good', label: 'Bien (ropa, artículos, etc.)' },
  { id: 'service', label: 'Servicio (clases, ayuda, etc.)' },
];
const CONTACT_OPTIONS: ReadonlyArray<{
  id: Listing['contactPreference'];
  label: string;
}> = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Email' },
];

/** Formulario compartido para crear y editar publicaciones. Cuando
 *  se pasa `initial`, precarga los campos y dispara `updateListing`;
 *  si no, dispara `createListing`. */
export function ListingForm({ initial }: ListingFormProps) {
  const router = useRouter();
  const currentMember = useAuthStore((s) => s.currentMember());
  const createListing = useMarketplaceStore((s) => s.createListing);
  const updateListing = useMarketplaceStore((s) => s.updateListing);

  const [type, setType] = useState<ListingType>(initial?.type ?? 'good');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(
    initial?.categoryId ?? null,
  );
  const [condition, setCondition] = useState<ListingCondition>(
    initial?.condition ?? 'used',
  );
  const [priceMode, setPriceMode] = useState<PriceMode>(
    initial?.priceMode ?? 'fixed',
  );
  const [price, setPrice] = useState<string>(
    initial?.price !== null && initial?.price !== undefined
      ? String(initial.price)
      : '',
  );
  const [zone, setZone] = useState(initial?.zone ?? currentMember?.zone ?? '');
  const [contactPreference, setContactPreference] = useState<
    Listing['contactPreference']
  >(initial?.contactPreference ?? 'whatsapp');
  const [contactHandle, setContactHandle] = useState(
    initial?.contactHandle ?? '',
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const visibleCategories = categories.filter(
    (c) => c.type === 'both' || c.type === type,
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentMember) {
      setError('Necesitás iniciar sesión.');
      return;
    }
    if (
      !title.trim() ||
      !description.trim() ||
      !categoryId ||
      !zone.trim() ||
      !contactHandle.trim()
    ) {
      setError('Completá los campos obligatorios.');
      return;
    }
    const priceNum =
      priceMode === 'free' || priceMode === 'contact'
        ? null
        : Number.parseInt(price, 10);
    if (priceMode !== 'free' && priceMode !== 'contact') {
      if (!Number.isFinite(priceNum) || (priceNum ?? 0) <= 0) {
        setError('Ingresá un precio válido (mayor a 0).');
        return;
      }
    }
    setIsPending(true);
    if (initial) {
      const result = updateListing(
        initial.id,
        {
          type,
          title,
          description,
          categoryId,
          condition: type === 'good' ? condition : null,
          priceMode,
          price: priceNum,
          zone,
          contactPreference,
          contactHandle,
        },
        currentMember.id,
      );
      setIsPending(false);
      if (!result.ok) {
        setError(result.error ?? 'No pudimos guardar la publicación.');
        return;
      }
      router.push(routes.marketplaceItem(initial.id));
      return;
    }

    const result = createListing(
      {
        ownerId: currentMember.id,
        type,
        title,
        description,
        categoryId,
        condition: type === 'good' ? condition : null,
        priceMode,
        price: priceNum,
        zone,
        contactPreference,
        contactHandle,
      },
      currentMember.id,
    );
    setIsPending(false);
    if (!result.ok) {
      setError(result.error ?? 'No pudimos crear la publicación.');
      return;
    }
    router.push(routes.marketplaceItem(result.id));
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <Select
        aria-label="Tipo de publicación"
        placeholder="¿Qué estás publicando?"
        selectedKey={type}
        onChange={(k) => {
          setType((k as ListingType | null) ?? 'good');
          setCategoryId(null);
        }}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {TYPE_OPTIONS.map((t) => (
              <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                {t.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField isRequired fullWidth name="title">
        <Label>Título</Label>
        <Input
          placeholder="Botines de básquet talle 42 — casi nuevos"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </TextField>

      <TextField fullWidth name="description">
        <Label>Descripción</Label>
        <TextArea
          maxLength={600}
          placeholder="Contá detalles, estado, motivo de venta, etc."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </TextField>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          aria-label="Categoría"
          placeholder="Categoría"
          selectedKey={categoryId}
          onChange={(k) => setCategoryId(typeof k === 'string' ? k : null)}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {visibleCategories.map((c) => (
                <ListBox.Item key={c.id} id={c.id} textValue={c.name}>
                  {c.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        {type === 'good' && (
          <Select
            aria-label="Condición"
            placeholder="Condición"
            selectedKey={condition}
            onChange={(k) =>
              setCondition((k as ListingCondition | null) ?? 'used')
            }
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {CONDITION_OPTIONS.map((c) => (
                  <ListBox.Item
                    key={c ?? 'used'}
                    id={c ?? 'used'}
                    textValue={c === 'new' ? 'Nuevo' : 'Usado'}
                  >
                    {c === 'new' ? 'Nuevo' : 'Usado'}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          aria-label="Modalidad de precio"
          placeholder="Modalidad de precio"
          selectedKey={priceMode}
          onChange={(k) => setPriceMode((k as PriceMode | null) ?? 'fixed')}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {PRICE_MODE_OPTIONS.map((p) => (
                <ListBox.Item key={p} id={p} textValue={PRICE_MODE_LABEL[p]}>
                  {PRICE_MODE_LABEL[p]}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        {priceMode !== 'free' && priceMode !== 'contact' && (
          <TextField isRequired fullWidth name="price">
            <Label>Precio</Label>
            <InputGroup fullWidth>
              <InputGroup.Prefix>$</InputGroup.Prefix>
              <InputGroup.Input
                inputMode="numeric"
                placeholder="35000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <InputGroup.Suffix>ARS</InputGroup.Suffix>
            </InputGroup>
          </TextField>
        )}
      </div>

      <TextField isRequired fullWidth name="zone">
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

      <Select
        aria-label="Canal de contacto"
        placeholder="Canal de contacto preferido"
        selectedKey={contactPreference}
        onChange={(k) =>
          setContactPreference(
            (k as Listing['contactPreference'] | null) ?? 'whatsapp',
          )
        }
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {CONTACT_OPTIONS.map((c) => (
              <ListBox.Item key={c.id} id={c.id} textValue={c.label}>
                {c.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField isRequired fullWidth name="contactHandle">
        <Label>
          {contactPreference === 'whatsapp' ? 'Número de WhatsApp' : 'Email'}
        </Label>
        <InputGroup fullWidth>
          <InputGroup.Prefix>
            <Phone className="text-muted size-4" />
          </InputGroup.Prefix>
          <InputGroup.Input
            placeholder={
              contactPreference === 'whatsapp'
                ? '+54 9 341 555 1234'
                : 'socio@example.com'
            }
            value={contactHandle}
            onChange={(e) => setContactHandle(e.target.value)}
          />
        </InputGroup>
      </TextField>

      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button size="lg" variant="ghost" onPress={() => router.back()}>
          Cancelar
        </Button>
        <Button
          className="font-semibold"
          isPending={isPending}
          size="lg"
          type="submit"
          variant="primary"
        >
          {initial ? 'Guardar cambios' : 'Publicar'}
        </Button>
      </div>
    </form>
  );
}
