-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.create_payment_record(
  p_user_id UUID,
  p_stripe_session_id TEXT,
  p_amount INTEGER,
  p_connections_purchased INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_purchase_id UUID;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL OR p_stripe_session_id IS NULL OR p_amount <= 0 OR p_connections_purchased <= 0 THEN
    RAISE EXCEPTION 'Invalid payment parameters';
  END IF;
  
  -- Check if session already exists to prevent duplicates
  IF EXISTS (SELECT 1 FROM public.connection_purchases WHERE stripe_session_id = p_stripe_session_id) THEN
    RAISE EXCEPTION 'Payment session already exists';
  END IF;
  
  -- Insert the payment record
  INSERT INTO public.connection_purchases (
    user_id,
    stripe_session_id, 
    amount,
    connections_purchased,
    status,
    created_at
  ) VALUES (
    p_user_id,
    p_stripe_session_id,
    p_amount,
    p_connections_purchased,
    'pending',
    now()
  ) RETURNING id INTO v_purchase_id;
  
  RETURN v_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to securely update payment status after verification
CREATE OR REPLACE FUNCTION public.verify_and_update_payment(
  p_stripe_session_id TEXT,
  p_new_status TEXT
)
RETURNS TABLE(user_id UUID, connections_purchased INTEGER) AS $$
DECLARE
  v_user_id UUID;
  v_connections INTEGER;
  v_current_status TEXT;
BEGIN
  -- Validate inputs
  IF p_stripe_session_id IS NULL OR p_new_status NOT IN ('paid', 'failed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid verification parameters';
  END IF;
  
  -- Get current purchase details and validate it can be updated
  SELECT cp.user_id, cp.connections_purchased, cp.status 
  INTO v_user_id, v_connections, v_current_status
  FROM public.connection_purchases cp 
  WHERE cp.stripe_session_id = p_stripe_session_id;
  
  -- Check if purchase exists
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Purchase not found';
  END IF;
  
  -- Only allow status updates from pending
  IF v_current_status != 'pending' THEN
    RAISE EXCEPTION 'Payment already processed';
  END IF;
  
  -- Update the payment status
  UPDATE public.connection_purchases 
  SET 
    status = p_new_status,
    updated_at = now()
  WHERE stripe_session_id = p_stripe_session_id;
  
  -- Return user details for connection update
  RETURN QUERY SELECT v_user_id, v_connections;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;