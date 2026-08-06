import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { seedListings, seedMembers } from '@/data/marketplace';
import { ListingDetailClient } from '@/components/pages/marketplace/ListingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = seedListings.find((l) => l.id === id);
  if (!listing) return { title: 'Publicación no encontrada' };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    robots: { index: false, follow: false },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = seedListings.find((l) => l.id === id);
  if (!listing) notFound();
  const owner = seedMembers.find((m) => m.id === listing.ownerId);

  // Detalle en client wrapper — la maqueta no usa RSC + cookies.
  // El wrapper maneja el gate de "isOwner" y los modales.
  return <ListingDetailClient listing={listing} owner={owner} />;
}
