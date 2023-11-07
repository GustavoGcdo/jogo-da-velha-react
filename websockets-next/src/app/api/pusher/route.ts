import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.app_id || '',
  key: process.env.key || '',
  secret: process.env.secret || '',
  cluster: process.env.cluster || '',
  useTLS: true,
});

export async function POST(req: Request) {
  const eventData = await req.json();
  const response = await pusher.trigger('game-changes', 'game-move', {
    ...eventData,
  });

  // console.log(response.status);

  return Response.json({ message: 'completed' });
}
