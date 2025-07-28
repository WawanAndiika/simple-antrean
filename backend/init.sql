CREATE TYPE queue_type AS ENUM ('R', 'W');
CREATE TYPE queue_status AS ENUM ('waiting', 'called', 'done');

CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE queue_entries (
    id SERIAL PRIMARY KEY,
    queue_number VARCHAR(10) NOT NULL,
    type queue_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status queue_status DEFAULT 'waiting',
    staff_id INTEGER REFERENCES staff(id)
);

-- Insert some initial staff data
INSERT INTO staff (name) VALUES ('Lina'), ('Budi'), ('Citra');
