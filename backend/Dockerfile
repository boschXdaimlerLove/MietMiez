# pinned latest available go version for linux so we dont need to worry about anything
FROM golang:1.24.3 AS builder


# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /backend-server


# use dedicated container as runner so we start with a clean slate
FROM debian:bookworm AS runner

WORKDIR /app

COPY --from=builder /backend-server /app/

# Optional:
# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can document in the Dockerfile what ports
# the application is going to listen on by default.
# https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 8080

# Run
CMD ["/app/backend-server"]
