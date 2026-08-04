'use client';

import { Button, Modal } from '@heroui/react';

import { type Listing, type Member } from '@/data/marketplace';

const waLink = (handle: string, listingTitle: string) => {
  const phone = handle.replace(/[^0-9+]/g, '');
  const text = encodeURIComponent(
    `Hola, vi tu publicación "${listingTitle}" en Entre Socios.`,
  );
  return `https://wa.me/${phone.replace(/^\+/, '')}?text=${text}`;
};

const mailLink = (handle: string, listingTitle: string) => {
  const subject = encodeURIComponent(`Entre Socios — ${listingTitle}`);
  const body = encodeURIComponent(
    `Hola, vi tu publicación en el marketplace del club.`,
  );
  return `mailto:${handle}?subject=${subject}&body=${body}`;
};

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing;
  owner: Member;
}

/** Modal de contacto — explica que el club no participa del
 *  pago ni la entrega y abre WhatsApp o mail pre-poblado. */
export function ContactDialog({
  isOpen,
  onOpenChange,
  listing,
  owner,
}: ContactDialogProps) {
  const link =
    listing.contactPreference === 'whatsapp'
      ? waLink(listing.contactHandle, listing.title)
      : mailLink(listing.contactHandle, listing.title);

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <h2 className="text-foreground text-lg font-semibold">
              Contactar a {owner.fullName.split(' ')[0]}
            </h2>
          </Modal.Header>
          <Modal.Body className="space-y-3 text-sm">
            <p className="text-default-700">
              Para tu seguridad, el club no procesa el pago ni la entrega.
              Coordiná todo directamente con el dueño por el canal que eligió.
            </p>
            <p className="text-default-500 text-xs">
              Te recomendamos encontrarte en lugares públicos del club o
              verificar la identidad antes de cualquier transacción.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <a
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
              href={link}
              rel="noopener noreferrer"
              target="_blank"
            >
              Abrir {listing.contactPreference === 'whatsapp' ? 'WhatsApp' : 'email'}
            </a>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

/** Helper expuesto para que el detalle de publicación pueda armar
 *  el link directo sin tener que renderizar el modal. */
e