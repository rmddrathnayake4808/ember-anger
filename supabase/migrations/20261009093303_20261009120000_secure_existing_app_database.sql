/*
# Secure the existing Ember application database

1. Purpose
- Keep the existing Supabase database for authenticated account data and chat.
- Keep private journal entries and tension check-ins in device storage as the app currently promises.

2. Existing tables updated
- `profiles`: add the missing delete policy for the signed-in owner.
- `check_ins`: default `user_id` to the current signed-in user so inserts cannot accidentally omit ownership.
- `journal_entries`: default `user_id` to the current signed-in user so inserts cannot accidentally omit ownership.
- `chat_messages`: default `user_id` to the current signed-in user and replace the broad ALL policy with four explicit CRUD policies.

3. Security changes
- Remove direct anon-role table privileges from all four authenticated tables.
- Keep access limited to the authenticated owner through separate SELECT, INSERT, UPDATE, and DELETE policies.
- No public or cross-user access is added.

4. Important notes
- No data is deleted or renamed.
- The migration is safe to re-run.
- Device-only journal and check-in storage is unchanged.
*/

ALTER TABLE public.check_ins
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.journal_entries
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.chat_messages
  ALTER COLUMN user_id SET DEFAULT auth.uid();

REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.check_ins FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.journal_entries FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.chat_messages FROM anon;

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users manage own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_own" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_own" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_own" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_own" ON public.chat_messages;

CREATE POLICY "chat_messages_select_own"
ON public.chat_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "chat_messages_insert_own"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_messages_update_own"
ON public.chat_messages FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_messages_delete_own"
ON public.chat_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);