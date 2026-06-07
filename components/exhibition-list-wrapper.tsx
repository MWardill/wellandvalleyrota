import { listExhibitions } from "@/lib/exhibitions";
import ExhibitionList from "./exhibition-list";

export default async function ExhibitionListWrapper() {
  const exhibitions = await listExhibitions();
  return <ExhibitionList exhibitions={exhibitions} />;
}
