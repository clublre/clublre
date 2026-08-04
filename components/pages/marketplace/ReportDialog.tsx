'use client';

import { useState } from 'react';
import { Button, ListBox, Modal, Select, TextArea } from '@heroui/react';

import { type Listing, type ReportReason } from '@/data/marketplace';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useAuthStore } from '@/stores/auth-store';

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing;
}

const REASON_LABEL: Record<ReportReason, string> = {
  spam: 'Spam',
  scam: 'Posible estafa',
  prohibited: 'Artículo prohibido',
  harassment: 'Acoso',
  off_topic: 'No tiene que ver con el club',
  other: 'Otro',
};

const REASON_OPTIONS = Object.keys(REASON_LABEL) as ReportReason[];

/** Modal para reportar una publicación — dispara un evento en el
 *  store que el panel admin ve como reporte abierto. */
export function ReportDialog({
  isOpen,
  onOpenChange,
  listing,
}: ReportDialogProps) {
  const currentMember = useAuthStore((s) => s.currentMember());
  const report = useMarketplaceStore((s) => s.reportListing);
  const [reason, setReason] = useState<ReportReason>('spam');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    if (!currentMember) {
      setError('Necesitás iniciar sesión para reportar.');
      return;
    }
    setError(null);
    const result = report(listing.id, currentMember.id, reason, detail);
    if (!result.ok) {
      setError(result.error ?? 'No pudimos registrar el reporte.');
      return;
    }
    setDetail('');
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <h2 className="text-foreground text-lg font-semibold">
              Reportar publicación
            </h2>
          </Modal.Header>
          <Modal.Body className="space-y-3">
            <Select
              aria-label="Motivo"
              placeholder="Elegí un motivo"
              value={reason}
              onChange={(v) => setReason((v as ReportReason | null) ?? 'spam')}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {REASON_OPTIONS.map((r) => (
                    <ListBox.Item key={r} id={r} textValue={REASON_LABEL[r]}>
                      {REASON_LABEL[r]}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            <TextArea
              aria-label="Detalle del reporte"
              maxLength={500}
              rows={4}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
            {error ? (
              <p className="text-danger text-sm" role="alert">
                {error}
              </p>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button size="md" variant="danger" onPress={onSubmit}>
              Enviar reporte
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
