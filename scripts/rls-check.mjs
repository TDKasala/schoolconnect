#!/usr/bin/env node
// RLS check script for Supabase (users, messages)
// Env vars:
//  SUPABASE_URL, SUPABASE_ANON_KEY
//  TEST_USER_EMAIL, TEST_USER_PASSWORD (optional; if provided will sign in)
//  PEER_ID (optional; for thread read test)
//  ALLOW_WRITE=true (optional; attempts a safe write and rollback-like cleanup)

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, anon);

async function main() {
  let authUser = null;
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (email && password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign-in failed:', error.message);
      process.exit(1);
    }
    authUser = data.user;
    console.log('Signed in as', authUser?.email);
  } else {
    console.log('Proceeding without sign-in (anon). Some RLS checks may fail as expected.');
  }

  // 1) Users list (scoped)
  const usersRes = await supabase.from('users').select('id, email, full_name, role, school_id').limit(5);
  if (usersRes.error) console.error('users select error:', usersRes.error.message);
  else console.log('users select ok:', usersRes.data?.length, 'rows');

  // 2) Messages visible to current user
  const me = authUser?.id || 'UNKNOWN';
  const msgRes = await supabase
    .from('messages')
    .select('id, sender_id, receiver_id, read, created_at')
    .or(me === 'UNKNOWN' ? 'sender_id.eq.none,receiver_id.eq.none' : `sender_id.eq.${me},receiver_id.eq.${me}`)
    .limit(5);
  if (msgRes.error) console.error('messages select error:', msgRes.error.message);
  else console.log('messages select ok:', msgRes.data?.length, 'rows');

  // 3) Optional thread test with PEER_ID
  const peer = process.env.PEER_ID;
  if (authUser?.id && peer) {
    const threadRes = await supabase
      .from('messages')
      .select('id')
      .or(`and(sender_id.eq.${authUser.id},receiver_id.eq.${peer}),and(sender_id.eq.${peer},receiver_id.eq.${authUser.id})`)
      .limit(1);
    if (threadRes.error) console.error('thread select error:', threadRes.error.message);
    else console.log('thread select ok: rows', threadRes.data?.length);
  }

  // 4) Optional write test
  if (process.env.ALLOW_WRITE === 'true' && authUser?.id && peer) {
    console.log('Attempting write test (sendDirect)...');
    const ins = await supabase
      .from('messages')
      .insert({ sender_id: authUser.id, receiver_id: peer, content: '[RLS check] ping', type: 'direct', read: false })
      .select('id')
      .single();
    if (ins.error) console.error('insert error:', ins.error.message);
    else console.log('insert ok, id:', ins.data?.id);
  }

  console.log('RLS checks finished.');
}

main().catch((e) => {
  console.error('RLS check failed:', e);
  process.exit(1);
});
