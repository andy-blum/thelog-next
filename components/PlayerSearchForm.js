import { useState, useEffect, useRef, useCallback } from "react";
import { useLazyQuery, gql } from "@apollo/client";

import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';

const SUGGESTIONS_QUERY = gql`
  query SUGGESTED_PLAYERS(
    $name: String!
  ) {
    players(
      take: 15
      skip: 0
      orderBy: {
        overallRank: asc
      }
      where: {
        name: {
          contains: $name
        }
      }
    ) {
      id
      name
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

export default function PlayerSearchForm({formState: {formValues, setFormValues}}) {

  const [getSuggestions, {data}] = useLazyQuery(SUGGESTIONS_QUERY);

  const [suggestions, setSuggestions] = useState(null);
  const [playerNameSearch, setPlayerNameSearch] = useState(null);
  const [playerName, setPlayerName] = useState(formValues?.playerName || null);
  const [positions, setPositions] = useState(formValues?.positions || formOptions.positions);
  const [contractStatus, setContractStatus] = useState(formValues?.contractStatus || formOptions.contractStatus);

  useEffect(() => {
    setFormValues({playerName, positions, contractStatus})
  }, [playerNameSearch, positions, contractStatus]);

  useEffect(() => {
    if (data) {
      setSuggestions(data.players.map(player => ({name: player.name, code: player.id})));
    }
  }, [data])

  return (
    <form onSubmit={(e) => {e.preventDefault()}}>
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col">
          <label htmlFor="playerName" className="p-d-block">Player</label>
          <AutoComplete
            name="playerName"
            key="playerName"
            delay={750}
            value={playerName}
            suggestions={suggestions ? [{name: `${playerName}`, code: "" }, ...suggestions] : []}
            completeMethod={(e) => getSuggestions({
              variables: {
                name: e.query
              }
            })}
            field="name"
            onChange={(e) => setPlayerName(e.value)}
            onSelect={(e) => setPlayerNameSearch(e.value)}
          />
        </div>

        <div className="p-field p-col">
          <label className="p-d-block">Positions</label>
          <SelectButton
            optionLabel="name"
            name="positions"
            multiple
            value={positions}
            options={formOptions.positions}
            onChange={(e) => setPositions(e.value)}
          />
        </div>
        <div className="p-field p-col">
          <label className="p-d-block">Contract Status</label>
          <SelectButton
            optionLabel="name"
            name="contractStatus"
            multiple
            value={contractStatus}
            options={formOptions.contractStatus}
            onChange={(e) => setContractStatus(e.value)}
          />
        </div>
    </div>
    </form>
  )
}
