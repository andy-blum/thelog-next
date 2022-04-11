import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';
import { useUser } from '../lib/useUser';
import { gql, useMutation } from '@apollo/client';

const NEW_BID = gql`
  mutation NEW_BID(
    $player_id: Int!
    $team_id: Int!
    $salary: Int!
    $years: Int!
    $is_dts: Boolean!
	) {
  createBid(data: {
    player: {
      connect: {
        espn_id: $player_id
      }
    }
    team: {
      connect: {
        espn_id: $team_id
      }
    }
    salary: $salary
    years: $years
    is_dts: $is_dts
  }) {
    id
  }
}
`

export default function CreateBidForm({player}) {
  const [formVisible, setFormVisible] = useState(false);
  const [bidSalary, setBidSalary] = useState(1);
  const [bidYears, setBidYears] = useState(1);
  const [isDTS, setIsDTS] = useState(false);

  const user = useUser();

  const [createBid] = useMutation(NEW_BID, {
    onCompleted: (data) => {
      console.log(data);
    },
    ignoreResults: true,
  });

  const formSubmit = async (e) => {
    e.preventDefault();

    await createBid({
      variables: {
        player_id: player.espn_id,
        team_id: user.team.espn_id,
        salary: bidSalary * 100,
        years: bidYears,
        is_dts: isDTS
      }
    });

    setFormVisible(false);
  }

  return (
    <>
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-outlined"
        onClick={() => {setFormVisible(true)}}
      />
      <Dialog
        header={`Bidding on ${player.name} (${player.position}, ${player.team})`}
        visible={formVisible}
        style={{ width: '50vw' }}
        onHide={() => setFormVisible(false)}
      >
        <form className="pt-4" onSubmit={formSubmit}>
          <input type="hidden" name="player_id" value={player.espn_id} />
          <div className="p-formgrid p-grid">
            { player.isRookie
              ? <div className='field grid'>
                  <label className="col-3" htmlFor="is-dts">Sign to DTS</label>
                  <Checkbox
                    inputId='is-dts'
                    checked={isDTS}
                    onChange={e => {
                      setIsDTS(e.checked);
                      if (e.checked && bidSalary < 5) {
                        setBidSalary(5);
                      }
                    }}
                  />
                </div>
              : ''
            }
            <div className='field grid'>
              <label className="col-3" htmlFor="bid-salary">Proposed Salary</label>
              <InputNumber
                inputId="bid-salary"
                showButtons
                mode="decimal"
                step={1}
                prefix="$"
                min={isDTS ? 5 : 1}
                max={1000}
                value={bidSalary}
                onValueChange={(e) => setBidSalary(e.value)}
              />
            </div>
            <div className='field grid'>
              <label className="col-3" htmlFor="bid-years">Proposed Term</label>
              <InputNumber
                inputId="bid-years"
                showButtons
                mode="decimal"
                step={1}
                suffix=" yr"
                value={isDTS ? 3 : bidYears}
                min={isDTS ? 3 : 1}
                max={isDTS ? 3 : 100}
                onValueChange={(e) => {setBidYears(e.value)}}
              />
            </div>
            <div className="mt-5">
              <Button label="Submit" className='p-button-success mr-2' icon="pi pi-check" type='submit'/>
              <Button label="Cancel" className='p-button-warning' icon="pi pi-times" onClick={() => setFormVisible(false)}/>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}
