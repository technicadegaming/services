-- Atomic ticket creation used by the server-side intake API.
-- This routine is not callable by anonymous or regular authenticated users.
create or replace function public.tc_create_ticket(
  p_name text,
  p_email text,
  p_subject text,
  p_description text,
  p_service_type text,
  p_device_type text default null
) returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid;
  v_ticket_id uuid;
  v_ticket_number bigint;
begin
  if length(trim(p_name)) not between 2 and 160
     or length(trim(p_subject)) not between 3 and 180
     or length(trim(p_description)) not between 10 and 10000
     or length(trim(p_email)) not between 3 and 320
     or length(trim(p_service_type)) not between 1 and 120
  then raise exception 'invalid ticket fields' using errcode = '22023';
  end if;

  insert into public.tc_customers (full_name,email)
  values (trim(p_name),lower(trim(p_email)))
  returning id into v_customer_id;

  insert into public.tc_tickets (customer_id,subject,description,service_type,device_type)
  values (v_customer_id,trim(p_subject),trim(p_description),trim(p_service_type),nullif(trim(p_device_type),''))
  returning id,ticket_number into v_ticket_id,v_ticket_number;

  insert into public.tc_ticket_events(ticket_id,actor_type,event_type,note)
  values (v_ticket_id,'system','created','Request received from public support form');

  return v_ticket_number;
end;
$$;

revoke all on function public.tc_create_ticket(text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.tc_create_ticket(text,text,text,text,text,text) to service_role;
