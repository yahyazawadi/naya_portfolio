import GalleryPage from '../../components/GalleryPage';
import { getPortfolioGroups } from '../actions/portfolio';

export const runtime = 'edge';

export default async function GraphicDesignPage() {
  const groups = await getPortfolioGroups('graphic-design');
  
  return <GalleryPage title="Graphic Design" groups={groups} />;
}
