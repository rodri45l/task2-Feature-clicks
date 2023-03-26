# Feature Flicks

Feature Flicks is a Vite-based web application for booking movie tickets online. The project is divided into various components to maintain a modular and easy-to-understand code structure. Each component has a specific purpose, making it easy to maintain and update the project.

## Components

### 1. MovieBookingPage

`MovieBookingPage` is the main component that displays the movie booking page. It fetches movie and screening data from the API and displays it on the page. It also includes subcomponents such as `BookingForm` and `SeatGrid` for managing the booking process.

### 2. Header

`Header` is a simple navigation bar component that displays the logo and the brand title. It uses `Navbar` and `Container` from the `react-bootstrap` library for styling and responsiveness.

### 3. MovieList

`MovieList` is a component that fetches and displays a list of available movies for booking. It displays movie posters, titles, and descriptions. When a user clicks on a movie, they are redirected to the `MovieBookingPage` for that specific movie.

### 4. BookingForm

`BookingForm` is a subcomponent of the `MovieBookingPage` that allows users to select the number of normal, senior, and child tickets they want to book. It also handles the submission of the booking form and generates a receipt in a new window.

### 5. SeatGrid

`SeatGrid` is another subcomponent of the `MovieBookingPage` that displays the seat grid of the auditorium. It allows users to select seats based on the number of tickets they have chosen. The component takes into account occupied seats and updates the selected seats as the user interacts with the grid.

## Usage

To run the project locally, follow these steps:

1. Clone the repository
2. Install the dependencies using `npm install`
3. Run the development server using `npm run dev`
4. Check the terminal output to see the port used.