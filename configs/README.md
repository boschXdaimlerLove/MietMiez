### 📘 Config

| Section  | Field      | Env Variable         | Description                                                  |
| -------- | ---------- |----------------------| ------------------------------------------------------------ |
| smtp     | host       | `SMTP_HOST`          | SMTP server address including port, e.g., `mail.bla.com:587` |
| smtp     | username   | `SMTP_USER`          | SMTP username                                                |
| smtp     | password   | `SMTP_PASSWORD`      | SMTP password                                                |
| smtp     | from       | `SMTP_FROM`          | Sender address, e.g., `noreply@bla.com`                      |
| backend  | Port       | `BACKEND_PORT`       | Port your backend server listens on                          |
| backend  | Production | `BACKEND_PRODUCTION` | Enables cookie secure flag if set                            |
| database | Username   | `POSTGRES_USER`      | Database username                                            |
| database | Password   | `POSTGRES_PASSWORD`  | Database password                                            |
| database | Hostname   | `POSTGRES_HOSTNAME`  | Database host (e.g., `database`)                             |
| database | Dbname     | `POSTGRES_DB`        | Name of the database                                         |
