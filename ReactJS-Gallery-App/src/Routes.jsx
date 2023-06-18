import S3PhotoGallery from "./S3PhotoGallery";
import S3ImageUploader from "./S3ImageUploader";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<S3PhotoGallery />}>
      <Route path="upload" element={<S3ImageUploader />} />
    </Route>
  )
);
