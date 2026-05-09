import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Art & Illustrations",
  description: "Explore the digital art gallery of Naya Al-Khoury, featuring illustrations created with Krita, StylusX, and Clip Studio Paint.",
};

export const runtime = 'edge';

export default async function DigitalArtPage() {
  const groups = await getPortfolioGroups('digital-art');
  
  return <GalleryPage title="Digital Art & Illustrations" groups={groups} />;
}
