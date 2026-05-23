CREATE TABLE IF NOT EXISTS public.projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(255),
    organization_id INTEGER REFERENCES public.organization(organization_id)
);

CREATE TABLE IF NOT EXISTS public.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES public.categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO public.projects
(title, description, date, location, organization_id)
VALUES
(
    'Neighborhood Salsa Garden',
    'A community gardening website focused on recycling and growing salsa ingredients.',
    '2026-06-01',
    'Owasso Community Garden',
    1
),
(
    'Food Drive',
    'Collect canned goods for local families.',
    '2026-06-10',
    'Owasso Food Bank',
    1
),
(
    'Park Tree Planting',
    'Plant trees at the local park.',
    '2026-06-15',
    'Centennial Park',
    2
)
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (name)
VALUES
    ('Gardening'),
    ('Recycling'),
    ('Sustainability'),
    ('Food Preservation')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.project_categories (project_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4)
ON CONFLICT DO NOTHING;