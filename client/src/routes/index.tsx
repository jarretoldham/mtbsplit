import { createFileRoute } from '@tanstack/react-router';
import FitFileUploader from '../components/FitFileUploader';
import SimpleMap from '../components/SimpleMap';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <FitFileUploader />
      <hr />
      <SimpleMap style="street" center={[-74.5, 40]} zoom={10} />
    </>
  );
}
