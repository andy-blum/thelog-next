import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { Card } from 'primereact/card';
import SortedPlayerTable from '../../components/SortedPlayerTable.js';

const TEAM_PAGE_QUERY = gql`
  query TEAM_PAGE_QUERY($espn: Int!) {
    team(where: {
      espn_id: $espn
    }) {
      name
    }
    contracts(where: {
      team: {
        espn_id: {
          equals: $espn
        }
      }
    }) {
      id
      team {
        owner {
          id
        }
      }
      player {
        espn_id
        name
        team
        position
        positionWeight
      }
      salary
      years
      status
    }
  }
`;

export default function TeamPage(params) {
  const router = useRouter()
  const espn_id = parseInt(router.query.espn_id);

  const {data, loading, error} = useQuery(TEAM_PAGE_QUERY, {
    variables: {
      "espn": espn_id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const {
    team: {
      name: teamName
    },
    contracts
  } = data;


  return (
    <Card title={teamName} style={{gridColumn: 'span 12', height: '100%'}}>
      <SortedPlayerTable contracts={contracts} includeActions={false}/>
    </Card>
  )
}
