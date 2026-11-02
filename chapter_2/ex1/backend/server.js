const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const {
  authMiddleware,
  employerOnly,
  applicantOnly,
} = require("./middleware");

const app = express();
const PORT = 3001;
const JWT_SECRET = "secret";

app.use(cors());
app.use(express.json());


app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["applicant", "employer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name, email, hashedPassword, role], function (error) {
    if (error) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = {
      id: this.lastID,
      name,
      email,
      role,
    };

    const token = jwt.sign(user, JWT_SECRET);

    res.status(201).json({
      user,
      token,
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, user) => {
      if (error || !user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(userData, JWT_SECRET);

      res.json({
        user: userData,
        token,
      });
    }
  );
});


app.get("/vacancies", authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all(
    `
      SELECT
        vacancies.*,
        (
          SELECT COUNT(*)
          FROM responses
          WHERE responses.vacancyId = vacancies.id
        ) AS responsesCount,
        EXISTS(
          SELECT 1
          FROM responses
          WHERE responses.vacancyId = vacancies.id
          AND responses.userId = ?
        ) AS responded
      FROM vacancies
      WHERE vacancies.isActive = 1
      ORDER BY vacancies.id DESC
    `,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json(rows);
    }
  );
});

app.get("/vacancies/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.get(
    `
      SELECT
        vacancies.*,
        (
          SELECT COUNT(*)
          FROM responses
          WHERE responses.vacancyId = vacancies.id
        ) AS responsesCount,
        EXISTS(
          SELECT 1
          FROM responses
          WHERE responses.vacancyId = vacancies.id
          AND responses.userId = ?
        ) AS responded
      FROM vacancies
      WHERE vacancies.id = ?
    `,
    [userId, req.params.id],
    (err, vacancy) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }

      res.json(vacancy);
    }
  );
});

