# It's a good practice to use a specific Long-Term Support (LTS) version for reproducibility.
# 'current' can change and potentially break your build in the future.
FROM docker.io/library/node:24-alpine AS base

# ─────── Builder Stage ───────
# This stage builds the application.
FROM base AS builder
# Set the working directory for the entire application.
WORKDIR /app

# Copy package.json and package-lock.json first.
# This leverages Docker's layer caching. This layer only gets rebuilt if the package files change.
# The 'mietmiez/' prefix is needed because the Docker build context is the 'frontend' directory.
COPY mietmiez/package*.json ./

# Install all dependencies, including devDependencies needed for the build.
RUN npm install

# Copy the rest of your application source code.
COPY mietmiez/ .

# Run the build script. This will create the .next directory inside /app.
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