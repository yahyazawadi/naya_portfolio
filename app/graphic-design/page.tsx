import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graphic Design",
  description: "Professional graphic design portfolio of Naya Al-Khoury, featuring branding and visual assets created in Adobe Illustrator and Photoshop.",
};

export const runtime = 'edge';
export const revalidate = 0;

export default async function GraphicDesignPage() {
  const groups = await getPortfolioGroups('graphic-design');
  
  return <GalleryPage title="Graphic Design" groups={groups} />;
}
