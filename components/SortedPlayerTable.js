import { useRef, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Image from "next/image";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import formatMoney from "../lib/formatMoney";
import { sortObjectsByProperties } from "../lib/sort";
import { Toast } from "primereact/toast";

const UPDATE_CONTRACT = gql`
  mutation UPDATE_CONTRACT(
    $id: ID!
    $destination: String!
  ) {
    updateContract(
      where: {
        id: $id
      },
      data: {
        status: $destination
      }
    ) {
      id
      status
      player {
        name
      }
    }
  }
`;

export default function SortedPlayerTable({contracts, includeActions}) {
  const toast = useRef(null);
  const menu = useRef(null);
  const [menuPlayer, setMenuPlayer] = useState(null);

  const [updateContract] = useMutation(UPDATE_CONTRACT, {
    onCompleted: ({updateContract: {id, player, status}}) => {
      toast.current.show({severity: 'success', summary: `Contract Updated`, detail: `${player.name} status is now '${status}''`});
    },
    ignoreResults: true,
  });

  const sortedContracts = sortObjectsByProperties(
    Array.from(contracts),
    [
      ['status', 'asc'],
      ['player.positionWeight', 'asc'],
      ['salary', 'desc'],
      ['years', 'desc']
    ]
  );

  const doPlayerAction = ({item, originalEvent}) => {
    const {id, player} = menuPlayer;
    const {destination} = item;
    console.log(originalEvent, player.name);
    confirmPopup({
      target: originalEvent.target,
      message: `Move ${player.name} to ${destination}?\nThis action cannot be undone.`,
      accept: async () => {
        await updateContract({
          variables: {
            "id": id,
            "destination": destination,
          }
        });
      },
      reject: () => {},
    })
  };

  const items = [
    {
      label: 'Actions',
      items: [
        {
          label: 'Waive',
          icon: 'pi pi-trash',
          destination: 'waived',
          command: doPlayerAction,
        },
        {
          label: 'Move To IR',
          icon: 'pi pi-flag',
          destination: 'ir',
          command: doPlayerAction,
        },
        {
          label: 'Promote To Active',
          icon: 'pi pi-arrow-circle-up',
          destination: 'active',
          command: doPlayerAction,
        },
        {
          label: 'Demote',
          icon: 'pi pi-arrow-circle-down',
          destination: 'dts',
          command: doPlayerAction,
        },
      ]
    }
  ];

  const playerBody = (rowData) => {
    const  { player } = rowData;
    const src = `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player?.espn_id}.png&w=96&h=70&crop=scale`;

    return (
      <>
        <Image
          src={src}
          width="48"
          height="35"
          alt={`Headshot of ${player?.name}`}
        />
        {player?.name}
      </>
    )
  }

  const playerOptions = ({player, id}) => {
    return (
      <>
        <Button
          icon="pi pi-cog"
          className="p-button-rounded p-button-text p-button-plain"
          onClick={(event) => {
            setMenuPlayer({id, player});
            menu.current.toggle(event);
          }}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </>
    )
  };

  const RowGroupHeader = (data) => (
    <div><strong>{data.status.toUpperCase()} CONTRACTS</strong></div>
  )

  return (
    <>
      <Toast ref={toast} />
      <Menu model={items} popup ref={menu} id="popup_menu" />
      <DataTable
        value={sortedContracts}
        groupRowsBy="status"
        rowGroupMode="subheader"
        rowGroupHeaderTemplate={RowGroupHeader}
        removableSort
      >
        <Column body={playerBody} header="Player"/>
        <Column field="player.team" header="Team"/>
        <Column field="player.position" sortField="player.positionWeight" sortable header="Position"/>
        <Column body={(c) => formatMoney(c.salary)} sortField="salary" sortable header="Salary"/>
        <Column field="years" header="Years" sortable/>
        <Column body={playerOptions} key="player.id" header="Actions"/>
      </DataTable>
    </>
  )
}
