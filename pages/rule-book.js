import { PageHeader, PageContent, ScrollableContent } from "../components/Layout";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import sectionOne from '../content/rulebook/01-league-overview';
import sectionTwo from '../content/rulebook/02-franchise-ownership';
import sectionThree from '../content/rulebook/03-initial-draft-contracts-salary-cap';
import sectionFour from '../content/rulebook/04-tanking';
import sectionFive from '../content/rulebook/05-rookie-draft';
import sectionSix from '../content/rulebook/06-rosters';
import sectionSeven from '../content/rulebook/07-developmental-taxi-squad';
import sectionEight from '../content/rulebook/08-individual-defensive-players';
import sectionNine from '../content/rulebook/09-player-contracts';
import sectionTen from '../content/rulebook/10-trading';
import sectionEleven from '../content/rulebook/11-free-agency';
import { Card } from "primereact/card";

export default function RulebookPage() {

  const sections = [
    sectionOne,
    sectionTwo,
    sectionThree,
    sectionFour,
    sectionFive,
    sectionSix,
    sectionSeven,
    sectionEight,
    sectionNine,
    sectionTen,
    sectionEleven,
  ];

  return (
    <>
      {sections.map((section, i)=> (
        <Card key={`rule-section-${i}`}>
          <ReactMarkdown plugins={[remarkGfm]}>
            {section}
          </ReactMarkdown>
        </Card>
      ))}
    </>
  )
}
