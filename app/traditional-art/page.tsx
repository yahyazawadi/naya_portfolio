import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

export const runtime = 'edge';

export default async function TraditionalArtPage() {
  const groups = await getPortfolioGroups('traditional-art');
  
  return <GalleryPage title="Traditional Art & Crafts" groups={groups} />;
}
