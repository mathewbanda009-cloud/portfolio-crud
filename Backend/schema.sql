-- Run this in Supabase: SQL Editor -> New query -> paste -> Run

CREATE TABLE IF NOT EXISTS portfolio (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_name  VARCHAR(120) NOT NULL,
  title       VARCHAR(150),
  bio         TEXT,
  skills      VARCHAR(255),
  email       VARCHAR(150),
  website_url VARCHAR(255),
  location    VARCHAR(100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Postgres has no "ON UPDATE CURRENT_TIMESTAMP", so use a trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS portfolio_set_updated_at ON portfolio;
CREATE TRIGGER portfolio_set_updated_at
BEFORE UPDATE ON portfolio
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 10 sample records
INSERT INTO portfolio (owner_name, title, bio, skills, email, website_url, location) VALUES
('Chanda Mwila', 'Web Developer', 'Builds fast, clean websites for small businesses.', 'HTML, CSS, JavaScript, Node.js', 'chanda.mwila@example.com', 'https://chandamwila.example.com', 'Kabwe, Zambia'),
('Mutale Banda', 'Graphic Designer', 'Creates posters, logos and brand identities.', 'Illustrator, Photoshop, Branding', 'mutale.banda@example.com', 'https://mutalebanda.example.com', 'Lusaka, Zambia'),
('Thandiwe Phiri', 'Photographer', 'Event and portrait photographer with a love for natural light.', 'Photography, Lightroom, Editing', 'thandiwe.phiri@example.com', 'https://thandiwephiri.example.com', 'Ndola, Zambia'),
('Kelvin Zulu', 'Mobile App Developer', 'Develops Android apps for students and startups.', 'Kotlin, Flutter, Firebase', 'kelvin.zulu@example.com', 'https://kelvinzulu.example.com', 'Kitwe, Zambia'),
('Natasha Lungu', 'UI/UX Designer', 'Designs simple, user-friendly interfaces.', 'Figma, Prototyping, User Research', 'natasha.lungu@example.com', 'https://natashalungu.example.com', 'Livingstone, Zambia'),
('Brian Tembo', 'Data Analyst', 'Turns messy data into clear dashboards.', 'Python, SQL, Excel, Power BI', 'brian.tembo@example.com', 'https://briantembo.example.com', 'Lusaka, Zambia'),
('Grace Mumba', 'Content Creator', 'Writes and produces content for brands online.', 'Copywriting, Video Editing, SEO', 'grace.mumba@example.com', 'https://gracemumba.example.com', 'Chipata, Zambia'),
('Joseph Sakala', 'Backend Developer', 'Designs APIs and databases that scale.', 'Node.js, PostgreSQL, REST APIs', 'joseph.sakala@example.com', 'https://josephsakala.example.com', 'Solwezi, Zambia'),
('Esther Chola', 'Video Editor', 'Edits short films, adverts and social media reels.', 'Premiere Pro, After Effects, Color Grading', 'esther.chola@example.com', 'https://estherchola.example.com', 'Mansa, Zambia'),
('Patrick Kunda', 'IT Support Specialist', 'Fixes Windows issues and sets up software and networks.', 'Windows, Troubleshooting, Networking', 'patrick.kunda@example.com', 'https://patrickkunda.example.com', 'Kasama, Zambia');

-- Check it worked
SELECT * FROM portfolio ORDER BY id;
