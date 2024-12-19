DROP TABLE IF EXISTS "ChatMessages";

CREATE TABLE "ChatMessages" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    message TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "Users" (id)
);

INSERT INTO "ChatMessages" ("userId", message) VALUES (1, 'Hello!');
INSERT INTO "ChatMessages" ("userId", message) VALUES (2, 'hi');
INSERT INTO "ChatMessages" ("userId", message) VALUES (3, 'o/');