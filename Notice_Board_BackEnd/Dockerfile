# --- 1. The "Build" Stage ---
# We now use the "builder" image that has Java 25
FROM eclipse-temurin:25-jdk-jammy AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy all our backend code into the container
COPY . .

# Run the "Build Command" you already know
RUN ./mvnw clean install -DskipTests

# --- 2. The "Run" Stage ---
# Now, start with a fresh, tiny "runner" image
# We also use the Java 25 JRE (Java Runtime Environment)
FROM eclipse-temurin:25-jre-jammy

# Set the working directory
WORKDIR /app

# Go into the "builder" (from Step 1), find the .jar file
# we just built, and copy *only* that file into this
# new, clean container.
COPY --from=builder /app/target/*.jar app.jar

# Tell the world that this container will run on port 8080
EXPOSE 8080

# This is the "Start Command"
ENTRYPOINT ["java", "-jar", "app.jar"]