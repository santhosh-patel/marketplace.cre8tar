
-- Delete in the correct order to avoid foreign key constraint violations
-- First delete minted NFTs (they don't have foreign key constraints)
DELETE FROM public.minted_nfts;

-- Then delete profiles (they reference auth.users)
DELETE FROM public.profiles;

-- Finally delete users from auth.users
DELETE FROM auth.users;
