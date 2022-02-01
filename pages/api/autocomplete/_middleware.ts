export default async function middleware(req: any) {
  const search = new URL('http://something.com' + req.url).searchParams.get(
    'q',
  );

  if (!search)
    return new Response(
      'Error, please provide a valid "search" query in url!',
      { status: 400 },
    );

  const res = await fetch(
    `
    https://www.google.com/complete/search?client=hp&hl=en&sugexp=msedr&gs_rn=62&gs_ri=hp&cp=1&gs_id=9c&q=${search}&xhr=t
  `,
  );
  console.log(res);
  const data = await res.json();

  const suggestions: string[] = data[1].map(
    (rawSuggestion: [string, number, any]) => {
      const match = rawSuggestion[0].match(/>([a-zA-Z0-9_\-\s]+)</);
      if (match)
        return (
          rawSuggestion[0].match(/>([a-zA-Z0-9_\-\s]+)</) as RegExpMatchArray
        )[1];
    },
  );
  return new Response(
    JSON.stringify(suggestions.filter((suggestion) => !!suggestion)),
  );
}
