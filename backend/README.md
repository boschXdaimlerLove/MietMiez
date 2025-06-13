Env variables overwrite the yaml config correspondents

---

### 📄 `config.yaml`

```yaml
# backend config
# backend config
backend:
  port: 8080
  cookie_key: "J03dh2uApi5d1E7Z8ktN7prxMdRLMCeCVZvi9jKjBC8="
  production: false

# database credentials
database:
  user: "mietmiez"
  password: "supersecretlongandcomplexpassword"
  hostname: "database"
  port: 5432
  dbname: "mietmiez"

smtp:
  host: "mail.mietmiez.com:587" # including port: mail.google.com:587
  user: "mietmiez_p1"
  password: "supersecretlongandcomplexpassword"
  from: "noreply@mietmiez.com"
```

---

### 📘 Configuration Description (Markdown)

| Section  | Field      | YAML Key     | Env Variable         | Description                                                   |
|----------|------------|--------------|----------------------|---------------------------------------------------------------|
| smtp     | host       | `host`       | `SMTP_HOST`          | smtp server address incuding port eg. mail.bla.com:587        |
| smtp     | username   | `user`       | `SMTP_USER`          | smtp username                                                 |
| smtp     | password   | `password`   | `SMTP_PASSWORD`      | smtp password                                                 |
| smtp     | from       | `from`       | `SMTP_FROM`          | smtp address where emails are coming from eg. noreply@bla.com |
| backend  | Port       | `port`       | `BACKEND_PORT`       | The port your backend server listens on                       |
| backend  | CookieKey  | `cookie_key` | `BACKEND_COOKIE_KEY` | 32 char string that is used to encrypt cookie                 |
| backend  | Production | `production` | `BACKEND_PRODUCTION` | If we can set Cookie Secure Flag                              |
| database | Username   | `user`       | `DB_USERNAME`        | Database username                                             |
| database | Password   | `password`   | `DB_PASSWORD`        | Database password                                             |
| database | Hostname   | `hostname`   | `DB_HOSTNAME`        | Database host (e.g., `database`)                              |
| database | Port       | `port`       | `DB_PORT`            | Database port (e.g., `5432`)                                  |
| database | Dbname     | `dbname`     | `DB_NAME`            | Name of the database                                          |
