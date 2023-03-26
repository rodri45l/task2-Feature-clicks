import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieBookingPage.css';
import PopcornSVG from '../assets/popcornBlack.svg'
import SeatGrid from './SeatGrid';
import BookingForm from './BookingForm';
import { Container, Row, Col, Image } from 'react-bootstrap';
import phoneSVG from '../assets/smartphone.svg';



const MovieBookingPage = () => {

    const { id } = useParams();
    const [screening, setScreening] = useState(null);
    const [seats, setSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [normalTickets, setNormalTickets] = useState(0);
    const [seniorTickets, setSeniorTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]);








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
        <Container>
            <Row className="mt-5">
                <Col md={4}>
                    <Image
                        src={`https://cinema-rest.nodehill.se${screening.movie.description.posterImage}`}
                        alt={screening.movie.title}
                        width="300"
                        height="450"
                    />
                </Col>
                <Col md={8}>
                    <h1>{screening.movie.title}</h1>
                    <h2>{formatDate(screening.screeningTime)}</h2>
                    <BookingForm
                        normalTickets={normalTickets}
                        setNormalTickets={setNormalTickets}
                        seniorTickets={seniorTickets}
                        setSeniorTickets={setSeniorTickets}
                        childTickets={childTickets}
                        setChildTickets={setChildTickets}
                        selectedSeats={selectedSeats}
                        screening={screening}
                        formatDate={formatDate}
                        PopcornSVG={PopcornSVG}
                    />
                    <div className="screen-container">
                        <div className="screen-text">SCREEN</div>
                    </div>
                </Col>
            </Row>
           
            <SeatGrid
                seats={seats}
                occupiedSeats={occupiedSeats}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                normalTickets={normalTickets}
                seniorTickets={seniorTickets}
                childTickets={childTickets}
            />
        </Container>
    );


};

export default MovieBookingPage;
