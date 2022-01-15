import dynamic from 'next/dynamic';

export default function Search() {
  const SearchResults = dynamic(
    () => import('../../components/search/SearchResults'),
  );

  return (
    <section>
      <SearchResults />
    </section>
  );
}
