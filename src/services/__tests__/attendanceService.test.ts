import { attendanceService } from '../attendanceService';

// A simple queue-based mock for supabase query builder
let responses: Array<{ data: any; error: any }> = [];

function createBuilder() {
  const builder: any = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    delete: jest.fn(() => builder),
    insert: jest.fn(() => builder),
    gte: jest.fn(() => builder),
    lte: jest.fn(() => builder),
    update: jest.fn(() => builder),
    single: jest.fn(() => Promise.resolve(responses.shift() || { data: null, error: null })),
    then: (resolve: any) => {
      const res = responses.shift() || { data: null, error: null };
      return Promise.resolve(res).then(resolve);
    },
  };
  return builder;
}

jest.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn(() => createBuilder()),
    },
  };
});

describe('attendanceService', () => {
  beforeEach(() => {
    responses = [];
    jest.clearAllMocks();
  });

  it('listByClassAndDate returns data', async () => {
    const sample = [{ id: '1', student_id: 's1', class_id: 'c1', date: '2025-01-01', status: 'present' }];
    responses.push({ data: sample, error: null });

    const out = await attendanceService.listByClassAndDate({ classId: 'c1', date: '2025-01-01' });
    expect(out).toEqual(sample);
  });

  it('listByClassAndDate throws on error', async () => {
    responses.push({ data: null, error: new Error('boom') });
    await expect(
      attendanceService.listByClassAndDate({ classId: 'c1', date: '2025-01-01' })
    ).rejects.toThrow('boom');
  });

  it('replaceForClassAndDate deletes then inserts and returns inserted rows', async () => {
    const inserted = [
      { id: '1', student_id: 's1', class_id: 'c1', date: '2025-01-01', status: 'present' },
    ];
    // First await (delete) -> ok
    responses.push({ data: null, error: null });
    // Second await (insert.select('*')) -> inserted
    responses.push({ data: inserted, error: null });

    const out = await attendanceService.replaceForClassAndDate({
      classId: 'c1',
      date: '2025-01-01',
      entries: inserted.map(({ id, ...r }) => r as any),
    });
    expect(out).toEqual(inserted);
  });

  it('replaceForClassAndDate with empty entries returns empty without insert', async () => {
    // Delete ok
    responses.push({ data: null, error: null });
    const out = await attendanceService.replaceForClassAndDate({ classId: 'c1', date: '2025-01-01', entries: [] });
    expect(out).toEqual([]);
  });
});
