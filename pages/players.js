import { useEffect, useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Card } from "primereact/card";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import PlayerSearchForm from '../components/PlayerSearchForm';
import formatMoney from '../lib/formatMoney.js';
import CreateBidForm from '../components/CreateBidForm';
import PasserStats from '../components/PasserStats';
import RusherStats from '../components/RusherStats';
import ReceiverStats from '../components/ReceiverStats';
import DefenderStats from '../components/DefenderStats';

const ALL_PLAYER_QUERY = gql`
  query ALL_PLAYER_QUERY(
    $name: String!
    $contract: ContractWhereInput
    $positions: [String!]
  ) {
    players(
      orderBy: {
        overallRank: asc
      }
      take: 50
      skip: 0
      where: {
        name: {
          mode: insensitive,
          contains: $name
        }
        position: {
          in: $positions
        }
        contract: $contract,
      }
    ) {
      id
      espn_id
      name
      team
      position
      positionRank
      overallRank
      isRookie
      contract {
        salary
        years
        team {
          abbreviation
        }
      }
    }
  }
`;

const GET_DETAILS = gql`
  query GET_DETAILS($id: Int!) {
    player(
      where: {
        espn_id: $id
      }
    ) {
      id
      name
      position
      pointsLastYear
      pointsThisYear
      pointsThisYearProj
      pointsThisWeekProj
      seasonOutlook
      outlooksByWeek
      fullStats
    }
  }
`;

const formOptions = {
  positions: [
    {name: 'QB', code: 'QB'},
    {name: 'RB', code: 'RB'},
    {name: 'WR', code: 'WR'},
    {name: 'TE', code: 'TE'},
    {name: 'K', code: 'K'},
    {name: 'DE', code: 'DE'},
    {name: 'DT', code: 'DT'},
    {name: 'LB', code: 'LB'},
    {name: 'CB', code: 'CB'},
    {name: 'S', code: 'S'},
  ],
  contractStatus: [
    {name: 'Under Contract', code: 'isSigned'},
    {name: 'Free Agent', code: 'isFreeAgent'},
  ],
};

export default function PlayersPage() {
  const [expandedRows, setexpandedRows] = useState([]);
  const [formValues, setFormValues] = useState({
    playerName: "",
    positions: [],
    contractStatus: [],
  });

  const [getPlayers, {data, loading, error}] = useLazyQuery(ALL_PLAYER_QUERY);
  const [getDetails, {data: details}] = useLazyQuery(GET_DETAILS);

  useEffect(() => {
    if (formValues) {

      const name = formValues?.playerName?.name || "";

      const positions = formValues.positions.length ?
        formValues.positions.map(pos => pos.code) :
        formOptions.positions.map(pos => pos.code);


      const statusFilter = formValues.contractStatus.map(status => status.code);

      const isSigned = statusFilter.includes('isSigned');
      const isFreeAgent = statusFilter.includes('isFreeAgent');

      let contract = {};

      if (isFreeAgent && !isSigned) {
        contract = null;
      }

      if (!isFreeAgent && isSigned) {
        contract = {
          salary: {
            gt: 0
          }
        }
      }

      getPlayers({
        variables: {
          name,
          positions,
          contract
        }
      });
    }
  }, [formValues, getPlayers])

  useEffect(() => {
    if (expandedRows?.length) {
      const [player] = expandedRows
      getDetails({
        variables: {
          id: player.espn_id
        }
      })
    }
  }, [getDetails, expandedRows])

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>

  const contractCell = (data) => {
    if (data.contract !== null) {
      const {
        contract: {
          salary,
          years,
          team: {
            abbreviation
          }
        }
      } = data;

      return <>{formatMoney(salary)}, {years}, {abbreviation}</>;
    } else {
      return <CreateBidForm player={data}/>;
    }
  }

  const rowExpansionTemplate = () => {
    if (details) {
      const {player} = details;
      if ('QB' === player.position) {return <PasserStats player={player} />}
      if ('RB' === player.position) {return <RusherStats player={player} />}
      if (['WR', 'TE'].includes(player.position)) {return <ReceiverStats player={player} />}

      return <DefenderStats player={player} />

    } else {
      return 'loading...'
    }
  }

  return (
    <>
    <Card>
      <PlayerSearchForm formState={{formValues, setFormValues}} />
    </Card>
    <Card style={{gridColumn: 'span 12'}}>
      <DataTable
        key="playerSearchTable"
        value={data?.players}
        expandedRows={expandedRows}
        onRowToggle={({data}) => {
          const oldRow = expandedRows.length ? expandedRows[0] : null
          const newRow = data.filter(row => row !== oldRow)
          setexpandedRows(newRow);
        }}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column header="Player" field="name"/>
        <Column header="Team" field="team"/>
        <Column header="Position" field="position"/>
        <Column header="Pos. Rank" field="positionRank"/>
        <Column header="Ovr. Rank" field="overallRank" />
        <Column header="Contract" body={contractCell}/>
        {/* <Column expander style={{ width: '2em' }} /> */}
      </DataTable>
    </Card>
    </>
  )
}
