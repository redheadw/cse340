CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO project (name, description)
VALUES (
    'Neighborhood Salsa Garden',
    'A community gardening website focused on recycling and growing salsa ingredients.'
)
ON CONFLICT DO NOTHING;

INSERT INTO categories (name)
VALUES
    ('Gardening'),
    ('Recycling'),
    ('Sustainability'),
    ('Food Preservation')
ON CONFLICT (name) DO NOTHING;

INSERT INTO project_categories (project_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4)
ON CONFLICT DO NOTHING;