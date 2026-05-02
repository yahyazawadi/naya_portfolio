import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

export const runtime = 'edge';

export default async function DigitalArtPage() {
  const groups = await getPortfolioGroups('digital-art');
  
  return <GalleryPage title="Digital Art & Illustrations" groups={groups} />;
}
