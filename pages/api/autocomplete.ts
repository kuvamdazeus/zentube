import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function middleware(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const search = new URL('http://something.com' + req.url).searchParams.get(
    'q',
  );

  if (!search)
    return res
      .status(400)
      .send('Error, please provide a valid "search" query in url!');

  const fetchRes = await fetch(
    `
    https://www.google.com/complete/search?client=hp&hl=en&sugexp=msedr&gs_rn=62&gs_ri=hp&cp=1&gs_id=9c&q=${search}&xhr=t
  `,
  );
  const data: any = await fetchRes.json();

  const suggestions: string[] = data[1].map(
    (rawSuggestion: [string, number, any]) => {
      const match = rawSuggestion[0].match(/>([a-zA-Z0-9_\-\s]+)</);
      if (match)
        return (
          rawSuggestion[0].match(/>([a-zA-Z0-9_\-\s]+)</) as RegExpMatchArray
        )[1];
    },
  );
  return res.status(200).send(suggestions.filter((suggestion) => !!suggestion));
}
