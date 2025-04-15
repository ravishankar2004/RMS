import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container className="text-center py-5">
            <h1>404</h1>
            <p>Oops! The page you're looking for does not exist.</p>
            <Link to="/">
                <Button variant="primary">Go Back to Homepage</Button>
            </Link>
        </Container>
    );
};

export default NotFoundPage;
