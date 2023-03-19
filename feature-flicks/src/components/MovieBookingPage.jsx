import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieBookingPage.css';
import PopcornSVG from '../assets/popcornBlack.svg'

const MovieBookingPage = () => {

    const { id } = useParams();
    const [screening, setScreening] = useState(null);
    const [seats, setSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [normalTickets, setNormalTickets] = useState(0);
    const [seniorTickets, setSeniorTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]);


    function handleSubmit(event) {
        event.preventDefault();
      
        if (selectedSeats.length === 0) {
          alert("Please select at least one seat.");
          return;
        }
      
        const totalPrice = normalTickets * 85 + seniorTickets * 75 + childTickets * 65;
        const bookingNumber = Math.floor(Math.random() * 1000000);
      
        const receiptWindow = window.open("", "receiptWindow", "width=800,height=600");
        receiptWindow.document.write("<html><head><title>Receipt</title></head><body>");
        receiptWindow.document.write('<div style="text-align: center;">');
        receiptWindow.document.write(`<img src="${PopcornSVG}" alt="Feature Flicks" width="100" height="100" />`); // Adjust width and height as needed
        receiptWindow.document.write("<h1>Feature Flicks</h1>");
        receiptWindow.document.write("</div>");
        receiptWindow.document.write("<h2>Booking Receipt</h2>");
        receiptWindow.document.write(`<p><strong>Booking Number:</strong> ${bookingNumber}</p>`);
        receiptWindow.document.write(`<p><strong>Movie:</strong> ${screening.movie.title}</p>`);
        receiptWindow.document.write(`<p><strong>Date & Time:</strong> ${formatDate(screening.screeningTime)}</p>`);
        receiptWindow.document.write(`<p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>`);
        receiptWindow.document.write(`<p><strong>Normal Tickets:</strong> ${normalTickets}</p>`);
        receiptWindow.document.write(`<p><strong>Senior Tickets:</strong> ${seniorTickets}</p>`);
        receiptWindow.document.write(`<p><strong>Child Tickets:</strong> ${childTickets}</p>`);
        receiptWindow.document.write(`<p><strong>Total Price:</strong> SEK ${totalPrice}</p>`);
        receiptWindow.document.write('<button onclick="window.print()">Print Receipt</button>');
        receiptWindow.document.write("</body></html>");
      
        // You can also clear the form and reset the states, if necessary
      }
      




    function formatDate(dateString) {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        const date = new Date(dateString);
        return date.toLocaleString("en-US", options);
    }

    function formatTime(dateString) {
        const options = { hour: "2-digit", minute: "2-digit" };
        const date = new Date(dateString);
        return date.toLocaleString("en-US", options);
    }
    function generateSeatGrid(numberOfSeats) {
        const numberOfRows = Math.ceil(Math.sqrt(numberOfSeats));
        const numberOfCols = Math.ceil(numberOfSeats / numberOfRows);
        const grid = Array(numberOfRows).fill(null).map(() => Array(numberOfCols).fill(null));
        let seatNumber = 1;

        for (let row = 0; row < numberOfRows; row++) {
            for (let col = numberOfCols - 1; col >= 0; col--) {
                if (seatNumber <= numberOfSeats) {
                    grid[row][col] = seatNumber;
                    seatNumber++;
                }
            }
        }

        return grid;
    }



    function renderSeat(seat, occupied) {
        const seatSelected = selectedSeats.includes(seat);
        const seatClass = seatSelected ? 'seat selected' : 'seat';


        const totalTickets = normalTickets + seniorTickets + childTickets;
      
        const handleSeatClick = () => {
          if (occupied) {
            return;
          }
      
          if (seatSelected) {
            setSelectedSeats((prevSelectedSeats) => prevSelectedSeats.filter((s) => s !== seat));
          } else if (selectedSeats.length < totalTickets) {
            setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
          } else {
            alert("You have already selected the maximum number of seats allowed.");
          }
        };
      
        return (
          <button
            key={seat}
            className={seatClass}
            onClick={handleSeatClick}
            disabled={occupied}
          >
            {seat}
          </button>
        );
      }




      function renderSeats() {
        const renderExampleSeat = (label, additionalClass, isDisabled) => (
          <button className={`seat ${additionalClass}`} disabled={isDisabled}>
            {label}
          </button>
        );
      
        return (
            <div className="bookingGrid">
              <div className="legend">
                {renderExampleSeat("Free", "legend", false)}
                {renderExampleSeat("Selected", "selected legend", false)}
                {renderExampleSeat("Occupied", "legend", true)}
              </div>
              <div className="seatsContainer">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    {row.map((seat, colIndex) => (
                      seat ? (
                        renderSeat(seat, occupiedSeats.includes(seat))
                      ) : null
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        }
      
      
      





    useEffect(() => {
        async function fetchScreenings() {
            try {
                const screeningsResponse = await fetch('/api/screenings_overview');
                const screenings = await screeningsResponse.json();


                const moviesResponse = await fetch('/api/movies');
                const movies = await moviesResponse.json();


                // Create a map with movie IDs as keys and movie objects as values
                const movieMap = new Map();
                movies.forEach(movie => {
                    movieMap.set(movie.title, movie);

                });

                // Add movie object to each screening
                const screeningsWithMovieInfo = screenings.map(screening => {
                    return {
                        ...screening,
                        movie: movieMap.get(screening.movie),
                    };
                });



                // Find the screening that matches the ID of the movie being booked
                const movieId = id;



                const matchingScreening = screeningsWithMovieInfo.find(screening => screening.movie.id === parseInt(movieId, 10));

                setScreening(matchingScreening);

                const auditoriumResponse = await fetch(`/api/seats_per_auditorium`);
                const auditoriums = await auditoriumResponse.json();
                const auditorium = auditoriums.find(aud => aud.name === matchingScreening.auditorium);

                const seatGrid = generateSeatGrid(auditorium.numberOfSeats);
                setSeats(seatGrid);

                const occupiedSeatsResponse = await fetch(`/api/occupied_seats?screeningId=${matchingScreening.screeningId}`);
                const occupiedSeatsData = await occupiedSeatsResponse.json();
                setOccupiedSeats(occupiedSeatsData[0].occupiedSeats.split(', ').map(seat => parseInt(seat, 10)));





            } catch (error) {
                console.error('Error fetching screenings:', error);
            }
        }



        fetchScreenings();
    }, [id]);


    if (!screening) {
        return (
          <div>
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        );
      }
      

    return (
        <div>
         
          <h1>{screening.movie.title}</h1>
          <h2>{formatDate(screening.screeningTime)}</h2>
          <img
            src={`https://cinema-rest.nodehill.se${screening.movie.description.posterImage}`}
            alt={screening.movie.title}
            width="300"
            height="450"
          />
          <form onSubmit={handleSubmit}>
            <div className="ticketInputsContainer">
              <div>
                <label htmlFor="normalTickets">
                  <strong>Normal: </strong>
                </label>
                <input
                  id="normalTickets"
                  type="number"
                  min="0"
                  value={normalTickets}
                  onChange={(e) => setNormalTickets(parseInt(e.target.value))}
                  className="ticketInput"
                />
              </div>
              <div>
                <label htmlFor="seniorTickets">
                  <strong>Senior: </strong>
                </label>
                <input
                  id="seniorTickets"
                  type="number"
                  min="0"
                  value={seniorTickets}
                  onChange={(e) => setSeniorTickets(parseInt(e.target.value))}
                  className="ticketInput"
                />
              </div>
              <div>
                <label htmlFor="childTickets">
                  <strong>Child: </strong>
                </label>
                <input
                  id="childTickets"
                  type="number"
                  min="0"
                  value={childTickets}
                  onChange={(e) => setChildTickets(parseInt(e.target.value))}
                  className="ticketInput"
                />
              </div>
            </div>
            <button type="submit" className="bookSeatsButton">
              Book Seats
            </button>
          </form>
          <div className="screen-container">
  <div className="screen-text">SCREEN</div>
</div>

          {renderSeats()}
        </div>
      );
      

};

export default MovieBookingPage;
