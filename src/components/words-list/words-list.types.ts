export interface WordsListProps {
  words: string[];
  onDelete?(index: number): void
}
