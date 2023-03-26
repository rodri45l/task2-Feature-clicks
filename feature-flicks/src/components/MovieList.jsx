import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, FormControl, InputGroup, Form } from "react-bootstrap";
import moment from 'moment';
import { Link } from 'react-router-dom';



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

function formatDateWithWeekday(dateString) {
  const date = new Date(dateString);
  return moment(date).format('dddd, MMM D, YYYY');
}


const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentDay, setCurrentDay] = useState(moment("2023-05-01"));
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);



  const filterMoviesByCategory = (moviesToFilter, category) => {
    if (!category) return moviesToFilter;
    return moviesToFilter.filter((movie) => movie.description.categories.includes(category));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };




  const getMoviesByDay = (day) => {
    const filtered = movies.filter((movie) => {
      const movieDay = moment(movie.screeningTime).startOf("day");
      return movieDay.isSame(day.startOf("day"));
    });
    return filtered;
  };

  const handlePrevDay = () => {
    setCurrentDay(moment(currentDay).subtract(1, "days"));
  };

  const handleNextDay = () => {
    setCurrentDay(moment(currentDay).add(1, "days"));
  };


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const screeningsResponse = await fetch("/api/screenings_overview");
        const screeningsData = await screeningsResponse.json();

        const moviesResponse = await fetch("/api/movies");
        const moviesData = await moviesResponse.json();



        const moviesMap = new Map();
        moviesData.forEach((movie) => {
          moviesMap.set(movie.title, movie);
        });

        const combinedData = screeningsData.map((screening) => {
          const movie = moviesMap.get(screening.movie);
          return { ...screening, ...movie };
        });



        setMovies(combinedData);
        console.log(combinedData);

        const uniqueCategories = new Set();
        combinedData.forEach((movie) => {
          movie.description.categories.forEach((category) => {
            uniqueCategories.add(category);
          });
        });

        console.log(uniqueCategories);
        setCategories(Array.from(uniqueCategories));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      finally {
        // Hide loader
        setIsLoading(false);
      }


    };

    fetchMovies();
  }, [currentDay]);

  useEffect(() => {
    const filteredByDay = getMoviesByDay(currentDay);
    const filteredByCategory = filterMoviesByCategory(filteredByDay, selectedCategory);
    setFilteredMovies(filteredByCategory);
  }, [movies, currentDay, selectedCategory]);




  return (
    <Container>
      {isLoading && (
        <div className="d-flex justify-content-center my-5">
           <div className="loader"></div>
           <strong>Loading...</strong>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="date-navigation">
            <Button variant="secondary" onClick={handlePrevDay}>
              &lt;
            </Button>
            <h3 className="mb-0">{formatDateWithWeekday(currentDay)}</h3>
            <Button variant="secondary" onClick={handleNextDay}>
              &gt;
            </Button>
          </div>
          <Row className="mb-3">
            <Col>
              <Form>
                <Form.Group controlId="categorySelect">
                  <Form.Label>Filter by category: </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row className="mt-4">
            {filteredMovies.map((movie, index) => (
              <Col
                className="mt-4"
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card className="mb-4 mt-4 custom-border">
                  <Card.Img
                    variant="top"
                    src={`https://cinema-rest.nodehill.se${movie.description.posterImage}`}
                    alt={movie.title}
                    height="400"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ fontSize: "1.6rem", fontWeight: "bold" }}
                    >
                      <strong>{movie.title}</strong>
                    </Card.Title>
                    <Card.Text>
                      <strong>Screening:</strong> {formatDate(movie.screeningTime)}
                    </Card.Text>
                    <Card.Text>
                      <strong>Length:</strong>{" "}
                      {Math.floor(movie.description.length / 60)}h{" "}
                      {movie.description.length % 60}m
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/bookings/${movie.id}`}
                      variant="outline-primary"
                    >
                      Book Tickets
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
  
      <style type="text/css">
        {`
      .date-navigation {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
      }
      .custom-border {
        border: 2px solid #646cff;
        border-radius: 10px;
        margin-bottom: 1rem;
        margin-top: 1rem;
        max-width: 400px;
        min-width: 400px;
      }
  
      .date-navigation > * {
        margin: 0 0.5rem;
      }
    `}
      </style>
    </Container>
  );

};


export default MovieList;