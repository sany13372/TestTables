import express, { Response } from 'express';
const app = express();

app.get('/', ( _: any, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server is running');
});