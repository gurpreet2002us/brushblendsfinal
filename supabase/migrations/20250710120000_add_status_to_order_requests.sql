-- Add status column to order_requests table
ALTER TABLE order_requests ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';
-- Optionally, add an index for status
CREATE INDEX idx_order_requests_status ON order_requests(status); 