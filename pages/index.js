import { useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { ScrollableContent } from "../components/Layout";
import formatMoney from "../lib/formatMoney";
import { useUser } from "../lib/useUser";
import SortedPlayerTable from "../components/SortedPlayerTable";


export const MY_TEAM = gql`
  query MY_TEAM(
    $email: String!
    $teamId: ID!
  ) {
    user(where: {
      email: $email
    }) {
      name
      team {
        contracts {
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
          status
          years
        }
        abbreviation
        totalSalary
        totalYears
        totalIRContracts
        totalDTSContracts
        totalActiveContracts
        totalWaivedContracts
      }
    }
    draftPicks(
      where: {
      	owner: {
          id: {
            equals: $teamId
          }
      	}
    	}
    ) {
      id
      year
      round
      team {
        abbreviation
      }
    }
    bids(
      where: {
        team: {
          espn_id: {
            equals: 5
          }
        }
      }
    ) {
      id
      player {
        name
        position
        team
      }
      salary
      years
      is_dts
    }
  }
`;

export default function Home() {
  const toast = useRef(null);
  const [getMyTeam, {data, loading, error}] = useLazyQuery(MY_TEAM);
  const user = useUser();

  useEffect(() => {
    if (user?.email) {
      getMyTeam({
        variables: {
          email: user.email,
          teamId: user?.team?.id || null
        }
      })
    }
  }, [user, getMyTeam])


  if (error) return <p>Error!</p>
  if (!data || loading) return <p>Loading...</p>

  const {
    user: {
      team: {
        abbreviation,
        contracts,
        totalSalary,
        totalYears,
        totalIRContracts,
        totalDTSContracts,
        totalActiveContracts,
        totalWaivedContracts,
      },
    },
    draftPicks,
    bids,
  } = data

  return (
    <>
      <Card style={{gridColumn: 'span 8', gridRow: 'span 10'}} title="Contracts">
        <Toast ref={toast} />
        <SortedPlayerTable key="myTeamContracts" contracts={contracts} includeActions={true}/>
      </Card>
      <Card style={{gridColumn: 'span 4'}} title="Cap Space">
        <table style={{width:'100%', fontSize:'1.25rem'}}>
          <tr>
            <td></td>
            <th align="right">Current</th>
            <th align="right">Max</th>
          </tr>
          <tr>
            <th align="left">Salary</th>
            <td align="right">{formatMoney(totalSalary)}</td>
            <td align="right">$1000</td>
          </tr>
          <tr>
            <th align="left">Years</th>
            <td align="right">{totalYears}</td>
            <td align="right">100</td>
          </tr>
          <tr>
            <th align="left">Active</th>
            <td align="right">{totalActiveContracts}</td>
            <td align="right">40</td>
          </tr>
          <tr>
            <th align="left">DTS</th>
            <td align="right">{totalDTSContracts}</td>
            <td align="right">13</td>
          </tr>
        </table>
      </Card>
      <Card style={{gridColumn: 'span 4'}} title="Draft Picks">
        <ul>
          {draftPicks.map(pick => (
            <li key={pick.id}>
              {pick.year}.{pick.round} {pick.team.abbreviation === abbreviation ? `` : `(${pick.team.abbreviation})`}
            </li>
          ))}
        </ul>
      </Card>
      <Card style={{gridColumn: 'span 4'}} title="Pending Bids">
        <ul>
          {bids.map(bid => (
            <li key={bid.id}>
              {bid.player.name}, ${bid.salary / 100}, {bid.years}yr
            </li>
          ))}
        </ul>
      </Card>
      <Card style={{gridColumn: 'span 4'}} title="Pending Trades">
        todo
      </Card>
    </>
  )
}
