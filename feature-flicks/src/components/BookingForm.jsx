import React from 'react';
import { Form, Col, Button, Row } from 'react-bootstrap';

const BookingForm = ({
    normalTickets,
    setNormalTickets,
    seniorTickets,
    setSeniorTickets,
    childTickets,
    setChildTickets,
    selectedSeats,
    screening,
    formatDate,
    PopcornSVG,
  }) => {
    function handleSubmit(event) {
        event.preventDefault();
      
        if (selectedSeats.length === 0) {
          alert("Please select at least one seat.");
          return;
        }

        const totalTickets = normalTickets + seniorTickets + childTickets;
        if (totalTickets > selectedSeats.length){
          alert("You must select as many seats as tickets.");
          return
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
    }


    
    return (
        <Form onSubmit={handleSubmit}>
          <Row className="ticketInputsContainer">
            <Col>
              <Form.Label htmlFor="normalTickets">
                <strong>Normal: </strong>
              </Form.Label>
              <Form.Control
                id="normalTickets"
                type="number"
                min="0"
                value={normalTickets}
                onChange={(e) => setNormalTickets(parseInt(e.target.value))}
                className="ticketInput"
              />
            </Col>
            <Col>
              <Form.Label htmlFor="seniorTickets">
                <strong>Senior: </strong>
              </Form.Label>
              <Form.Control
                id="seniorTickets"
                type="number"
                min="0"
                value={seniorTickets}
                onChange={(e) => setSeniorTickets(parseInt(e.target.value))}
                className="ticketInput"
              />
            </Col>
            <Col>
              <Form.Label htmlFor="childTickets">
                <strong>Child: </strong>
              </Form.Label>
              <Form.Control
                id="childTickets"
                type="number"
                min="0"
                value={childTickets}
                onChange={(e) => setChildTickets(parseInt(e.target.value))}
                className="ticketInput"
              />
            </Col>
          </Row>
          <Button type="submit" className="bookSeatsButton" variant="primary">
            Book Seats
          </Button>
        </Form>
      );}
    export default BookingForm;