import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Bad query!' });

  try {
    var url = jwt.verify(
      q as string,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    ) as string;
  } catch (err) {
    return res.status(401).json({ message: 'BRUH' });
  }

  ytdl(url).pipe(res);
}
