import { getKnowledgeChapter, getKnowledgeEntry } from '../../content/knowledge';
import { Chapter } from './Chapter';
import { Entry } from './Entry';
import { MarkingDecoder } from './MarkingDecoder';

/** Ex işaretlemesi: önce örnek bir etiket parça parça çözülür, ardından parçaların başvuru tabloları gelir. */
export function MarkingChapter() {
  const chapter = getKnowledgeChapter('marking');

  return (
    <Chapter chapter={chapter} surface="light">
      <Entry entry={getKnowledgeEntry('markingRead')}>
        <MarkingDecoder />
      </Entry>
      {chapter.entries.slice(1).map((entry) => (
        <Entry key={entry.key} entry={entry} />
      ))}
    </Chapter>
  );
}
