### Config

#### Environment configuration

| Env Variable               | Description                                                   |
|----------------------------|---------------------------------------------------------------|
| `SMTP_HOST`                | SMTP server address including port, e.g., `mail.bla.com:587`  |
| `SMTP_USER`                | SMTP username                                                 |
| `SMTP_PASSWORD`            | SMTP password                                                 |
| `SMTP_FROM`                | Sender address, e.g., `noreply@bla.com`                       |
| `BACKEND_PORT`             | Port your backend server listens on                           |
| `BACKEND_PRODUCTION`       | Enables cookie secure flag if set                             |
| `BACKEND_MAX_BODY_SIZE_MB` | Max image file size in mb for uploads to minio                |
| `BACKEND_LOG_LEVEL`        | Backend log level `(trace,debug,info,warn,error,fatal,panic)` |
| `POSTGRES_USER`            | Database username                                             |
| `POSTGRES_PASSWORD`        | Database password                                             |
| `POSTGRES_HOSTNAME`        | Database host (e.g., `database`)                              |
| `POSTGRES_DB`              | Name of the database                                          |

#### Static content

The `about.json` contains static information about your MietMiez instance. Reachable via `/about.json`.