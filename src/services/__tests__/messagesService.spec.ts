import { messagesService, ThreadSummary, Message } from '../messagesService';

// Mock supabase client
jest.mock('../../lib/supabase', () => {
  type QueryResult = { data: any; error: any } | Promise<{ data: any; error: any }>;
  const state: any = {
    selectResult: { data: [], error: null },
    insertResult: { data: null, error: null },
    updateResult: { data: null, error: null },
  };

  const chain = () => {
    const q: any = {
      _filters: [],
      select: (_sel?: string) => q,
      or: (_exp?: string) => q,
      order: (_col?: string, _opts?: any) => q,
      limit: (_n?: number) => ({ data: state.selectResult.data, error: state.selectResult.error }),
      eq: (_col?: string, _val?: any) => q,
      update: (_vals?: any) => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({ data: state.updateResult.data, error: state.updateResult.error }),
          }),
        }),
      }),
      insert: (_vals?: any) => ({ select: () => ({ single: () => ({ data: state.insertResult.data, error: state.insertResult.error }) }) }),
    };
    return q;
  };

  const supabase = {
    from: (_table: string) => chain(),
    channel: (_name: string) => ({ on: () => ({ subscribe: () => ({}) }) }),
    removeChannel: (_ch: any) => {},
    __setSelect: (data: any, error: any = null) => { state.selectResult = { data, error }; },
    __setUpdate: (data: any, error: any = null) => { state.updateResult = { data, error }; },
    __setInsert: (data: any, error: any = null) => { state.insertResult = { data, error }; },
  } as any;

  return { supabase };
});

// Access helper setters
const { supabase }: any = jest.requireMock('../../lib/supabase');

describe('messagesService', () => {
  beforeEach(() => {
    supabase.__setSelect([], null);
    supabase.__setUpdate(null, null);
    supabase.__setInsert(null, null);
  });

  test('listThreadSummaries aggregates last message and unread count', async () => {
    const userId = 'u1';
    const peerA = 'u2';
    const peerB = 'u3';
    const rows: Message[] = [
      { id: 'm3', sender_id: peerA, receiver_id: userId, content: 'A->u1 latest', type: 'direct', read: false, created_at: '2024-01-03T00:00:00Z' },
      { id: 'm2', sender_id: userId, receiver_id: peerB, content: 'u1->B latest', type: 'direct', read: true, created_at: '2024-01-02T00:00:00Z' },
      { id: 'm1', sender_id: peerA, receiver_id: userId, content: 'A->u1 old', type: 'direct', read: true, created_at: '2024-01-01T00:00:00Z' },
    ];
    supabase.__setSelect(rows, null);

    const out = await messagesService.listThreadSummaries({ userId });

    // Expect 2 threads
    const byPeer: Record<string, ThreadSummary> = Object.fromEntries(out.map(x => [x.peer_id, x]));
    expect(Object.keys(byPeer)).toHaveLength(2);

    // Peer A
    expect(byPeer[peerA].last_message?.id).toBe('m3');
    expect(byPeer[peerA].unread_count).toBe(1);

    // Peer B
    expect(byPeer[peerB].last_message?.id).toBe('m2');
    expect(byPeer[peerB].unread_count).toBe(0);
  });

  test('markRead updates read flags for peer->user messages', async () => {
    const userId = 'me';
    const peerId = 'peer';
    // No error returned
    supabase.__setUpdate(null, null);

    await expect(messagesService.markRead({ userId, peerId })).resolves.toBeUndefined();
  });
});
