# pinned latest available go version for linux so we dont need to worry about anything
FROM golang:1.24.3 AS builder


# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY ./ ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /backend-server


# use dedicated container as runner so we start with a clean slate
FROM debian:bookworm AS runner

WORKDIR /app

COPY --from=builder /backend-server /app/

# Run
CMD ["/app/backend-server"]
