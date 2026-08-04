'use client';

// Store del marketplace para la maqueta. Mantiene publicaciones,
// reportes y auditoría en memoria del cliente. En producción esto
// se reemplaza por queries a Supabase desde Server Components.

import { create } from 'zustand';

import {
  type Listing,
  type Report,
  type AuditEntry,
  type ListingStatus,
  type ReportReason,
  seedListings,
  seedReports,
  seedAudit,
} from '@/data/marketplace';

export interface NewListingInput {
  ownerId: string;
  type: Listing['type'];
  title: string;
  description: string;
  categoryId: string;
  condition: Listing['condition'];
  priceMode: Listing['priceMode'];
  price: number | null;
  zone: string;
  contactPreference: Listing['contactPreference'];
  contactHandle: string;
}

export interface MarketplaceState {
  listings: ReadonlyArray<Listing>;
  reports: ReadonlyArray<Report>;
  audit: ReadonlyArray<AuditEntry>;

  /** Helpers para los componentes. */
  listingById: (id: string) => Listing | undefined;
  listingsByOwner: (ownerId: string) => ReadonlyArray<Listing>;
  reportsByStatus: (status: Report['status']) => ReadonlyArray<Report>;

  /** Acciones. */
  createListing: (
    input: NewListingInput,
    actorId: string,
  ) => { ok: true; id: string } | { ok: false; error: string };
  updateListing: (
    id: string,
    patch: Partial<Listing>,
    actorId: string,
  ) => { ok: boolean; error?: string };
  setListingStatus: (
    id: string,
    status: ListingStatus,
    actorId: string,
    note?: string,
  ) => { ok: boolean; error?: string };
  reportListing: (
    listingId: string,
    reporterId: string,
    reason: ReportReason,
    detail: string,
  ) => { ok: boolean; error?: string };
  resolveReport: (
    reportId: string,
    actorId: string,
    action: 'dismiss' | 'hide-listing',
    note: string,
  ) => { ok: boolean; error?: string };
}

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useMarketplaceStore = create<MarketplaceState>()((set, get) => ({
  listings: seedListings,
  reports: seedReports,
  audit: seedAudit,

  listingById: (id) => get().listings.find((l) => l.id === id),
  listingsByOwner: (ownerId) =>
    get().listings.filter((l) => l.ownerId === ownerId),
  reportsByStatus: (status) => get().reports.filter((r) => r.status === status),

  createListing(input, actorId) {
    const id = newId('listing');
    const now = new Date().toISOString();
    const firstListingForOwner =
      get().listings.filter((l) => l.ownerId === input.ownerId).length === 0;
    const listing: Listing = {
      id,
      ownerId: input.ownerId,
      type: input.type,
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      condition: input.condition,
      priceMode: input.priceMode,
      price: input.price,
      currency: 'ARS',
      zone: input.zone,
      contactPreference: input.contactPreference,
      contactHandle: input.contactHandle,
      status: firstListingForOwner ? 'pending_review' : 'published',
      createdAt: now,
      updatedAt: now,
      images: [],
    };
    set((s) => ({
      listings: [listing, ...s.listings],
      audit: [
        {
          id: newId('audit'),
          actorId,
          action: firstListingForOwner
            ? 'Publicó primera publicación (pendiente de revisión)'
            : 'Publicó publicación',
          targetType: 'listing',
          targetId: id,
          note: input.title,
          createdAt: now,
        },
        ...s.audit,
      ],
    }));
    return { ok: true, id };
  },

  updateListing(id, patch, actorId) {
    const now = new Date().toISOString();
    set((s) => ({
      listings: s.listings.map((l) =>
        l.id === id ? { ...l, ...patch, updatedAt: now } : l,
      ),
      audit: [
        {
          id: newId('audit'),
          actorId,
          action: 'Editó publicación',
          targetType: 'listing',
          targetId: id,
          note: '',
          createdAt: now,
        },
        ...s.audit,
      ],
    }));
    return { ok: true };
  },

  setListingStatus(id, status, actorId, note) {
    const now = new Date().toISOString();
    set((s) => ({
      listings: s.listings.map((l) =>
        l.id === id ? { ...l, status, updatedAt: now } : l,
      ),
      audit: [
        {
          id: newId('audit'),
          actorId,
          action: `Cambió estado de publicación a ${status}`,
          targetType: 'listing',
          targetId: id,
          note: note ?? '',
          createdAt: now,
        },
        ...s.audit,
      ],
    }));
    return { ok: true };
  },

  reportListing(listingId, reporterId, reason, detail) {
    const id = newId('report');
    const now = new Date().toISOString();
    set((s) => ({
      reports: [
        {
          id,
          listingId,
          reporterId,
          reason,
          detail,
          status: 'open',
          createdAt: now,
        },
        ...s.reports,
      ],
      audit: [
        {
          id: newId('audit'),
          actorId: reporterId,
          action: 'Reportó publicación',
          targetType: 'report',
          targetId: id,
          note: reason,
          createdAt: now,
        },
        ...s.audit,
      ],
    }));
    return { ok: true };
  },

  resolveReport(reportId, actorId, action, note) {
    const now = new Date().toISOString();
    const report = get().reports.find((r) => r.id === reportId);
    if (!report) return { ok: false, error: 'Reporte no encontrado' };
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'resolved' as const,
              resolutionNote: note,
            }
          : r,
      ),
      listings:
        action === 'hide-listing'
          ? s.listings.map((l) =>
              l.id === report.listingId
                ? { ...l, status: 'rejected' as ListingStatus }
                : l,
            )
          : s.listings,
      audit: [
        {
          id: newId('audit'),
          actorId,
          action:
            action === 'hide-listing'
              ? 'Ocultó publicación tras reporte'
              : 'Desestimó reporte',
          targetType: 'report',
          targetId: reportId,
          note,
          createdAt: now,
        },
        ...s.audit,
      ],
    }));
    return { ok: true };
  },
}));
