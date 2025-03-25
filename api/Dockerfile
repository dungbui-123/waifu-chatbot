FROM python:3.13

ARG TAVILY_API_KEY

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download the latest installer
ADD https://astral.sh/uv/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

ENV PATH="/app/.venv/bin:$PATH"

# Copy the application into the container.
COPY . /app

# Install the application dependencies.
WORKDIR /app
RUN uv sync --frozen --no-cache

ENV TAVILY_API_KEY=$TAVILY_API_KEY

# Run the application in dev mode
CMD ["uv", "run", "fastapi", "dev", "--host", "0.0.0.0"]
