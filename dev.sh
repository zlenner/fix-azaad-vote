#!/bin/bash

# Function to run frontend server
run_frontend() {
    cd frontend && npm run dev | while read line; do
        echo -e "\033[1;35mfrontend:\033[0m $line" # Purple for frontend
    done
}

# Function to run backend server
run_backend() {
    cd backend && npm run dev | while read line; do
        echo -e "\033[1;33mbackend:\033[0m $line" # Yellow for backend
    done
}

# Run both servers in the background
run_frontend &
run_backend &

# Wait for both processes to finish
wait
