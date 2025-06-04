Here’s a small example of how your configuration file might look in **YAML**, along with a corresponding **Markdown** section to describe it:

---

### 📄 `config.yaml`

```yaml
server:
  port: 8080

database:
  user: "dbuser"
  password: "secretpassword"
  hostname: "localhost"
  port: 5432
  dbname: "myappdb"
```

---

### 📘 Configuration Description (Markdown)

| Section  | Field    | YAML Key   | Env Variable   | Description                       |
| -------- | -------- | ---------- | -------------- | --------------------------------- |
| backend  | Port     | `port`     | `BACKEND_PORT` | The port your backend server listens on   |
| database | Username | `user`     | `DB_USERNAME`  | Database username                 |
| database | Password | `password` | `DB_PASSWORD`  | Database password                 |
| database | Hostname | `hostname` | `DB_HOSTNAME`  | Database host (e.g., `database`) |
| database | Port     | `port`     | `DB_PORT`      | Database port (e.g., `5432`)      |
| database | Dbname   | `dbname`   | `DB_NAME`      | Name of the database              |
