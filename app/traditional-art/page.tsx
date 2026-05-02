import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traditional Art & Crafts",
  description: "Traditional paintings made with water and acrylic colors, clay crafts, and more.",
};

export const runtime = 'edge';

export default async function TraditionalArtPage() {
  const groups = await getPortfolioGroups('traditional-art');
  
  return <GalleryPage title="Traditional Art & Crafts" groups={groups} />;
}
