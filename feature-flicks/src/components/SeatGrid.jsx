import { Container, Row, Col } from 'react-bootstrap';

const SeatGrid = ({ seats, occupiedSeats, selectedSeats, setSelectedSeats, normalTickets, seniorTickets, childTickets }) => {

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

  function renderExampleSeat(label, additionalClass, isDisabled) {
    return (
      <button className={`seat ${additionalClass}`} disabled={isDisabled}>
        {label}
      </button>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
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
        </Col>
      </Row>
    </Container>
  );
}
;

export default SeatGrid;
  