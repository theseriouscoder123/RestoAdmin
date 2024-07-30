import React, { useState } from 'react';
import land from '../assets/auth_land_image.jpg';
import {
  Container,
  Image,
  Row,
  Col,
  Form,
  Button,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Make sure the path to your firebase.js file is correct
import { signInWithEmailAndPassword } from 'firebase/auth';
const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth,email,password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
      setEmailError(true);
      setPasswordError(true);
      console.error('Error logging in', error);
    }
  };

  return (
    <>
      <Container fluid className="p-0 vh-100">
        <Row className="h-100 m-0 w-100">
          <Col xs={9} className="p-0">
            <Image src={land} style={{ width: '100%', height: '100vh' }} />
          </Col>
          <Col
            xs={3}
            className="bg-light d-flex flex-column justify-content-center align-items-center"
          >
            <div className="text-center mb-4">
              <h4>Welcome to Admin Application</h4>
            </div>
            <Form style={{ maxWidth: '250px', width: '100%' }} onSubmit={handleSubmit}>
              {error && <p className="text-danger text-center">{error}</p>}
              <FormGroup controlId="formUserId" className="mb-3">
                <FormControl
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                    setError('');
                  }}
                  className={emailError ? 'border-danger' : ''}
                />
              </FormGroup>
              <FormGroup controlId="formPassword" className="mb-3">
                <FormControl
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                    setError('');
                  }}
                  className={passwordError ? 'border-danger' : ''}
                />
              </FormGroup>
              <Button
                type="submit"
                className="mb-3 w-100"
                style={{ backgroundColor: '#e6534c' }}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuthPage;
