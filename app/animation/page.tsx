import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animations & Motion Graphics",
  description: "Animation and motion graphics portfolio of Naya Al-Khoury. Featuring projects created with Krita, Adobe Animate, and After Effects.",
};

export const runtime = 'edge';

export default async function AnimationPage() {
  const groups = await getPortfolioGroups('animation');
  
  return <GalleryPage title="Animations & Motion Graphics" groups={groups} />;
}
