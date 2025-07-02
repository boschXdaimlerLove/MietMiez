# It's a good practice to use a specific Long-Term Support (LTS) version for reproducibility.
# 'current' can change and potentially break your build in the future.
FROM docker.io/library/node:24-alpine AS base

# Install necessary dependencies for building native modules
RUN apk add --no-cache libc6-compat python3 make g++

# ─────── Builder Stage ───────
# This stage builds the application.
FROM base AS builder
# Set the working directory for the entire application.
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY mietmiez/package*.json ./

# Set environment variables to help with native module compilation
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of your application source code.
COPY mietmiez ./

# Set production environment for build
ENV NODE_ENV=production

# Build the application
RUN npm run build


# ─────── Runtime Stage ───────
# This stage creates the final, lean image for running the application.
FROM base AS runner
WORKDIR /app

# Copy package files again for installing only production dependencies.
COPY mietmiez/package*.json ./

# Install only the production dependencies to keep the image size small.
RUN npm install --omit=dev

# Copy the necessary files from the 'builder' stage to the final image.
# The source path is now /app because we consolidated the working directory.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# The port the application will run on.
EXPOSE 3000

# The command to start the application.
CMD ["npm", "run", "start"]
