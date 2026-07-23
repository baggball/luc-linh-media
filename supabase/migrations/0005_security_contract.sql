-- Contract phase: run only after the application containing migration 0004's
-- matching code has been deployed and verified.

-- New code reads delivery links from product_private_content. Clear the old
-- publicly readable copies so paid content can no longer be obtained anonymously.
update public.products set workflow_link = null, video_url = null
where workflow_link is not null or video_url is not null;

-- New code creates purchases through create_purchase(), which reads the price
-- from products on the server. Direct client inserts must now be disabled.
drop policy if exists "purchases_insert_own_pending" on public.purchases;
revoke insert on public.purchases from anon, authenticated;
