import { useQuery } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import gql from "graphql-tag";
import { PageContent, PageHeader, ScrollableContent, StaticContent } from "../../components/Layout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import formatMoney from "../../lib/formatMoney";

const TEAMS_QUERY = gql`
  query TEAMS_QUERY {
  teams(orderBy: {
    playoffSeed: asc
  } ) {
    id
    name
    espn_id
    logo
    seed: playoffSeed
    w: wins
    l: losses
    t: ties
    pFor: pointsFor
    pAgainst: pointsAgainst
    gamesBack
    streakLength
    streakType
    totalYears
    totalSalary
    active: contractsCount(where: {
      status: {
        equals: "active"
      }
    })
    dts: contractsCount(where: {
      status: {
        equals: "dts"
      }
    })
    ir: contractsCount(where: {
      status: {
        equals: "ir"
      }
    })
    waived: contractsCount(where: {
      status: {
        equals: "waived"
      }
    })
  }
}
`;

export default function TeamsPage() {

  const {data, loading, error} = useQuery(TEAMS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error.</p>;

  const teamBody = (rowData) => {
    return (
      <>
        <Link href={`/teams/${rowData.espn_id}`}>{rowData.name}</Link>
      </>
    );
  };

  return (
    <Card style={{gridColumn: 'span 12', height: '100%'}}>
      <DataTable value={data.teams} removableSort>
        <Column field="seed" header="Rank" sortable/>
        <Column body={teamBody} header="Team"/>
        <Column body={({w,l,t}) => `${w}-${l}-${t}`} header="Record"/>
        <Column body={({pFor}) => pFor.toFixed(1)} header="Pts For" sortable sortField="pFor"/>
        <Column body={({pAgainst}) => pAgainst.toFixed(1)} header="Pts Against" sortable sortField="pAgainst"/>
        <Column body={({totalSalary}) => formatMoney(totalSalary)} header="Salary" sortField="totalSalary" sortable/>
        <Column field="totalYears" header="Years" sortable />
        <Column body={({active, dts}) => `${active} (${dts})`} header="Contracts" sortable sortField="active" />
      </DataTable>
    </Card>
  )
}
