import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traditional Art & Crafts",
  description: "A showcase of traditional art by Naya Al-Khoury, including water and acrylic paintings, clay sculptures, and handmade crafts.",
};

export const runtime = 'edge';
export const revalidate = 0;

export default async function TraditionalArtPage() {
  const groups = await getPortfolioGroups('traditional-art');
  
  return <GalleryPage title="Traditional Art & Crafts" groups={groups} />;
}
