DROP TABLE IF EXISTS public.project_categories;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.organization;

CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    logo_filename VARCHAR(255)
);

CREATE TABLE public.projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(255),
    organization_id INTEGER REFERENCES public.organization(organization_id)
);

CREATE TABLE public.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.project_categories (
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


-- Roles Table


CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO public.roles (
    role_name,
    role_description
)
VALUES
(
    'user',
    'Standard user with basic access'
),
(
    'admin',
    'Administrator with full system access'
)
ON CONFLICT (role_name) DO NOTHING;


-- Users Table


CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES public.roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.organization
(name, description, contact_email, logo_filename)
VALUES
('Owasso Community Resources', 'Provides community resources and garden kits for local families.', 'resources@example.com', 'owasso-community-resources.png'),
('Community Center', 'Hosts community classes and service activities.', 'center@example.com', 'community-center.png'),
('Library', 'Provides online instructions and learning resources.', 'library@example.com', 'tulsa-library.png');

INSERT INTO public.projects
(title, description, date, location, organization_id)
VALUES
('Neighborhood Salsa Garden', 'A community gardening website focused on recycling and growing salsa ingredients.', '2026-06-01', 'Owasso Community Garden', 1),
('Community Resource Grow Kits', 'Grow kits help families start tomatoes, jalapeños, cilantro, and onions at home.', '2026-06-10', 'Owasso Community Resources', 1),
('Community Center Class', 'A class that teaches how to start salsa garden plants using recycled containers.', '2026-06-15', 'Community Center', 2),
('Library Web Instruction Resource', 'An online library resource explaining how to grow and care for a salsa garden.', '2026-06-20', 'Library', 3);

INSERT INTO public.categories (name)
VALUES
('Gardening'),
('Recycling'),
('Sustainability'),
('Food Preservation');

INSERT INTO public.project_categories (project_id, category_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(3, 1),
(3, 3),
(4, 1),
(4, 4);