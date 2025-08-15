import { gradesService } from '../gradesService';

let responses: Array<{ data: any; error: any }> = [];

function createBuilder() {
  const builder: any = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    delete: jest.fn(() => builder),
    insert: jest.fn(() => builder),
    update: jest.fn(() => builder),
    gte: jest.fn(() => builder),
    lte: jest.fn(() => builder),
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

describe('gradesService', () => {
  beforeEach(() => {
    responses = [];
    jest.clearAllMocks();
  });

  it('listByClass returns data with filters', async () => {
    const sample = [
      { id: 'g1', student_id: 's1', class_id: 'c1', subject: 'Math', grade: 15, evaluation_type: 'devoir', teacher_id: 't1', date: '2025-01-01' },
    ];
    responses.push({ data: sample, error: null });

    const out = await gradesService.listByClass({ classId: 'c1', subject: 'Math', fromDate: '2025-01-01', toDate: '2025-01-01' });
    expect(out).toEqual(sample);
  });

  it('listByClass throws on error', async () => {
    responses.push({ data: null, error: new Error('fail') });
    await expect(
      gradesService.listByClass({ classId: 'c1' })
    ).rejects.toThrow('fail');
  });

  it('replaceForClassSubjectDate deletes then inserts', async () => {
    const entries = [
      { student_id: 's1', class_id: 'c1', subject: 'Math', grade: 12, evaluation_type: 'devoir', teacher_id: 't1', date: '2025-01-01', comment: null },
    ];
    // delete ok
    responses.push({ data: null, error: null });
    // insert/select ok
    const inserted = entries.map((e, idx) => ({ id: `id${idx}`, ...e }));
    responses.push({ data: inserted, error: null });

    const out = await gradesService.replaceForClassSubjectDate({ classId: 'c1', subject: 'Math', date: '2025-01-01', entries });
    expect(out).toEqual(inserted);
  });

  it('replaceForClassSubjectDate with empty entries returns empty after delete', async () => {
    responses.push({ data: null, error: null });
    const out = await gradesService.replaceForClassSubjectDate({ classId: 'c1', subject: 'Math', date: '2025-01-01', entries: [] });
    expect(out).toEqual([]);
  });

  it('update returns updated row', async () => {
    const updated = { id: 'g1', student_id: 's1', class_id: 'c1', subject: 'Math', grade: 18, evaluation_type: 'devoir', teacher_id: 't1', date: '2025-01-01', comment: null };
    responses.push({ data: updated, error: null });
    const out = await gradesService.update('g1', { grade: 18 });
    expect(out).toEqual(updated);
  });

  it('remove completes without error', async () => {
    responses.push({ data: null, error: null });
    await expect(gradesService.remove('g1')).resolves.toBeUndefined();
  });
});