app.post(
  "/vacancies",
  authMiddleware,
  employerOnly,
  (req, res) => {
    const {
      title,
      description,
      salary,
      company,
    } = req.body;

    if (!title || !description || !salary || !company) {
      return res.status(400).json({
        message: `All fields are required. Received: title=${title}, description=${description ? 'filled' : 'empty'}, salary=${salary}, company=${company}`,
      });
    }

    const query = `
      INSERT INTO vacancies
      (title, description, salary, company, authorId)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        title,
        description,
        salary,
        company,
        req.user.id,
      ],
      function (error) {
        if (error) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.status(201).json({
          id: this.lastID,
          title,
          description,
          salary,
          company,
          authorId: req.user.id,
          isActive: 1,
        });
      }
    );
  }
);

app.put(
  "/vacancies/:id",
  authMiddleware,
  employerOnly,
  (req, res) => {
    const { title, description, salary, company, isActive, englishLevel, grade, tags } = req.body;

    db.get(
      "SELECT * FROM vacancies WHERE id = ?",
      [req.params.id],
      (error, vacancy) => {
        if (error) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (!vacancy) {
          return res.status(404).json({
            message: "Vacancy not found",
          });
        }

        if (vacancy.authorId !== req.user.id) {
          return res.status(403).json({
            message: "Access denied",
          });
        }

        const updatedVacancy = {
          title: title ?? vacancy.title,
          description: description ?? vacancy.description,
          salary: salary ?? vacancy.salary,
          company: company ?? vacancy.company,
          isActive: isActive ?? vacancy.isActive,
          englishLevel: englishLevel ?? vacancy.englishLevel,
          grade: grade ?? vacancy.grade,
          tags: tags ?? vacancy.tags,
        };

        db.run(
          `
          UPDATE vacancies
          SET title = ?,
              description = ?,
              salary = ?,
              company = ?,
              isActive = ?,
              englishLevel = ?,
              grade = ?,
              tags = ?
          WHERE id = ?
          `,
          [
            updatedVacancy.title,
            updatedVacancy.description,
            updatedVacancy.salary,
            updatedVacancy.company,
            updatedVacancy.isActive,
            updatedVacancy.englishLevel,
            updatedVacancy.grade,
            updatedVacancy.tags,
            req.params.id,
          ],
          (updateError) => {
            if (updateError) {
              return res.status(500).json({
                message: "Database error",
              });
            }

            res.json({
              id: Number(req.params.id),
              ...updatedVacancy,
            });
          }
        );
      }
    );
  }
);

app.delete(
  "/vacancies/:id",
  authMiddleware,
  employerOnly,
  (req, res) => {
    db.get(
      "SELECT * FROM vacancies WHERE id = ?",
      [req.params.id],
      (error, vacancy) => {
        if (error) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (!vacancy) {
          return res.status(404).json({
            message: "Vacancy not found",
          });
        }

        if (vacancy.authorId !== req.user.id) {
          return res.status(403).json({
            message: "Access denied",
          });
        }

        db.run(
          "DELETE FROM vacancies WHERE id = ?",
          [req.params.id],
          (deleteError) => {
            if (deleteError) {
              return res.status(500).json({
                message: "Database error",
              });
            }

            res.json({
              message: "Vacancy deleted",
            });
          }
        );
      }
    );
  }
);

app.get(
  "/my-vacancies",
  authMiddleware,
  applicantOnly,
  (req, res) => {
    const query = `
      SELECT
        vacancies.id,
        vacancies.title,
        vacancies.description,
        vacancies.salary,
        vacancies.company,
        vacancies.authorId,
        vacancies.isActive,
        1 AS responded
      FROM vacancies
      INNER JOIN responses
        ON vacancies.id = responses.vacancyId
      WHERE responses.userId = ?
      ORDER BY vacancies.id DESC
    `;

    db.all(query, [req.user.id], (error, vacancies) => {
      if (error) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json(vacancies);
    });
  }
);

app.get(
  "/active-vacancies",
  authMiddleware,
  employerOnly,
  (req, res) => {
    const query = `
      SELECT
        vacancies.id,
        vacancies.title,
        vacancies.description,
        vacancies.salary,
        vacancies.company,
        vacancies.authorId,
        vacancies.isActive,
        COUNT(responses.id) AS responsesCount
      FROM vacancies
      LEFT JOIN responses
        ON vacancies.id = responses.vacancyId
      WHERE vacancies.authorId = ?
      GROUP BY vacancies.id
      ORDER BY vacancies.id DESC
    `;

    db.all(query, [req.user.id], (error, vacancies) => {
      if (error) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json(vacancies);
    });
  }
);

app.get(
  "/active-vacancies/:id",
  authMiddleware,
  employerOnly,
  (req, res) => {
    db.get(
      `
        SELECT
          vacancies.*,
          (
            SELECT COUNT(*)
            FROM responses
            WHERE responses.vacancyId = vacancies.id
          ) AS responsesCount
        FROM vacancies
        WHERE vacancies.id = ?
        AND vacancies.authorId = ?
      `,
      [req.params.id, req.user.id],
      (err, vacancy) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!vacancy) {
          return res.status(404).json({ message: "Vacancy not found" });
        }

        res.json(vacancy);
      }
    );
  }
);


app.post(
  "/vacancies/:id/apply",
  authMiddleware,
  applicantOnly,
  (req, res) => {
    const vacancyId = req.params.id;

    db.get(
      "SELECT * FROM vacancies WHERE id = ?",
      [vacancyId],
      (error, vacancy) => {
        if (error) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (!vacancy) {
          return res.status(404).json({
            message: "Vacancy not found",
          });
        }

        if (!vacancy.isActive) {
          return res.status(400).json({
            message: "Vacancy is closed",
          });
        }

        db.run(
          `
          INSERT INTO responses (userId, vacancyId)
          VALUES (?, ?)
          `,
          [req.user.id, vacancyId],
          function (insertError) {
            if (insertError) {
              return res.status(400).json({
                message: "Already applied",
              });
            }

            res.status(201).json({
              message: "Application sent",
            });
          }
        );
      }
    );
  }
);


app.delete(
  "/vacancies/:id/apply",
  authMiddleware,
  applicantOnly,
  (req, res) => {
    db.run(
      `
      DELETE FROM responses
      WHERE userId = ? AND vacancyId = ?
      `,
      [req.user.id, req.params.id],
      function (error) {
        if (error) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.json({
          message: "Application cancelled",
        });
      }
    );
  }
);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});