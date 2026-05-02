import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

export const runtime = 'edge'; // Required for Cloudflare D1 in Next.js

export default async function AnimationPage() {
  const groups = await getPortfolioGroups('animation');
  
  return <GalleryPage title="Animations & Motion Graphics" groups={groups} />;
}
