const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('applicant', 'employer'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vacancies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      salary TEXT NOT NULL,
      company TEXT NOT NULL,
      authorId INTEGER NOT NULL,
      isActive INTEGER NOT NULL DEFAULT 1,
      englishLevel TEXT DEFAULT 'A1',
      grade TEXT DEFAULT 'Junior',
      tags TEXT DEFAULT '',
      FOREIGN KEY (authorId) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      vacancyId INTEGER NOT NULL,
      UNIQUE(userId, vacancyId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (vacancyId) REFERENCES vacancies(id)
    )
  `);

  // Seed data
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync("password123", 10);

  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Test Applicant", "applicant@test.com", hashedPassword, "applicant"]
      );
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Test Employer", "employer@test.com", hashedPassword, "employer"]
      );

      db.run(
        "INSERT INTO vacancies (title, description, salary, company, authorId, englishLevel, grade, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Frontend Developer",
          "Develop and maintain web applications using React and TypeScript. Work closely with designers and backend developers.",
          "150000",
          "Tech Corp",
          2,
          "B2",
          "Middle",
          "React,TypeScript,HTML,CSS"
        ]
      );
      db.run(
        "INSERT INTO vacancies (title, description, salary, company, authorId, englishLevel, grade, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Backend Developer",
          "Build scalable server-side applications using Node.js and Express. Design and implement REST APIs.",
          "180000",
          "Tech Corp",
          2,
          "B1",
          "Middle",
          "Node.js,Express,PostgreSQL"
        ]
      );
      db.run(
        "INSERT INTO vacancies (title, description, salary, company, authorId, englishLevel, grade, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Fullstack Developer",
          "Work on both frontend and backend development. Build complete web applications from scratch.",
          "200000",
          "Tech Corp",
          2,
          "C1",
          "Senior",
          "React,Node.js,PostgreSQL,Docker"
        ]
      );
      db.run(
        "INSERT INTO vacancies (title, description, salary, company, authorId, englishLevel, grade, tags, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "DevOps Engineer",
          "Manage cloud infrastructure and CI/CD pipelines. Ensure high availability of production systems.",
          "220000",
          "Tech Corp",
          2,
          "B2",
          "Senior",
          "AWS,Docker,Kubernetes,CI/CD",
          0
        ]
      );
    }
  });
});

module.exports = db;
