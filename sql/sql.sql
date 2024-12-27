-- Drop tables if they already exist
DROP TABLE IF EXISTS "ChatRoomMessages";
DROP TABLE IF EXISTS "ChatRoomUsers";
DROP TABLE IF EXISTS "ChatMessages";
DROP TABLE IF EXISTS "ChatRooms";
DROP TABLE IF EXISTS "Users";

-- Create the Users table
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    "streamKey" VARCHAR(255) DEFAULT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert dummy data into Users
INSERT INTO "Users" (username, password, color) VALUES 
('Alice', 'password123', 'red'),
('Bob', 'password123', 'blue'),
('Charlie', 'password123', 'green'),
('Diana', 'password123', 'yellow'),
('Eve', 'password123', 'purple');

-- Create the ChatRooms table
CREATE TABLE "ChatRooms" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert dummy data into ChatRooms
INSERT INTO "ChatRooms" (name) VALUES 
('General'),
('Gaming'),
('Development'),
('Music'),
('Movies');

-- Create the ChatMessages table
CREATE TABLE "ChatMessages" (
    id SERIAL PRIMARY KEY,
    "chatRoomId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("senderId") REFERENCES "Users" (id),
    CONSTRAINT fk_chatRoom FOREIGN KEY ("chatRoomId") REFERENCES "ChatRooms" (id)
);

-- Insert dummy data into ChatMessages
INSERT INTO "ChatMessages" ("chatRoomId", "senderId", content) VALUES 
-- General
(1, 1, 'Hello everyone!'), -- Alice
(1, 2, 'Hi Alice!'),       -- Bob
(1, 3, 'Hey folks, what''s up?'), -- Charlie
(1, 4, 'Let''s plan our weekend!'), -- Diana
-- Gaming
(2, 2, 'Anyone playing Call of Duty?'), -- Bob
(2, 3, 'I''m in! Let''s squad up.'),    -- Charlie
(2, 5, 'What time?'),                   -- Eve
-- Development
(3, 1, 'Working on some development projects.'), -- Alice
(3, 4, 'Need help with a bug in my code.'),      -- Diana
(3, 5, 'Let''s review each other''s code later.'), -- Eve
-- Music
(4, 3, 'Anyone into classical music?'), -- Charlie
(4, 2, 'I prefer jazz. It''s so relaxing.'), -- Bob
(4, 1, 'Rock all the way!'),            -- Alice
-- Movies
(5, 5, 'What''s the latest Marvel movie?'), -- Eve
(5, 4, 'I loved the last one!'),          -- Diana
(5, 3, 'Can''t wait for the next Star Wars.'), -- Charlie
(5, 2, 'I''m more into indie films.'),    -- Bob
(5, 1, 'What about anime movies?');      -- Alice

-- Create the ChatRoomUsers table
CREATE TABLE "ChatRoomUsers" (
    "chatRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("chatRoomId") REFERENCES "ChatRooms" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("chatRoomId", "userId")
);

-- Insert dummy data into ChatRoomUsers
INSERT INTO "ChatRoomUsers" ("chatRoomId", "userId") VALUES 
-- General Room Members
(1, 1), -- Alice
(1, 2), -- Bob
(1, 3), -- Charlie
(1, 4), -- Diana
(1, 5), -- Eve
-- Gaming Room Members
(2, 2), -- Bob
(2, 3), -- Charlie
(2, 5), -- Eve
-- Development Room Members
(3, 1), -- Alice
(3, 3), -- Charlie
(3, 4), -- Diana
(3, 5), -- Eve
-- Music Room Members
(4, 1), -- Alice
(4, 2), -- Bob
(4, 3), -- Charlie
-- Movies Room Members
(5, 2), -- Bob
(5, 3), -- Charlie
(5, 4), -- Diana
(5, 5); -- Eve