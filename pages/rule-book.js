import { PageHeader, PageContent, ScrollableContent } from "../components/Layout";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import marked from "marked";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";

export default function RulebookPage() {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    (async () => {
      const base = 'https://raw.githubusercontent.com/the-log/rulebook/main';
      const toc = await fetch(`${base}/table-of-contents.json`).then(resp => resp.json());

      const fetchedChapters = [];

      for (const chapter of toc) {
        const title = chapter.substr(3, chapter.length - 6).split('-').join(' ');
        const text = await fetch(`${base}/${chapter}`).then(resp => resp.text());

        fetchedChapters.push({
          title,
          text
        });
      }

      setChapters(fetchedChapters);
    })()

  }, []);

  if (chapters.length) {
    return (
      <>
      {chapters.map((section, i)=> (
        <Card key={`rule-section-${i + 1}`} id={`rule-section-${i + 1}`}>
          <ReactMarkdown plugins={[remarkGfm]}>
            {section.text}
          </ReactMarkdown>
        </Card>
      ))}
      </>
    )
  } else {
    return (
      <Card>
        <p>loading...</p>
      </Card>
    )
  }
}
