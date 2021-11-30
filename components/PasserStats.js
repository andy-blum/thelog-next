import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function PasserStats({player}) {
  const {fullStats} = player
  console.log(fullStats);
  return (
    <DataTable value={Object.values(fullStats)}>
      <Column field="title" />
      <Column field="appliedTotal" header="Total"/>
      <Column field="appliedAverage" header="Average"/>
    </DataTable>
  )
}
