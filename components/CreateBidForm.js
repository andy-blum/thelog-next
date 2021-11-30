import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function CreateBidForm({player}) {
  const [formVisible, setFormVisible] = useState(false);

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
        <em>There will eventually be a form here</em>
      </Dialog>
    </>
  )
}
